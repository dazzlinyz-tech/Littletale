import React, { useState } from 'react';
import { WordAdventureItem, WordCategory } from '../../types/wordAdventure';
import { soundEngine, speakSentence } from '../../utils/audio';
import { Volume2, ChevronLeft, ChevronRight, CheckCircle2, RotateCcw, Sparkles, BookOpen, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WordGardenReviewProps {
  vocabularyList: WordAdventureItem[];
  learnedWordIds: string[];
  onToggleLearned: (wordId: string) => void;
  onAwardStar: () => void;
}

export const WordGardenReview: React.FC<WordGardenReviewProps> = ({
  vocabularyList,
  learnedWordIds,
  onToggleLearned,
  onAwardStar,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<WordCategory | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const filteredWords = selectedCategory === 'all'
    ? vocabularyList
    : vocabularyList.filter((item) => item.category === selectedCategory);

  const safeIndex = Math.min(currentIndex, Math.max(0, filteredWords.length - 1));
  const currentWord: WordAdventureItem | undefined = filteredWords[safeIndex];

  const isLearned = currentWord ? learnedWordIds.includes(currentWord.id) : false;

  const handleSpeakWord = () => {
    if (!currentWord) return;
    soundEngine.playPop();
    setIsSpeaking(true);
    speakSentence(currentWord.word, {
      rate: 0.85,
      pitch: 1.1,
      onEnd: () => setIsSpeaking(false),
    });
  };

  const handleSpeakSentence = () => {
    if (!currentWord) return;
    soundEngine.playPop();
    speakSentence(currentWord.exampleEn, { rate: 0.85, pitch: 1.1 });
  };

  const handlePrev = () => {
    soundEngine.playPop();
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
    } else {
      setCurrentIndex(filteredWords.length - 1);
    }
  };

  const handleNext = () => {
    soundEngine.playPop();
    if (safeIndex < filteredWords.length - 1) {
      setCurrentIndex(safeIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleToggleLearnedClick = () => {
    if (!currentWord) return;
    soundEngine.playPop();
    const willBeLearned = !isLearned;
    onToggleLearned(currentWord.id);
    if (willBeLearned) {
      soundEngine.playSuccessChime();
      onAwardStar();
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#F59E0B', '#10B981', '#EC4899', '#8B5CF6'],
        });
      } catch (e) {}
    }
  };

  const categories: { id: WordCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All Words', icon: '🌸' },
    { id: 'animals', label: 'Animals', icon: '🐰' },
    { id: 'nature', label: 'Nature', icon: '🌲' },
    { id: 'places_objects', label: 'Objects', icon: '🧺' },
    { id: 'feelings_actions', label: 'Feelings & Actions', icon: '💖' },
  ];

  if (!currentWord) {
    return (
      <div className="p-8 text-center text-amber-900">
        <p className="font-bold">No words found in this category.</p>
        <button
          onClick={() => setSelectedCategory('all')}
          className="mt-3 px-4 py-2 bg-amber-400 rounded-xl font-black text-white"
        >
          View All Words
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Category Filter Pills */}
      <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-3 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                soundEngine.playPop();
                setSelectedCategory(cat.id);
                setCurrentIndex(0);
              }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 border-2 ${
                isActive
                  ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-sm scale-105'
                  : 'bg-white border-amber-200 text-amber-900 hover:bg-amber-50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Vocabulary Card */}
      <div className="w-full max-w-md bg-gradient-to-b from-[#FFFDF8] via-white to-[#FFFBEF] rounded-3xl p-4 sm:p-5 shadow-xl border-4 border-amber-300 relative flex flex-col items-center">
        {/* Top Header inside Card: Category & Story Page indicator */}
        <div className="w-full flex items-center justify-between border-b border-amber-100 pb-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-black border border-amber-200">
            <span>{currentWord.categoryIcon}</span>
            <span>{currentWord.categoryLabel}</span>
          </span>

          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            📖 Page {currentWord.storyPageNumber} Scene
          </span>
        </div>

        {/* Story Scene Illustration Thumbnail */}
        <div className="relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden border-2 border-amber-200 shadow-sm mb-3.5 bg-amber-100">
          <img
            src={currentWord.sceneImage}
            alt={currentWord.word}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-xs font-black text-amber-950 border border-amber-300 shadow-xs flex items-center gap-1">
            <span>{currentWord.icon}</span>
            <span>{currentWord.word}</span>
          </div>
        </div>

        {/* English Word & Korean Meaning */}
        <div className="flex flex-col items-center text-center mb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-amber-950 tracking-wide">
              {currentWord.word}
            </h2>

            {/* Pronunciation Voice Button */}
            <button
              onClick={handleSpeakWord}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-amber-400 hover:bg-amber-500 active:scale-90 text-amber-950 flex items-center justify-center font-bold shadow-md cursor-pointer transition-all border-2 border-white ring-2 ring-amber-300 ${
                isSpeaking ? 'animate-bounce' : ''
              }`}
              title={`Listen to "${currentWord.word}"`}
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <p className="text-lg sm:text-xl font-black text-rose-600 mt-1">
            {currentWord.korean}
          </p>
        </div>

        {/* Child-Friendly Storybook Example Sentence Card */}
        <div
          onClick={handleSpeakSentence}
          className="w-full p-3 sm:p-3.5 rounded-2xl bg-amber-50/80 hover:bg-amber-100/70 border-2 border-amber-200/90 shadow-xs cursor-pointer transition-all mb-3 text-center group"
          title="Tap to hear example sentence"
        >
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase text-amber-700 tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>Storybook Example Sentence</span>
            <Volume2 className="w-3.5 h-3.5 text-amber-600 group-hover:scale-125 transition-transform" />
          </div>

          <p className="text-sm sm:text-base font-extrabold text-amber-950 font-heading">
            "{currentWord.exampleEn}"
          </p>
          <p className="text-xs font-bold text-amber-800/80 mt-0.5">
            "{currentWord.exampleKo}"
          </p>
        </div>

        {/* "Learned ⭐" / "Review 🔄" Toggle Button */}
        <button
          onClick={handleToggleLearnedClick}
          className={`w-full py-2.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs border-2 ${
            isLearned
              ? 'bg-emerald-100 border-emerald-400 text-emerald-900 hover:bg-emerald-200'
              : 'bg-white border-amber-300 text-amber-900 hover:bg-amber-50'
          }`}
        >
          {isLearned ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
              <span>Learned! Added to My Garden ⭐</span>
            </>
          ) : (
            <>
              <Star className="w-4 h-4 text-amber-500" />
              <span>Mark as Learned (+1 Star)</span>
            </>
          )}
        </button>
      </div>

      {/* Navigation Controls: Large Prev & Next Buttons + Progress */}
      <div className="w-full max-w-md flex items-center justify-between mt-3 px-2">
        <button
          onClick={handlePrev}
          className="px-4 py-2.5 rounded-2xl bg-white hover:bg-amber-100 active:scale-95 text-amber-950 font-black text-sm border-2 border-amber-300 shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="text-xs font-black text-amber-900">
            Word {safeIndex + 1} of {filteredWords.length}
          </span>
          <div className="flex gap-1 mt-1">
            {filteredWords.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === safeIndex ? 'w-4 bg-amber-500' : 'w-1.5 bg-amber-200'
                }`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-white font-black text-sm shadow-md shadow-amber-400/25 flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Review All Words Again Button */}
      <button
        onClick={() => {
          soundEngine.playPop();
          setSelectedCategory('all');
          setCurrentIndex(0);
        }}
        className="mt-3 text-xs font-extrabold text-amber-800 hover:text-amber-950 underline decoration-amber-300 flex items-center gap-1 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Review all words from the beginning</span>
      </button>
    </div>
  );
};
