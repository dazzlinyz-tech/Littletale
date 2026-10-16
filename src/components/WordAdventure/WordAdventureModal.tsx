import React, { useState, useEffect } from 'react';
import { WordGardenProgress } from '../../types/wordAdventure';
import {
  STORY_VOCABULARY_LIST,
  PICTURE_MATCH_QUESTIONS,
  WORD_MATCH_PAIRS,
  BUNNY_QUIZ_QUESTIONS,
} from '../../data/wordAdventureData';
import { WordGardenReview } from './WordGardenReview';
import { PictureMatchGame } from './PictureMatchGame';
import { WordMatchGame } from './WordMatchGame';
import { BunnyQuizGame } from './BunnyQuizGame';
import { MyWordGardenProgress } from './MyWordGardenProgress';
import { soundEngine } from '../../utils/audio';
import { X, Sparkles, BookOpen, Star, Gamepad2, Award, ArrowLeft } from 'lucide-react';

interface WordAdventureModalProps {
  onClose: () => void;
  initialTab?: 'garden' | 'games' | 'progress';
  onNavigateToStory?: () => void;
}

const STORAGE_KEY = 'where_is_bunny_word_garden_progress_v1';

export const WordAdventureModal: React.FC<WordAdventureModalProps> = ({
  onClose,
  initialTab = 'garden',
  onNavigateToStory,
}) => {
  const [activeTab, setActiveTab] = useState<'garden' | 'games' | 'progress'>(initialTab);
  const [activeGame, setActiveGame] = useState<'menu' | 'picture' | 'match' | 'quiz'>('menu');

  // Load progress from localStorage
  const [progress, setProgress] = useState<WordGardenProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return {
      stars: 5,
      flowers: 3,
      learnedWordIds: ['bunny', 'forest'],
      reviewWordIds: [],
      gamesCompleted: 1,
    };
  });

  // Save progress whenever it updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {}
  }, [progress]);

  const handleToggleLearned = (wordId: string) => {
    setProgress((prev) => {
      const isAlreadyLearned = prev.learnedWordIds.includes(wordId);
      const newLearned = isAlreadyLearned
        ? prev.learnedWordIds.filter((id) => id !== wordId)
        : [...prev.learnedWordIds, wordId];

      return {
        ...prev,
        learnedWordIds: newLearned,
      };
    });
  };

  const handleAwardStar = (count = 1) => {
    setProgress((prev) => ({
      ...prev,
      stars: prev.stars + count,
      flowers: prev.flowers + Math.floor(count / 2) + 1,
    }));
  };

  const handleGameComplete = (starsEarned: number) => {
    setProgress((prev) => ({
      ...prev,
      stars: prev.stars + starsEarned,
      flowers: prev.flowers + 1,
      gamesCompleted: prev.gamesCompleted + 1,
    }));
  };

  const handleResetProgress = () => {
    const fresh: WordGardenProgress = {
      stars: 0,
      flowers: 0,
      learnedWordIds: [],
      reviewWordIds: [],
      gamesCompleted: 0,
    };
    setProgress(fresh);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  const handleClose = () => {
    soundEngine.playPop();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/55 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#FFFDF7] rounded-3xl p-4 sm:p-6 shadow-2xl border-4 border-amber-300 text-center animate-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto flex flex-col items-center">
        {/* Top Floating Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-950 flex items-center justify-center font-bold cursor-pointer transition-all border border-amber-300 shadow-xs active:scale-90 z-20"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. SECTION TITLE & BUNNY AVATAR HEADER */}
        <div className="w-full flex flex-col items-center mb-3 pt-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-200/90 border-2 border-amber-400 flex items-center justify-center text-2xl shadow-xs animate-bounce">
              🐰
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-700">
                Interactive English Reader
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-amber-950 leading-tight">
                Bunny's Word Adventure
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm font-bold text-amber-800">
            "Let&apos;s learn and play with the words from our story!"
          </p>

          {/* Stars & Flowers Counter Pill */}
          <div className="mt-2 inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-amber-100/90 border-2 border-amber-300 text-xs font-black text-amber-950 shadow-xs">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>{progress.stars} Stars</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span>🌸</span>
              <span>{progress.learnedWordIds.length} Words in Bloom</span>
            </span>
          </div>
        </div>

        {/* 2. TOP NAVIGATION TABS */}
        <div className="w-full grid grid-cols-3 gap-1.5 sm:gap-2 mb-4 max-w-md">
          <button
            onClick={() => {
              soundEngine.playPop();
              setActiveTab('garden');
              setActiveGame('menu');
            }}
            className={`py-2 px-2 sm:px-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer border-2 ${
              activeTab === 'garden'
                ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-sm'
                : 'bg-white border-amber-200 text-amber-900 hover:bg-amber-50'
            }`}
          >
            <span>🌸</span>
            <span>Word Garden</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playPop();
              setActiveTab('games');
              setActiveGame('menu');
            }}
            className={`py-2 px-2 sm:px-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer border-2 ${
              activeTab === 'games'
                ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-sm'
                : 'bg-white border-amber-200 text-amber-900 hover:bg-amber-50'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Word Games</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playPop();
              setActiveTab('progress');
              setActiveGame('menu');
            }}
            className={`py-2 px-2 sm:px-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer border-2 ${
              activeTab === 'progress'
                ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-sm'
                : 'bg-white border-amber-200 text-amber-900 hover:bg-amber-50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>My Garden</span>
          </button>
        </div>

        {/* 3. CONTENT AREAS */}

        {/* TAB 1: WORD GARDEN VOCABULARY REVIEW */}
        {activeTab === 'garden' && (
          <WordGardenReview
            vocabularyList={STORY_VOCABULARY_LIST}
            learnedWordIds={progress.learnedWordIds}
            onToggleLearned={handleToggleLearned}
            onAwardStar={() => handleAwardStar(1)}
          />
        )}

        {/* TAB 2: WORD GAMES */}
        {activeTab === 'games' && (
          <div className="w-full flex flex-col items-center">
            {activeGame === 'menu' && (
              <div className="w-full max-w-md flex flex-col gap-3">
                <div className="text-center mb-1">
                  <h3 className="text-xl font-black font-heading text-amber-950">
                    Pick a Fun Word Game!
                  </h3>
                  <p className="text-xs font-bold text-slate-600">
                    Practice the words from "Where is Bunny?" and earn stars!
                  </p>
                </div>

                {/* Game A: Picture Match */}
                <div
                  onClick={() => {
                    soundEngine.playPop();
                    setActiveGame('picture');
                  }}
                  className="p-4 rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-3 border-emerald-300 shadow-sm hover:shadow-md cursor-pointer transition-all flex items-center gap-3.5 text-left active:scale-98 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white border-2 border-emerald-300 flex items-center justify-center text-3xl shadow-xs group-hover:scale-110 transition-transform">
                    🖼️
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mb-1">
                      Game A • Picture Match
                    </span>
                    <h4 className="font-heading font-black text-base text-slate-800 leading-tight">
                      Find the Picture!
                    </h4>
                    <p className="text-xs font-bold text-slate-600 mt-0.5">
                      Hear the word and pick the matching story illustration!
                    </p>
                  </div>
                </div>

                {/* Game B: Word Match */}
                <div
                  onClick={() => {
                    soundEngine.playPop();
                    setActiveGame('match');
                  }}
                  className="p-4 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border-3 border-amber-300 shadow-sm hover:shadow-md cursor-pointer transition-all flex items-center gap-3.5 text-left active:scale-98 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white border-2 border-amber-300 flex items-center justify-center text-3xl shadow-xs group-hover:scale-110 transition-transform">
                    🧩
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full inline-block mb-1">
                      Game B • Word Match
                    </span>
                    <h4 className="font-heading font-black text-base text-slate-800 leading-tight">
                      Card Matching Pair
                    </h4>
                    <p className="text-xs font-bold text-slate-600 mt-0.5">
                      Connect English words to their Korean story meanings!
                    </p>
                  </div>
                </div>

                {/* Game C: Bunny Quiz */}
                <div
                  onClick={() => {
                    soundEngine.playPop();
                    setActiveGame('quiz');
                  }}
                  className="p-4 rounded-3xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-3 border-purple-300 shadow-sm hover:shadow-md cursor-pointer transition-all flex items-center gap-3.5 text-left active:scale-98 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white border-2 border-purple-300 flex items-center justify-center text-3xl shadow-xs group-hover:scale-110 transition-transform">
                    ⭐
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full inline-block mb-1">
                      Game C • Bunny Quiz
                    </span>
                    <h4 className="font-heading font-black text-base text-slate-800 leading-tight">
                      Storybook Word Quiz
                    </h4>
                    <p className="text-xs font-bold text-slate-600 mt-0.5">
                      Multiple choice questions and sentence fill-in-the-blanks!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-game views with Back button */}
            {activeGame !== 'menu' && (
              <div className="w-full flex flex-col items-center">
                <button
                  onClick={() => {
                    soundEngine.playPop();
                    setActiveGame('menu');
                  }}
                  className="self-start mb-2 px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-amber-950 font-black text-xs border border-amber-300 shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Choose Another Game</span>
                </button>

                {activeGame === 'picture' && (
                  <PictureMatchGame
                    questions={PICTURE_MATCH_QUESTIONS}
                    onGameComplete={handleGameComplete}
                    onBackToMenu={() => setActiveGame('menu')}
                  />
                )}

                {activeGame === 'match' && (
                  <WordMatchGame
                    pairs={WORD_MATCH_PAIRS}
                    onGameComplete={handleGameComplete}
                    onBackToMenu={() => setActiveGame('menu')}
                  />
                )}

                {activeGame === 'quiz' && (
                  <BunnyQuizGame
                    questions={BUNNY_QUIZ_QUESTIONS}
                    onGameComplete={handleGameComplete}
                    onBackToMenu={() => setActiveGame('menu')}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MY PROGRESS */}
        {activeTab === 'progress' && (
          <MyWordGardenProgress
            progress={progress}
            vocabularyList={STORY_VOCABULARY_LIST}
            onResetProgress={handleResetProgress}
            onGoToReview={() => setActiveTab('garden')}
          />
        )}

        {/* 4. BOTTOM ACTION: RETURN TO STORYBOOK BUTTON */}
        <div className="w-full mt-4 pt-3 border-t border-amber-200/80 flex items-center justify-center">
          <button
            onClick={() => {
              soundEngine.playPop();
              if (onNavigateToStory) {
                onNavigateToStory();
              }
              onClose();
            }}
            className="px-5 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs sm:text-sm border-2 border-amber-300 shadow-xs flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-amber-800" />
            <span>Return to Storybook 📖</span>
          </button>
        </div>
      </div>
    </div>
  );
};
