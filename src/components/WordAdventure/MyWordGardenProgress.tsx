import React from 'react';
import { WordGardenProgress, WordAdventureItem } from '../../types/wordAdventure';
import { soundEngine } from '../../utils/audio';
import { Sparkles, Star, Award, RotateCcw, CheckCircle2, BookOpen } from 'lucide-react';

interface MyWordGardenProgressProps {
  progress: WordGardenProgress;
  vocabularyList: WordAdventureItem[];
  onResetProgress: () => void;
  onGoToReview: () => void;
}

export const MyWordGardenProgress: React.FC<MyWordGardenProgressProps> = ({
  progress,
  vocabularyList,
  onResetProgress,
  onGoToReview,
}) => {
  const learnedWords = vocabularyList.filter((w) => progress.learnedWordIds.includes(w.id));
  const needsPracticeWords = vocabularyList.filter((w) => !progress.learnedWordIds.includes(w.id));

  return (
    <div className="w-full max-w-md flex flex-col items-center select-none">
      {/* Garden Trophy Header */}
      <div className="w-full bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 rounded-3xl p-5 shadow-lg border-4 border-amber-300 mb-4 text-center">
        <div className="w-16 h-16 rounded-full bg-white mx-auto flex items-center justify-center text-3xl shadow-md border-3 border-amber-300 mb-2">
          🌸
        </div>

        <h3 className="text-2xl font-black font-heading text-amber-950 mb-1">
          My Word Garden
        </h3>
        <p className="text-xs font-bold text-amber-800">
          "Every word you practice blooms into a sweet flower!"
        </p>

        {/* 3 Stats Badges */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="p-2.5 rounded-2xl bg-white border-2 border-amber-200 shadow-xs flex flex-col items-center">
            <span className="text-xl">⭐</span>
            <span className="text-lg font-black text-amber-900 leading-tight">
              {progress.stars}
            </span>
            <span className="text-[10px] font-bold text-amber-700">Stars</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-white border-2 border-amber-200 shadow-xs flex flex-col items-center">
            <span className="text-xl">🌸</span>
            <span className="text-lg font-black text-emerald-800 leading-tight">
              {learnedWords.length}
            </span>
            <span className="text-[10px] font-bold text-emerald-700">Learned</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-white border-2 border-amber-200 shadow-xs flex flex-col items-center">
            <span className="text-xl">🎮</span>
            <span className="text-lg font-black text-purple-900 leading-tight">
              {progress.gamesCompleted}
            </span>
            <span className="text-[10px] font-bold text-purple-700">Games Won</span>
          </div>
        </div>
      </div>

      {/* Blooming Learned Words Card */}
      <div className="w-full bg-white rounded-3xl p-4 sm:p-5 shadow-md border-3 border-amber-200 mb-4">
        <div className="flex items-center justify-between border-b border-amber-100 pb-2 mb-3">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h4 className="font-heading font-black text-slate-800 text-sm sm:text-base">
              Blooming Words ({learnedWords.length} / {vocabularyList.length})
            </h4>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {Math.round((learnedWords.length / vocabularyList.length) * 100)}% Mastered
          </span>
        </div>

        {learnedWords.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {learnedWords.map((item) => (
              <div
                key={item.id}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 border-2 border-emerald-200 text-emerald-950 font-black text-xs flex items-center gap-1.5 shadow-2xs"
              >
                <span>{item.icon}</span>
                <span>{item.word}</span>
                <span className="text-[10px] text-emerald-700 font-bold">({item.korean})</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs font-bold text-slate-500 text-center py-2">
            No words marked as learned yet. Visit the Word Garden to collect stars!
          </p>
        )}
      </div>

      {/* Words to Practice More */}
      {needsPracticeWords.length > 0 && (
        <div className="w-full bg-amber-50/60 rounded-3xl p-4 shadow-sm border-2 border-amber-200 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h4 className="font-heading font-black text-amber-950 text-xs sm:text-sm">
                Ready to Bloom ({needsPracticeWords.length} words left)
              </h4>
            </div>
            <button
              onClick={onGoToReview}
              className="text-xs font-black text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Practice Now</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {needsPracticeWords.slice(0, 8).map((item) => (
              <span
                key={item.id}
                className="px-2.5 py-1 rounded-xl bg-white border border-amber-200 text-amber-900 font-bold text-xs shadow-2xs flex items-center gap-1"
              >
                <span>{item.icon}</span>
                <span>{item.word}</span>
              </span>
            ))}
            {needsPracticeWords.length > 8 && (
              <span className="text-xs font-bold text-amber-700 self-center">
                +{needsPracticeWords.length - 8} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Reset Progress Button */}
      <button
        onClick={() => {
          if (window.confirm('Reset your Word Garden progress?')) {
            soundEngine.playPop();
            onResetProgress();
          }
        }}
        className="text-[11px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer transition-colors"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Reset Word Garden progress</span>
      </button>
    </div>
  );
};
