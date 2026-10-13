/**
 * LittleTale: Where is Bunny?
 * 4-Stage Progressive Chase Adventure for 1st-2nd Grade Learners
 */

import React, { useState, useEffect, useRef } from 'react';
import { STORY_PAGES, WORDS_DICTIONARY } from './data/storyData';
import { WordDefinition, StampData } from './types/story';
import { soundEngine, speakSentence, stopSpeaking } from './utils/audio';
import { StoryIllustration } from './components/StoryIllustration';
import { PhonicsDictionaryModal } from './components/PhonicsDictionaryModal';
import { StoryQuestionModal } from './components/StoryQuestionModal';
import { SpeakingStepModal } from './components/SpeakingStepModal';
import { ResultScreen } from './components/ResultScreen';
import { CoverScreen } from './components/CoverScreen';
import { AnimalSoundGameModal } from './components/AnimalSoundGameModal';
import { Volume2, ChevronRight, ChevronLeft, Sparkles, BookOpen, CheckCircle2, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

type ScreenState = 'cover' | 'story' | 'result';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('cover');
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [isSlowMode, setIsSlowMode] = useState<boolean>(false);
  const [isReading, setIsReading] = useState<boolean>(false);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);

  // Dictionary modal state
  const [selectedWordData, setSelectedWordData] = useState<WordDefinition | null>(null);

  // Question & Speaking Step states per page
  const [questionCompletedMap, setQuestionCompletedMap] = useState<Record<number, boolean>>({});
  const [speakingCompletedMap, setSpeakingCompletedMap] = useState<Record<number, boolean>>({});
  const [bunnyHintMessage, setBunnyHintMessage] = useState<string | null>(null);

  // Mini-game modal state
  const [isSoundGameOpen, setIsSoundGameOpen] = useState<boolean>(false);
  const [quizSessionSeed] = useState<number>(() => (Math.random() < 0.5 ? 1 : 0));

  const currentPage = STORY_PAGES[currentPageIndex];
  const totalPages = STORY_PAGES.length;

  const isQuestionDone = !!questionCompletedMap[currentPageIndex];
  const isSpeakingDone = !!speakingCompletedMap[currentPageIndex];
  // Next button strictly requires BOTH sentence choice verified and speaking repetition completed!
  const isPageFullyCompleted = isQuestionDone && isSpeakingDone;

  const wordsInSentence = currentPage ? currentPage.text.split(' ') : [];
  const readTimerRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    stopSpeaking();
    clearReadTimers();
    setActiveWordIndex(null);
    setIsReading(false);
    setBunnyHintMessage(null);
  }, [currentPageIndex, currentScreen]);

  const clearReadTimers = () => {
    readTimerRef.current.forEach(clearTimeout);
    readTimerRef.current = [];
  };

  // Synchronized Read-Aloud with Word Highlighting
  const handleReadAloud = () => {
    if (!isQuestionDone) {
      soundEngine.playHintSound();
      setBunnyHintMessage('🔍 Solve the sentence quiz below first!');
      setTimeout(() => {
        setBunnyHintMessage(null);
      }, 2500);
      return;
    }

    soundEngine.playPop();
    stopSpeaking();
    clearReadTimers();
    setIsReading(true);
    setActiveWordIndex(null);

    const speechRate = isSlowMode ? 0.72 : 0.95;
    const words = wordsInSentence;
    const intervalPerWord = isSlowMode ? 650 : 450;

    words.forEach((_, idx) => {
      const timer = setTimeout(() => {
        setActiveWordIndex(idx);
      }, idx * intervalPerWord);
      readTimerRef.current.push(timer);
    });

    const finishTimer = setTimeout(() => {
      setActiveWordIndex(null);
      setIsReading(false);
    }, words.length * intervalPerWord + 300);
    readTimerRef.current.push(finishTimer);

    speakSentence(currentPage.text, {
      rate: speechRate,
      pitch: 1.15,
      onBoundary: (charIndex) => {
        let charAcc = 0;
        for (let i = 0; i < words.length; i++) {
          const wLen = words[i].length;
          if (charIndex >= charAcc && charIndex <= charAcc + wLen) {
            setActiveWordIndex(i);
            break;
          }
          charAcc += wLen + 1;
        }
      },
      onEnd: () => {
        clearReadTimers();
        setActiveWordIndex(null);
        setIsReading(false);
      },
    });
  };

  const handleWordClick = (rawWord: string) => {
    const cleanWord = rawWord.replace(/[.,?!]/g, '');
    const def = WORDS_DICTIONARY[cleanWord];
    if (def) {
      setSelectedWordData(def);
    } else {
      soundEngine.playPop();
      speakSentence(cleanWord, { rate: 0.8, pitch: 1.2 });
    }
  };

  // Tapping Bunny in illustration plays animal sound and cute peek-a-boo
  const handleBunnyTapped = () => {
    // Sound & single animation handled cleanly in StoryIllustration
  };

  // Sentence Selection Question Solved (Only way to complete Step 1)
  const handleQuestionSuccess = () => {
    setQuestionCompletedMap((prev) => ({
      ...prev,
      [currentPageIndex]: true,
    }));
    soundEngine.playStampSound();

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
      });
    } catch (e) {}
  };

  const handleSpeakingCompleted = () => {
    setSpeakingCompletedMap((prev) => ({
      ...prev,
      [currentPageIndex]: true,
    }));
  };

  const handleNextPage = () => {
    soundEngine.playPop();
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex((prev) => prev + 1);
    } else {
      setCurrentScreen('result');
    }
  };

  const handlePrevPage = () => {
    soundEngine.playPop();
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    } else {
      setCurrentScreen('cover');
    }
  };

  const collectedStamps: StampData[] = STORY_PAGES.map((p) => p.stamp);

  return (
    <div className="min-h-screen bg-[#FEF9EF] flex flex-col justify-between font-['Nunito',sans-serif] select-none">
      {/* ============================================================== */}
      {/* 1. COVER SCREEN */}
      {/* ============================================================== */}
      {currentScreen === 'cover' && (
        <CoverScreen
          onStartStory={() => {
            setCurrentPageIndex(0);
            setCurrentScreen('story');
          }}
          onOpenSoundGame={() => setIsSoundGameOpen(true)}
        />
      )}

      {/* ============================================================== */}
      {/* 2. STORY PAGE SCREEN (8 Pages across 4 Stages) */}
      {/* ============================================================== */}
      {currentScreen === 'story' && currentPage && (
        <div className="w-full max-w-lg mx-auto flex flex-col min-h-screen px-3 sm:px-4 py-2 justify-between">
          {/* Top Header: 4-Stage Tracker Badge & Footprint Counter */}
          <div className="flex items-center justify-between gap-2 mb-2">
            {/* 4-Stage Tracker Pill */}
            <div className="flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-full border-2 border-amber-300 shadow-xs">
              <span className="text-base">{currentPage.stage.icon}</span>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black uppercase text-amber-600 leading-tight">
                  Stage {currentPage.stage.id}/4
                </span>
                <span className="font-heading font-black text-amber-950 text-xs sm:text-sm leading-none">
                  {currentPage.stage.name}
                </span>
              </div>
            </div>

            {/* Footprint Page Counter & Actions */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 bg-white/90 px-2.5 py-1.5 rounded-full border border-amber-200 text-xs font-black text-slate-700 shadow-xs">
                <span>🐾</span>
                <span>{currentPage.pageNumber}/{totalPages}</span>
              </div>

              <button
                onClick={() => {
                  soundEngine.playPop();
                  setIsSoundGameOpen(true);
                }}
                className="w-9 h-9 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-sm cursor-pointer shadow-xs border border-emerald-300 active:scale-95 transition-all"
                title="Sound Mystery Game"
              >
                🎧
              </button>

              <button
                onClick={() => {
                  soundEngine.playPop();
                  stopSpeaking();
                  setCurrentScreen('cover');
                }}
                className="px-2.5 py-1.5 rounded-full bg-white text-slate-700 hover:bg-slate-100 font-extrabold text-xs border border-slate-300 cursor-pointer shadow-xs active:scale-95 transition-all flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Cover</span>
              </button>
            </div>
          </div>

          {/* Interactive Story Scene Illustration (Positioned FIRST on top) */}
          <div className="w-full flex-none h-[280px] sm:h-[310px] mb-2.5 relative">
            <StoryIllustration
              pageNumber={currentPage.pageNumber}
              onBunnyTapped={handleBunnyTapped}
              isQuestionMode={!isQuestionDone}
              highlightBunny={false}
            />

            {/* Bunny Tap Notification (Shows instruction to pick sentence) */}
            {bunnyHintMessage && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 max-w-[90%] px-3.5 py-1 rounded-full bg-amber-400 text-amber-950 font-black text-xs shadow-lg animate-bounce text-center">
                {bunnyHintMessage}
              </div>
            )}
          </div>

          {/* Story Text Card: Mystery placeholder before answering, revealed only AFTER quiz is correct! */}
          {!isQuestionDone ? (
            <div className="w-full bg-gradient-to-r from-amber-50 to-orange-50/80 rounded-3xl p-3.5 sm:p-4 shadow-xs border-2 border-dashed border-amber-300 mb-2.5 text-center select-none transition-all">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-xl">🔍</span>
                <span className="text-2xl sm:text-3xl font-heading font-black text-amber-900 tracking-widest drop-shadow-xs">
                  ? ? ? ? ?
                </span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-amber-800 flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <span>Look at the picture and choose the matching sentence below! ✨</span>
              </p>
            </div>
          ) : (
            <div className="w-full bg-white rounded-3xl p-3.5 sm:p-4 shadow-sm border-3 border-emerald-300 mb-2.5 text-center animate-fadeIn select-none">
              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-black text-emerald-700 tracking-wide uppercase">
                  Correct! Story sentence revealed ✨
                </span>
              </div>
              <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 mb-1">
                {wordsInSentence.map((word, idx) => {
                  const cleanWord = word.replace(/[.,?!]/g, '');
                  const isKeyWord = currentPage.keyWords.includes(cleanWord);
                  const isCurrentReadingWord = activeWordIndex === idx;

                  return (
                    <span
                      key={idx}
                      onClick={() => handleWordClick(word)}
                      className={`text-2xl sm:text-3xl font-extrabold tracking-wide font-heading transition-all inline-block rounded-xl px-1.5 py-0.5 select-none ${
                        isCurrentReadingWord
                          ? 'bg-amber-300 text-amber-950 scale-110 shadow-md ring-2 ring-amber-400'
                          : isKeyWord
                          ? 'text-amber-900 underline decoration-amber-400 decoration-3 underline-offset-4 cursor-pointer hover:bg-amber-100/70 hover:scale-105 active:scale-95'
                          : 'text-slate-800'
                      }`}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>

              <p className="text-[11px] font-bold text-amber-700/80 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Tap any word to listen and see the picture dictionary!</span>
              </p>
            </div>
          )}

          {/* Step 1: Sentence Selection Quiz OR Step 2: Manual Speaking Checkpoint */}
          {!isQuestionDone ? (
            <div className="w-full mb-2.5">
              <StoryQuestionModal
                question={currentPage.question}
                pageNumber={currentPage.pageNumber}
                sessionSeed={quizSessionSeed}
                onCorrect={handleQuestionSuccess}
                onRequestHint={() => {}}
                isCompleted={isQuestionDone}
              />
            </div>
          ) : (
            <div className="w-full mb-2.5">
              <SpeakingStepModal
                targetSentence={currentPage.speakingPrompt.targetSentence}
                modelAudioPrompt={currentPage.speakingPrompt.modelAudioPrompt}
                instruction={currentPage.speakingPrompt.instruction}
                onComplete={handleSpeakingCompleted}
                isCompleted={isSpeakingDone}
              />
            </div>
          )}

          {/* Bottom Bar: Audio Controls & Next Page Navigation */}
          <div className="w-full flex items-center justify-between gap-2 pt-1 pb-2">
            {/* Left: Read & Speed Toggle */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={handleReadAloud}
                className={`px-3.5 sm:px-4 py-2.5 rounded-2xl font-extrabold text-sm sm:text-base flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95 transition-all ${
                  !isQuestionDone
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-500 border border-slate-300 shadow-none'
                    : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white shadow-amber-400/30'
                }`}
                title={!isQuestionDone ? 'Solve the sentence quiz first to unlock Read' : 'Read Full Sentence'}
              >
                {!isQuestionDone ? (
                  <Lock className="w-4 h-4 text-slate-400" />
                ) : (
                  <Volume2 className={`w-5 h-5 ${isReading ? 'animate-bounce' : ''}`} />
                )}
                <span>{!isQuestionDone ? 'Read (Locked)' : isReading ? 'Reading...' : 'Read'}</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playPop();
                  setIsSlowMode(!isSlowMode);
                }}
                className={`px-3 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm border-2 flex items-center gap-1 cursor-pointer active:scale-95 transition-all ${
                  isSlowMode
                    ? 'bg-amber-200 border-amber-400 text-amber-950 shadow-xs'
                    : 'bg-white border-amber-200 text-amber-900 hover:bg-amber-50'
                }`}
                title="Toggle Reading Speed"
              >
                <span>{isSlowMode ? '🐢 Slow' : '🐰 Normal'}</span>
              </button>
            </div>

            {/* Right: Next Page Button (Strictly unlocked only after sentence selection & manual speaking validation) */}
            <div className="flex items-center gap-1.5">
              {currentPageIndex > 0 && (
                <button
                  onClick={handlePrevPage}
                  className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold border-2 border-slate-200 flex items-center justify-center cursor-pointer active:scale-95 shadow-xs transition-all"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={handleNextPage}
                disabled={!isPageFullyCompleted}
                className={`px-4 sm:px-5 py-2.5 rounded-2xl font-black text-sm sm:text-base flex items-center gap-1.5 cursor-pointer transition-all ${
                  isPageFullyCompleted
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white shadow-lg shadow-emerald-500/30 ring-3 ring-emerald-300 animate-pulse'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                }`}
              >
                <span>{currentPageIndex === totalPages - 1 ? 'Caught Bunny! 🏆' : 'Next'}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. RESULT SCREEN */}
      {/* ============================================================== */}
      {currentScreen === 'result' && (
        <ResultScreen
          stamps={collectedStamps}
          onReadAgain={() => {
            setCurrentPageIndex(0);
            setCurrentScreen('story');
          }}
          onOpenMiniGame={() => setIsSoundGameOpen(true)}
        />
      )}

      {/* ============================================================== */}
      {/* MODALS: Visual & Phonics Dictionary & Sound Mystery Detective */}
      {/* ============================================================== */}
      <PhonicsDictionaryModal
        wordData={selectedWordData}
        onClose={() => setSelectedWordData(null)}
      />

      {isSoundGameOpen && (
        <AnimalSoundGameModal onClose={() => setIsSoundGameOpen(false)} />
      )}
    </div>
  );
}
