import React, { useState, useEffect } from 'react';
import { StampData } from '../types/story';
import { soundEngine, speakSentence } from '../utils/audio';
import { Volume2, Award, RotateCcw, Sparkles, Star, Heart, Compass, BookOpen, Gamepad2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BluebirdIcon } from './BluebirdIcon';
import { FrogIcon } from './FrogIcon';
import { BasketIcon } from './BasketIcon';
import { STORY_PAGES } from '../data/storyData';

interface ResultScreenProps {
  stamps: StampData[];
  onReadAgain: () => void;
  onOpenWordAdventure: (tab?: 'garden' | 'games') => void;
}

const STICKER_ANIMALS = [
  { id: 'bunny', name: 'Bunny', icon: '🐰', sound: 'bunny', color: '#EC4899', quote: 'Hop hop hop!' },
  { id: 'bear', name: 'Bear', icon: '🐻', sound: 'bear', color: '#B45309', quote: 'Big warm hugs!' },
  { id: 'bird', name: 'Bluebird', icon: '🐦', sound: 'bird', color: '#0284C7', quote: 'Sweet songs!' },
  { id: 'squirrel', name: 'Squirrel', icon: '🐿️', sound: 'squirrel', color: '#D97706', quote: 'Nutty friend!' },
  { id: 'frog', name: 'Frog', icon: '🐸', sound: 'frog', color: '#16A34A', quote: 'Ribbit splash!' },
  { id: 'cat', name: 'Cat', icon: '🐱', sound: 'cat', color: '#EA580C', quote: 'Purr purr!' },
];

export const ResultScreen: React.FC<ResultScreenProps> = ({
  stamps,
  onReadAgain,
  onOpenWordAdventure,
}) => {
  const [selectedAnimal, setSelectedAnimal] = useState(STICKER_ANIMALS[0]);
  const [isSpeakingSentence, setIsSpeakingSentence] = useState(false);
  const [sentenceSpokenCount, setSentenceSpokenCount] = useState(0);

  useEffect(() => {
    soundEngine.playSuccessChime();
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6', '#F43F5E'],
      });
    } catch (err) {}

    setTimeout(() => {
      speakSentence('You caught Bunny! You completed all 4 stages and collected 8 stamps! Pick your favorite friend!', {
        rate: 0.95,
        pitch: 1.15,
      });
    }, 500);
  }, []);

  const handleSelectAnimal = (animal: typeof STICKER_ANIMALS[0]) => {
    soundEngine.playPop();
    soundEngine.playAnimalSound(animal.sound);
    setSelectedAnimal(animal);

    const sentence = `I like ${animal.name}!`;
    setIsSpeakingSentence(true);
    speakSentence(sentence, {
      rate: 0.9,
      pitch: 1.2,
      onEnd: () => {
        setIsSpeakingSentence(false);
        setSentenceSpokenCount((c) => c + 1);
      },
    });
  };

  const handleSpeakSentence = () => {
    soundEngine.playPop();
    soundEngine.playAnimalSound(selectedAnimal.sound);
    setIsSpeakingSentence(true);
    const sentence = `I like ${selectedAnimal.name}!`;
    speakSentence(sentence, {
      rate: 0.85,
      pitch: 1.2,
      onEnd: () => {
        setIsSpeakingSentence(false);
        setSentenceSpokenCount((c) => c + 1);
        try {
          confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
        } catch (e) {}
      },
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto px-3 sm:px-4 py-5 flex flex-col items-center select-none">
      {/* Trophy & Happy Bunny Celebration Badges */}
      <div className="relative mb-2 flex items-center justify-center gap-3">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-pink-300 via-rose-200 to-amber-200 flex items-center justify-center shadow-lg border-4 border-white text-3xl sm:text-4xl animate-bounce">
          🐰
        </div>
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-lg border-4 border-white">
          <Award className="w-9 h-9 sm:w-10 sm:h-10 text-amber-900" />
        </div>
        <div className="absolute -top-1 -right-2 text-2xl animate-spin">✨</div>
      </div>

      <h1 className="text-3xl sm:text-4xl font-black text-amber-950 font-heading text-center mb-1">
        You Caught Bunny!
      </h1>

      {/* 4 Stages Completed Badge */}
      <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-xs mb-2 border border-emerald-300">
        <Compass className="w-3.5 h-3.5 text-emerald-600" />
        <span>Completed All 4 Stages! 🌲 Entrance ➔ 🌳 Deep Forest ➔ 🏡 Cabin ➔ 🛏️ Room</span>
      </div>

      <p className="text-sm sm:text-base font-black text-amber-800 bg-amber-100/90 px-4 py-1.5 rounded-full border border-amber-300 mb-4 shadow-xs flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-500" />
        You collected {stamps.length} / 8 Chase Stamps!
        <Sparkles className="w-4 h-4 text-amber-500" />
      </p>

      {/* Bunny's Friendly Completion Invitation Card */}
      <div className="w-full bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 rounded-3xl p-4 sm:p-5 shadow-xl border-4 border-amber-300 mb-5 text-center flex flex-col items-center">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-3xl animate-bounce">🐰</span>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-amber-950">
            Hooray! You finished the story!
          </h2>
        </div>
        <p className="text-sm font-extrabold text-amber-900 mb-4 max-w-md">
          "Now let's play with the words you discovered!"
        </p>

        {/* Two Primary Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
          <button
            onClick={() => {
              soundEngine.playPop();
              onOpenWordAdventure('garden');
            }}
            className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white font-black text-base shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all border-2 border-white"
          >
            <BookOpen className="w-5 h-5" />
            <span>Review Words 🌸</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playPop();
              onOpenWordAdventure('games');
            }}
            className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 hover:from-amber-500 hover:to-orange-500 active:scale-95 text-white font-black text-base shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all border-2 border-white animate-pulse"
          >
            <Gamepad2 className="w-5 h-5" />
            <span>Play Word Games 🎮</span>
          </button>
        </div>
      </div>

      {/* 8-Stamp Collector Reward Passport Card */}
      <div className="w-full bg-white rounded-3xl p-4 sm:p-5 shadow-xl border-4 border-amber-200 mb-5">
        <div className="flex items-center justify-between border-b border-amber-100 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <h2 className="font-heading font-black text-slate-800 text-base sm:text-lg">
              Bunny's 4-Stage Chase Passport
            </h2>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            All 8 Earned! 🏆
          </span>
        </div>

        {/* 8 Stamp Badges Grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
          {stamps.map((stamp, idx) => (
            <div
              key={stamp.id}
              className="flex flex-col items-center p-2 rounded-2xl bg-amber-50/70 border-2 border-dashed border-amber-300/80 hover:bg-amber-100/60 transition-all hover:scale-105"
            >
              <div
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-xl sm:text-2xl shadow-xs mb-1 border-2 border-white"
                style={{ backgroundColor: `${stamp.color}25` }}
              >
                {stamp.animal === 'Bluebird' || stamp.icon === '🐦' || stamp.icon === 'bluebird' ? (
                  <BluebirdIcon size={26} />
                ) : stamp.animal === 'Frog' || stamp.icon === '🐸' || stamp.icon === '🪜' || stamp.id === 'stamp-6' ? (
                  <FrogIcon size={26} />
                ) : stamp.icon === '🧺' || stamp.animal === 'Calico Cat' ? (
                  <BasketIcon size={26} />
                ) : (
                  <span className="select-none leading-none filter drop-shadow-xs">{stamp.icon}</span>
                )}
              </div>
              <span className="text-[10px] font-black text-slate-800 text-center leading-tight truncate w-full">
                {stamp.title}
              </span>
              <span className="text-[8px] text-amber-700 font-bold truncate max-w-full">
                Stage {stamp.stageNumber || Math.ceil((idx + 1) / 2)} • {stamp.locationName}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bunny's 8 Adventure Scene Memories (Guarantees all 8 scene images, including the 6th under the porch, display flawlessly) */}
      <div className="w-full bg-white rounded-3xl p-4 sm:p-5 shadow-xl border-4 border-amber-200 mb-5">
        <div className="flex items-center justify-between border-b border-amber-100 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📸</span>
            <h2 className="font-heading font-black text-slate-800 text-base sm:text-lg">
              Bunny's 8 Adventure Scene Memories
            </h2>
          </div>
          <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
            8 Story Scenes 🌸
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {STORY_PAGES.map((page) => (
            <div
              key={page.pageNumber}
              className="group relative rounded-2xl overflow-hidden border-2 border-amber-200 shadow-xs bg-amber-50/50 flex flex-col hover:shadow-md transition-all"
            >
              <div className="relative w-full h-24 sm:h-28 overflow-hidden bg-amber-100">
                <img
                  src={page.imageUrl}
                  alt={page.text}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/60 text-white font-black text-[10px] backdrop-blur-xs">
                  #{page.pageNumber}
                </span>
                <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-full bg-white/95 text-amber-950 font-black text-[9px] border border-amber-300 shadow-xs">
                  {page.stage.icon} {page.stage.name}
                </span>
              </div>
              <div className="p-2 flex flex-col justify-between flex-1 text-left bg-white">
                <p className="text-[11px] font-black text-slate-800 leading-tight line-clamp-1 mb-0.5">
                  {page.text}
                </p>
                <span className="text-[9px] font-bold text-amber-700 truncate">
                  {page.stamp.locationName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reaction Area: Favorite Animal Sticker Row + "I like _____!" */}
      <div className="w-full bg-gradient-to-b from-rose-50 to-amber-50 rounded-3xl p-4 sm:p-5 shadow-xl border-4 border-rose-200/80 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <h2 className="font-heading font-black text-slate-800 text-base sm:text-lg">
            Create Your Sentence Card
          </h2>
        </div>

        <p className="text-xs font-bold text-slate-600 mb-3">
          Pick your favorite character sticker to say your sentence!
        </p>

        {/* Sticker Carousel Row */}
        <div className="flex gap-2 overflow-x-auto pb-3 pt-1 scrollbar-thin">
          {STICKER_ANIMALS.map((animal) => {
            const isSelected = selectedAnimal.id === animal.id;
            return (
              <button
                key={animal.id}
                onClick={() => handleSelectAnimal(animal)}
                className={`flex-shrink-0 flex flex-col items-center p-2.5 rounded-2xl border-2 sm:border-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-rose-400 scale-105 shadow-md ring-2 ring-rose-200'
                    : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                {animal.id === 'bird' ? (
                  <BluebirdIcon size={34} className="mb-1" />
                ) : animal.id === 'frog' ? (
                  <FrogIcon size={34} className="mb-1" />
                ) : (
                  <span className="text-3xl mb-1 filter drop-shadow-xs">{animal.icon}</span>
                )}
                <span className="text-xs font-extrabold text-slate-800">{animal.name}</span>
              </button>
            );
          })}
        </div>

        {/* Sentence Card */}
        <div className="mt-2 p-4 rounded-2xl bg-white border-3 border-rose-300 shadow-sm text-center flex flex-col items-center">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-500 mb-1">
            My English Sentence
          </span>

          <div className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-800 flex items-center justify-center gap-2 flex-wrap mb-3">
            <span>I like</span>
            <span className="px-3 py-1 rounded-xl bg-rose-100 text-rose-700 border-2 border-rose-300 inline-flex items-center gap-1.5 shadow-xs animate-pulse">
              {selectedAnimal.id === 'bird' ? (
                <BluebirdIcon size={26} />
              ) : selectedAnimal.id === 'frog' ? (
                <FrogIcon size={26} />
              ) : (
                <span>{selectedAnimal.icon}</span>
              )}
              <span>{selectedAnimal.name}</span>
            </span>
            <span>!</span>
          </div>

          {/* Voice Output Button */}
          <button
            onClick={handleSpeakSentence}
            disabled={isSpeakingSentence}
            className="w-full max-w-xs py-3 px-5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 active:scale-95 text-white font-black text-base shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Volume2 className={`w-5 h-5 ${isSpeakingSentence ? 'animate-bounce' : ''}`} />
            <span>{isSpeakingSentence ? 'Speaking...' : 'Say My Sentence! 🔊'}</span>
          </button>

          {sentenceSpokenCount > 0 && (
            <p className="mt-2 text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
              Awesome speaking practice!
            </p>
          )}
        </div>
      </div>

      {/* Navigation Buttons: Side by Side */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => {
            soundEngine.playPop();
            onReadAgain();
          }}
          className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-white font-extrabold text-base shadow-md shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Read Again 🔄</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playPop();
            onOpenWordAdventure('garden');
          }}
          className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white font-extrabold text-base shadow-md shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
          <span>Word Adventure 🌸</span>
        </button>
      </div>
    </div>
  );
};
