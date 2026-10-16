import React, { useState } from 'react';
import { BunnyQuizQuestion } from '../../types/wordAdventure';
import { soundEngine, speakSentence } from '../../utils/audio';
import { CheckCircle2, XCircle, Sparkles, RotateCcw, ArrowRight, Volume2, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BunnyQuizGameProps {
  questions: BunnyQuizQuestion[];
  onGameComplete: (starsEarned: number) => void;
  onBackToMenu: () => void;
}

export const BunnyQuizGame: React.FC<BunnyQuizGameProps> = ({
  questions,
  onGameComplete,
  onBackToMenu,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [missedWords, setMissedWords] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ: BunnyQuizQuestion = questions[currentIdx];

  const handleSpeakQuestion = () => {
    soundEngine.playPop();
    speakSentence(currentQ.questionText, { rate: 0.85, pitch: 1.15 });
  };

  const handleSelectOption = (optId: string) => {
    if (isSubmitted) return;
    soundEngine.playPop();
    setSelectedOptId(optId);
    setIsSubmitted(true);

    const chosen = currentQ.options.find((o) => o.id === optId);
    if (chosen?.isCorrect) {
      soundEngine.playSuccessChime();
      setScore((prev) => prev + 1);
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {}
      speakSentence('Great job! That is correct!', { rate: 0.95, pitch: 1.2 });
    } else {
      soundEngine.playHintSound();
      if (!missedWords.includes(currentQ.correctWord)) {
        setMissedWords((prev) => [...prev, currentQ.correctWord]);
      }
      speakSentence('The correct answer is ' + currentQ.correctWord, { rate: 0.85, pitch: 1.1 });
    }
  };

  const handleNextQuestion = () => {
    soundEngine.playPop();
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOptId(null);
      setIsSubmitted(false);
    } else {
      setIsFinished(true);
      soundEngine.playSuccessChime();
      const starsEarned = Math.max(1, Math.round((score / questions.length) * 5));
      onGameComplete(starsEarned);
    }
  };

  const handleRestartQuiz = () => {
    soundEngine.playPop();
    setCurrentIdx(0);
    setSelectedOptId(null);
    setIsSubmitted(false);
    setScore(0);
    setMissedWords([]);
    setIsFinished(false);
  };

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const starsEarned = Math.max(1, Math.round((score / questions.length) * 5));

    return (
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border-4 border-amber-300 text-center flex flex-col items-center select-none">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 via-rose-300 to-yellow-300 flex items-center justify-center shadow-lg border-4 border-white mb-2 animate-bounce">
          <Award className="w-10 h-10 text-amber-950" />
        </div>

        <h2 className="text-3xl font-black font-heading text-amber-950 mb-1">
          Bunny Quiz Results
        </h2>
        <p className="text-sm font-bold text-slate-600 mb-4">
          You answered {score} out of {questions.length} questions correctly! ({percentage}%)
        </p>

        {/* Stars reward badge */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-200 mb-4 w-full flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="text-base font-black text-amber-950">
            Earned +{starsEarned} Star Flowers! 🌸
          </span>
        </div>

        {/* Words to review card */}
        {missedWords.length > 0 ? (
          <div className="w-full p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 mb-4 text-left">
            <span className="text-xs font-black text-rose-800 block mb-1">
              🌱 Words to review again:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {missedWords.map((word, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-white border border-rose-300 rounded-xl text-xs font-black text-rose-900 shadow-xs"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-300 mb-4 text-center text-xs font-black text-emerald-800">
            🎉 Perfect Score! You know all the story words!
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            onClick={handleRestartQuiz}
            className="py-3 px-4 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-sm flex items-center justify-center gap-1.5 cursor-pointer border border-amber-300"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Quiz</span>
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
      {/* Header & Progress Indicator */}
      <div className="w-full flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
          Question {currentIdx + 1} of {questions.length}
        </span>
        <span className="text-xs font-bold text-amber-700">
          Score: {score} / {currentIdx}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-amber-100 overflow-hidden mb-3 border border-amber-200">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="w-full bg-white rounded-3xl p-4 sm:p-5 shadow-lg border-4 border-amber-200 mb-4 text-center">
        {/* Optional Story Illustration for picture-based question */}
        {currentQ.image && (
          <div className="relative w-full h-36 sm:h-40 rounded-2xl overflow-hidden mb-3 border-2 border-amber-200 shadow-sm bg-amber-50">
            <img
              src={currentQ.image}
              alt="Quiz scene"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center justify-center gap-2 mb-1">
          <h3 className="text-base sm:text-lg font-black font-heading text-amber-950">
            {currentQ.questionText}
          </h3>
          <button
            onClick={handleSpeakQuestion}
            className="w-7 h-7 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 flex items-center justify-center cursor-pointer shadow-xs active:scale-90"
            title="Listen to question"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {currentQ.questionSubtext && (
          <p className="text-sm sm:text-base font-extrabold text-amber-800 mb-2">
            {currentQ.questionSubtext}
          </p>
        )}

        {/* Answer Options */}
        <div className="flex flex-col gap-2.5 mt-3">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOptId === opt.id;
            let btnStyle = 'bg-amber-50/70 border-amber-200 hover:bg-amber-100/70 text-slate-800';

            if (isSubmitted) {
              if (opt.isCorrect) {
                btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 ring-2 ring-emerald-300';
              } else if (isSelected) {
                btnStyle = 'bg-rose-100 border-rose-400 text-rose-950 ring-2 ring-rose-300';
              } else {
                btnStyle = 'bg-slate-50 border-slate-200 opacity-50';
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                disabled={isSubmitted}
                className={`w-full py-3 px-4 rounded-2xl border-2 font-black text-sm sm:text-base flex items-center justify-between transition-all cursor-pointer shadow-xs active:scale-98 ${btnStyle}`}
              >
                <div className="flex items-center gap-2 text-left">
                  <span>{opt.text}</span>
                  {opt.subtext && (
                    <span className="text-xs font-bold opacity-75">({opt.subtext})</span>
                  )}
                </div>

                {isSubmitted && (
                  <div>
                    {opt.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-rose-500 fill-rose-100" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Explanation Banner */}
        {isSubmitted && (
          <div className="mt-3.5 p-3 rounded-2xl bg-amber-50 border-2 border-amber-200 text-left animate-fadeIn">
            <span className="text-[10px] font-black uppercase text-amber-700 block mb-0.5">
              💡 Storybook Clue:
            </span>
            <p className="text-xs font-bold text-amber-950 leading-relaxed">
              {currentQ.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Next Question Button */}
      {isSubmitted && (
        <button
          onClick={handleNextQuestion}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 text-white font-black text-base shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all animate-bounce"
        >
          <span>{currentIdx < questions.length - 1 ? 'Next Question ➔' : 'See My Results 🏆'}</span>
        </button>
      )}
    </div>
  );
};
