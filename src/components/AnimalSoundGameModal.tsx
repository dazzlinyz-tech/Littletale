import React, { useState, useEffect } from 'react';
import { SOUND_MYSTERY_CASES } from '../data/storyData';
import { SoundMysteryCase } from '../types/story';
import { soundEngine, speakSentence } from '../utils/audio';
import { Volume2, Sparkles, CheckCircle2, RotateCcw, X, Trophy, HelpCircle, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BluebirdIcon } from './BluebirdIcon';

interface AnimalSoundGameModalProps {
  onClose: () => void;
}

export const AnimalSoundGameModal: React.FC<AnimalSoundGameModalProps> = ({ onClose }) => {
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [revealedClues, setRevealedClues] = useState<number>(1);

  const activeCase: SoundMysteryCase = SOUND_MYSTERY_CASES[currentCaseIndex];

  useEffect(() => {
    resetCase();
  }, [currentCaseIndex]);

  const resetCase = () => {
    setSelectedOptId(null);
    setIsAnswered(false);
    setRevealedClues(1);

    // Auto-play environmental ambient sound
    setTimeout(() => {
      soundEngine.playEnvironmentSound(activeCase.environmentSoundType);
    }, 400);
  };

  const handlePlayEnvironment = () => {
    soundEngine.playPop();
    soundEngine.playEnvironmentSound(activeCase.environmentSoundType);
  };

  const handlePlayAnimal = () => {
    soundEngine.playPop();
    soundEngine.playAnimalSound(activeCase.animalSoundType);
  };

  const handlePlayLayeredMystery = () => {
    soundEngine.playPop();
    // Layer 1: Ambient
    soundEngine.playEnvironmentSound(activeCase.environmentSoundType);
    // Layer 2: Animal vocalization with slight stagger
    setTimeout(() => {
      soundEngine.playAnimalSound(activeCase.animalSoundType);
    }, 450);
  };

  const handleRevealClue = () => {
    soundEngine.playPop();
    if (revealedClues < 2) {
      setRevealedClues(2);
      handlePlayAnimal();
    }
  };

  const handleSelectOption = (opt: { id: string; name: string; isCorrect: boolean }) => {
    if (isAnswered) return;
    soundEngine.playPop();
    setSelectedOptId(opt.id);
    setIsAnswered(true);

    if (opt.isCorrect) {
      soundEngine.playSuccessChime();
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
        });
      } catch (e) {}

      speakSentence(`Super detective! It is the ${opt.name}!`, {
        rate: 0.95,
        pitch: 1.2,
        onEnd: () => {
          setTimeout(() => {
            if (currentCaseIndex < SOUND_MYSTERY_CASES.length - 1) {
              setCurrentCaseIndex((idx) => idx + 1);
            } else {
              setIsGameCompleted(true);
              soundEngine.playSuccessChime();
            }
          }, 800);
        },
      });
    } else {
      soundEngine.playHintSound();
      speakSentence('Listen again to the sound clue!', {
        rate: 0.9,
        pitch: 1.1,
        onEnd: () => {
          setIsAnswered(false);
          setSelectedOptId(null);
          handlePlayLayeredMystery();
        },
      });
    }
  };

  const restartGame = () => {
    soundEngine.playPop();
    setCurrentCaseIndex(0);
    setIsGameCompleted(false);
    resetCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/55 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FFFDF8] rounded-3xl p-5 sm:p-6 shadow-2xl border-4 border-emerald-400 text-center animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={() => {
            soundEngine.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold cursor-pointer transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {!isGameCompleted ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-2xl">🎧</span>
              <h2 className="font-heading font-black text-slate-800 text-xl sm:text-2xl">
                Sound Mystery Detective
              </h2>
            </div>

            {/* Case Progress & Location */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                Case {currentCaseIndex + 1} of {SOUND_MYSTERY_CASES.length}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs">
                📍 {activeCase.stageName}
              </span>
            </div>

            {/* Mystery Question Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 mb-4 text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block mb-0.5">
                The Sound Mystery
              </span>
              <p className="text-sm sm:text-base font-extrabold text-slate-800">
                "{activeCase.mysteryQuestion}"
              </p>
            </div>

            {/* Multi-Layered Sound Mixer Controls */}
            <div className="mb-4 p-3 rounded-2xl bg-white border-2 border-slate-200 shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between text-left">
                <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  Multi-Layer Audio Clues
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  Tap to mix sounds
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handlePlayEnvironment}
                  className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 active:scale-95 border border-amber-300 text-amber-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Volume2 className="w-4 h-4 text-amber-600" />
                  <span>1. Environment 🍃</span>
                </button>

                <button
                  onClick={handlePlayAnimal}
                  className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 active:scale-95 border border-sky-300 text-sky-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Volume2 className="w-4 h-4 text-sky-600" />
                  <span>2. Hidden Voice 🐾</span>
                </button>
              </div>

              {/* Master Combined Play Button */}
              <button
                onClick={handlePlayLayeredMystery}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white font-black text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all animate-pulse"
              >
                <Sparkles className="w-4 h-4" />
                <span>Play Mystery Sound Together! 🎵</span>
              </button>
            </div>

            {/* Clues Box */}
            <div className="space-y-1.5 mb-4 text-left">
              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs font-bold text-amber-900 flex items-center justify-between">
                <span>{activeCase.clue1}</span>
                <span className="text-emerald-600 text-[11px] font-black">✓ Heard</span>
              </div>

              {revealedClues >= 2 ? (
                <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-200 text-xs font-bold text-sky-900 flex items-center justify-between animate-fadeIn">
                  <span>{activeCase.clue2}</span>
                  <span className="text-sky-600 text-[11px] font-black">✓ Clue 2</span>
                </div>
              ) : (
                <button
                  onClick={handleRevealClue}
                  className="w-full p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Need an extra clue? Tap here!</span>
                </button>
              )}
            </div>

            {/* 3 Animal Choice Cards */}
            <div className="grid grid-cols-3 gap-2.5">
              {activeCase.options.map((opt) => {
                const isSelected = selectedOptId === opt.id;
                const isCorrect = isAnswered && opt.isCorrect;
                const isWrong = isSelected && !opt.isCorrect;

                let cardClass = 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50';
                if (isCorrect) {
                  cardClass = 'bg-emerald-100 border-emerald-500 ring-4 ring-emerald-300 scale-105';
                } else if (isWrong) {
                  cardClass = 'bg-rose-50 border-rose-300 ring-2 ring-rose-200';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt)}
                    disabled={isAnswered && isCorrect}
                    className={`p-3 rounded-2xl border-2 sm:border-3 flex flex-col items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 ${cardClass}`}
                  >
                    {opt.id === 'opt-bird' || opt.name === 'Bluebird' ? (
                      <BluebirdIcon size={44} className="mb-1" />
                    ) : (
                      <span className="text-4xl mb-1 filter drop-shadow-xs">{opt.emoji}</span>
                    )}
                    <span className="text-xs font-extrabold text-slate-800">{opt.name}</span>
                    {isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          /* Game Completed Screen */
          <div className="py-6 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-lg mb-3 animate-bounce">
              <Trophy className="w-10 h-10" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-800 mb-1">
              Master Sound Detective! 🌟
            </h2>
            <p className="text-sm font-bold text-slate-600 mb-6 max-w-xs">
              You cracked all 3 multi-layered sound mysteries across the forest and cabin!
            </p>

            <div className="flex gap-3 w-full">
              <button
                onClick={restartGame}
                className="flex-1 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-white font-extrabold text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                Play Again
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
              >
                Back to Story
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
