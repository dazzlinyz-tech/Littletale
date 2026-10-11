import React, { useState, useEffect } from 'react';
import { StoryQuestion, QuestionChoice } from '../types/story';
import { soundEngine, speakSentence } from '../utils/audio';
import { Volume2, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChoiceIcon } from './ChoiceIcon';

interface StoryQuestionModalProps {
  question: StoryQuestion;
  onCorrect: () => void;
  onRequestHint?: () => void;
  isCompleted?: boolean;
}

export const StoryQuestionModal: React.FC<StoryQuestionModalProps> = ({
  question,
  onCorrect,
  onRequestHint,
  isCompleted = false,
}) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [hintVisible, setHintVisible] = useState(false);
  const [shakeCardId, setShakeCardId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedChoiceId(null);
    setFeedbackState(isCompleted ? 'correct' : 'idle');
    setHintVisible(false);
    setShakeCardId(null);

    if (!isCompleted) {
      const timer = setTimeout(() => {
        speakQuestion();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [question.promptText, isCompleted]);

  const speakQuestion = () => {
    soundEngine.playPop();
    speakSentence(question.voicePrompt, { rate: 0.9, pitch: 1.15 });
  };

  const handleHearChoice = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    soundEngine.playPop();
    speakSentence(text, { rate: 0.85, pitch: 1.15 });
  };

  const handleChoiceClick = (choice: QuestionChoice) => {
    if (feedbackState === 'correct') return;

    soundEngine.playPop();
    setSelectedChoiceId(choice.id);

    if (choice.isCorrect) {
      // Correct sentence selected!
      setFeedbackState('correct');
      soundEngine.playSuccessChime();

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
        });
      } catch (err) {}

      speakSentence('Correct sentence! Well done!', {
        rate: 1.0,
        pitch: 1.2,
        onEnd: () => {
          setTimeout(() => {
            onCorrect();
          }, 600);
        },
      });
    } else {
      // Incorrect sentence
      setFeedbackState('wrong');
      setShakeCardId(choice.id);
      setHintVisible(true);
      soundEngine.playHintSound();

      if (onRequestHint) {
        onRequestHint();
      }

      speakSentence('Try again! ' + question.targetHint, {
        rate: 0.85,
        pitch: 1.1,
      });

      setTimeout(() => {
        setShakeCardId(null);
      }, 600);
    }
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-lg border-2 border-amber-200/80 transition-all select-none">
      {/* Top Header with Voice button */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
            ?
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block">
              Step 1 • Sentence Quiz
            </span>
            <span className="text-xs font-bold text-slate-700">
              {question.promptText}
            </span>
          </div>
        </div>

        <button
          onClick={speakQuestion}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
        >
          <Volume2 className="w-4 h-4" />
          <span>Listen</span>
        </button>
      </div>

      {/* Gentle Hint Message if triggered */}
      {hintVisible && feedbackState === 'wrong' && (
        <div className="mb-2.5 p-2 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-2 animate-bounce">
          <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Hint: {question.targetHint}</span>
        </div>
      )}

      {/* Success Celebration Message */}
      {feedbackState === 'correct' && (
        <div className="mb-2.5 p-2 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-black flex items-center justify-center gap-2 animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Correct Sentence Selected! ⭐</span>
        </div>
      )}

      {/* 2 Sentence Choice Cards (Learner MUST pick the correct sentence to advance!) */}
      <div className="flex flex-col gap-2.5">
        {question.choices.map((choice) => {
          const isSelected = selectedChoiceId === choice.id;
          const isShaking = shakeCardId === choice.id;
          const isRight = feedbackState === 'correct' && choice.isCorrect;

          let cardStyle = 'bg-amber-50/60 border-amber-200 text-slate-800 hover:bg-amber-100/70 hover:border-amber-300';
          if (isRight) {
            cardStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 ring-3 ring-emerald-300 shadow-md';
          } else if (isSelected && !choice.isCorrect) {
            cardStyle = 'bg-rose-50 border-rose-300 text-rose-800 ring-2 ring-rose-200';
          }

          return (
            <div
              key={choice.id}
              onClick={() => handleChoiceClick(choice)}
              className={`relative p-3.5 rounded-2xl border-2 text-left flex items-center justify-between gap-3 transition-all cursor-pointer shadow-xs active:scale-98 ${cardStyle} ${
                isShaking ? 'animate-wobble' : ''
              }`}
            >
              {/* Left icon & full sentence text */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <ChoiceIcon icon={choice.icon} size={42} />

                <div className="flex flex-col min-w-0">
                  <span className="font-heading font-black text-base sm:text-lg leading-snug">
                    "{choice.text}"
                  </span>
                  {/* Explanation / feedback subtext is strictly HIDDEN initially, only revealed AFTER user makes a choice */}
                  {isSelected && !choice.isCorrect && (
                    <span className="text-[11px] font-bold text-rose-600 animate-fadeIn mt-0.5 flex items-center gap-1">
                      <span>❌ Not quite! Try again</span>
                      {choice.subtext && <span className="opacity-80">({choice.subtext})</span>}
                    </span>
                  )}
                  {isRight && (
                    <span className="text-[11px] font-bold text-emerald-700 animate-fadeIn mt-0.5 flex items-center gap-1">
                      <span>✨ Great choice! Matches the story!</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Hear sentence audio button */}
              <button
                type="button"
                onClick={(e) => handleHearChoice(e, choice.text)}
                className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shrink-0 border border-slate-200 shadow-xs cursor-pointer active:scale-90 transition-transform"
                title="Hear sentence"
              >
                <Volume2 className="w-4 h-4 text-amber-600" />
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-2 text-center text-[11px] text-slate-500 font-semibold">
        💡 To clear this page, tap the sentence that matches the story!
      </p>
    </div>
  );
};
