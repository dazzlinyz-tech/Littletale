import React, { useState } from 'react';
import { PictureMatchQuestion } from '../../types/wordAdventure';
import { soundEngine, speakSentence } from '../../utils/audio';
import { Volume2, CheckCircle2, Sparkles, RotateCcw, ArrowRight, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PictureMatchGameProps {
  questions: PictureMatchQuestion[];
  onGameComplete: (starsEarned: number) => void;
  onBackToMenu: () => void;
}

export const PictureMatchGame: React.FC<PictureMatchGameProps> = ({
  questions,
  onGameComplete,
  onBackToMenu,
}) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState(false);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [starsEarned, setStarsEarned] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ: PictureMatchQuestion = questions[currentQuestionIdx];

  const handleSpeakPrompt = () => {
    soundEngine.playPop();
    speakSentence(currentQ.prompt, { rate: 0.85, pitch: 1.15 });
  };

  const handleSelectOption = (opt: typeof currentQ.options[0]) => {
    soundEngine.playPop();
    setSelectedOptionId(opt.id);

    if (opt.isCorrect) {
      soundEngine.playSuccessChime();
      setIsAnsweredCorrectly(true);
      setHintMessage(null);
      setStarsEarned((prev) => prev + 1);

      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#F59E0B', '#10B981', '#38BDF8', '#EC4899'],
        });
      } catch (e) {}

      speakSentence(`Super! That is the ${opt.word}!`, { rate: 0.9, pitch: 1.2 });
    } else {
      soundEngine.playHintSound();
      setHintMessage(currentQ.hint);
      speakSentence('Try again! ' + currentQ.hint, { rate: 0.85, pitch: 1.1 });
    }
  };

  const handleNextQuestion = () => {
    soundEngine.playPop();
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnsweredCorrectly(false);
      setHintMessage(null);
    } else {
      setIsFinished(true);
      soundEngine.playSuccessChime();
      onGameComplete(starsEarned + (isAnsweredCorrectly ? 1 : 0));
    }
  };

  const handleRestart = () => {
    soundEngine.playPop();
    setCurrentQuestionIdx(0);
    setSelectedOptionId(null);
    setIsAnsweredCorrectly(false);
    setHintMessage(null);
    setStarsEarned(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border-4 border-amber-300 text-center flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-4xl shadow-lg border-4 border-white mb-3 animate-bounce">
          🌟
        </div>

        <h2 className="text-3xl font-black font-heading text-amber-950 mb-1">
          Picture Match Master!
        </h2>
        <p className="text-sm font-bold text-slate-600 mb-4">
          You matched all the storybook pictures!
        </p>

        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 mb-5 w-full flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="text-base font-black text-amber-950">
            Earned +{starsEarned} Star Flowers! 🌸
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            onClick={handleRestart}
            className="py-3 px-4 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-sm flex items-center justify-center gap-1.5 cursor-pointer border border-amber-300"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          <button
            onClick={onBackToMenu}
            className="py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 text-white font-black text-sm shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>All Games</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md flex flex-col items-center select-none">
      {/* Question Header & Progress Bar */}
      <div className="w-full flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
          Question {currentQuestionIdx + 1} of {questions.length}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-amber-600">⭐ {starsEarned} Stars</span>
        </div>
      </div>

      {/* Main Prompt Card */}
      <div className="w-full bg-gradient-to-r from-amber-50 via-orange-50/80 to-amber-50 rounded-3xl p-4 shadow-md border-3 border-amber-300 mb-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <span className="text-2xl">🖼️</span>
          <h3 className="text-xl sm:text-2xl font-black font-heading text-amber-950">
            {currentQ.prompt}
          </h3>
          <button
            onClick={handleSpeakPrompt}
            className="w-8 h-8 rounded-full bg-amber-400 hover:bg-amber-500 text-amber-950 flex items-center justify-center cursor-pointer shadow-xs active:scale-90 transition-all"
            title="Hear instruction"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs font-bold text-amber-800">
          "{currentQ.targetWord}" ({currentQ.targetKorean}) 그림을 찾아보세요!
        </p>

        {/* Hint banner if incorrect */}
        {hintMessage && (
          <div className="mt-2.5 p-2 rounded-xl bg-rose-50 border border-rose-300 text-xs font-bold text-rose-800 animate-bounce flex items-center justify-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>{hintMessage}</span>
          </div>
        )}

        {/* Success banner if correct */}
        {isAnsweredCorrectly && (
          <div className="mt-2.5 p-2 rounded-xl bg-emerald-100 border border-emerald-400 text-xs font-black text-emerald-900 animate-fadeIn flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Super! You found the {currentQ.targetWord}! ✨</span>
          </div>
        )}
      </div>

      {/* Picture Choices Grid (3 cards) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {currentQ.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          const isCorrectChoice = opt.isCorrect;

          let cardStyle = 'border-amber-200 bg-white hover:border-amber-400 hover:scale-102';
          if (isSelected) {
            if (isCorrectChoice) {
              cardStyle = 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-300/50 scale-105';
            } else {
              cardStyle = 'border-rose-400 bg-rose-50 ring-2 ring-rose-200';
            }
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt)}
              disabled={isAnsweredCorrectly}
              className={`rounded-2xl overflow-hidden border-3 shadow-md flex flex-col items-center cursor-pointer transition-all active:scale-95 group ${cardStyle}`}
            >
              <div className="relative w-full h-32 sm:h-28 overflow-hidden bg-amber-100">
                <img
                  src={opt.image}
                  alt={opt.word}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-1.5 left-1.5 w-7 h-7 rounded-full bg-white/95 text-sm flex items-center justify-center shadow-xs">
                  {opt.icon}
                </span>

                {isSelected && isCorrectChoice && (
                  <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[1px] flex items-center justify-center">
                    <span className="text-3xl">✨</span>
                  </div>
                )}
              </div>

              <div className="p-2 w-full text-center bg-white">
                <span className="text-sm font-black text-amber-950 block">
                  {opt.word}
                </span>
                <span className="text-[11px] font-bold text-amber-700/80">
                  {opt.korean}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Controls: Next Button */}
      {isAnsweredCorrectly && (
        <button
          onClick={handleNextQuestion}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white font-black text-base shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all animate-bounce"
        >
          <span>Next Word ➔</span>
        </button>
      )}
    </div>
  );
};
