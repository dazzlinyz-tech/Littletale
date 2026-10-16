import React, { useState } from 'react';
import { soundEngine } from '../utils/audio';
import { Sparkles, Play, Music, Compass } from 'lucide-react';
import { STAGES } from '../data/storyData';
import { BluebirdIcon } from './BluebirdIcon';
import { STORY_IMAGES } from '../assets/storyImages';
import { StorybookImage } from './StorybookImage';

interface CoverScreenProps {
  onStartStory: () => void;
  onOpenWordAdventure: () => void;
}

export const CoverScreen: React.FC<CoverScreenProps> = ({
  onStartStory,
  onOpenWordAdventure,
}) => {
  const [bushShaking, setBushShaking] = useState(false);
  const [bunnyPeek, setBunnyPeek] = useState(false);
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [dialogueBanner, setDialogueBanner] = useState<string | null>(null);

  const handleBushClick = () => {
    soundEngine.playRustlingLeaves();
    soundEngine.playAnimalSound('bunny');
    setBushShaking(true);
    setBunnyPeek(true);
    // Banner placed strictly ABOVE the illustration card so Bunny is 100% visible!
    setDialogueBanner('🐰 Bunny: "You found me! But watch me run! 💨"');

    setTimeout(() => setBushShaking(false), 600);
    setTimeout(() => {
      setBunnyPeek(false);
      setDialogueBanner(null);
    }, 2500);
  };

  const handleSignpostClick = () => {
    soundEngine.playCreakingDoor();
    soundEngine.playPop();
    const nextIdx = (activeStageIdx + 1) % STAGES.length;
    setActiveStageIdx(nextIdx);
    setDialogueBanner(`📍 Stage ${nextIdx + 1}: ${STAGES[nextIdx].name}`);
    setTimeout(() => setDialogueBanner(null), 2000);
  };

  const handleAnimalClick = (soundType: string, text: string) => {
    soundEngine.playAnimalSound(soundType);
    soundEngine.playPop();
    setDialogueBanner(text);
    setTimeout(() => setDialogueBanner(null), 1800);
  };

  const handleStart = () => {
    soundEngine.playPop();
    soundEngine.playAnimalSound('bunny');
    onStartStory();
  };

  const currentStage = STAGES[activeStageIdx];

  return (
    <div className="relative w-full min-h-[96vh] flex flex-col items-center justify-between p-3 sm:p-5 max-w-lg mx-auto text-center select-none">
      {/* 1. TOP HEADER ELEMENTS (Strictly ABOVE Bunny) */}
      <div className="w-full flex flex-col items-center gap-1.5 pt-1">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 text-amber-950 border-2 border-amber-300 text-xs sm:text-sm font-extrabold shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>LittleTale • 4-Stage Chase Adventure</span>
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
        </div>

        {/* Dynamic Title (Strictly ABOVE the picture book scene) */}
        <div className="mt-2 text-center">
          <span className="text-[11px] font-black uppercase tracking-widest text-amber-800 bg-amber-200/60 px-3 py-0.5 rounded-full border border-amber-300 inline-block mb-1">
            Grade 1–2 Interactive Reader
          </span>
          <h1 className="text-4xl sm:text-5xl font-black font-heading text-amber-950 tracking-wide drop-shadow-xs flex items-center justify-center gap-2">
            <span>Where</span>
            <span>is</span>
            <span className="text-rose-500 inline-block animate-bounce">
              Bunny?
            </span>
          </h1>
          <p className="text-xs font-black text-amber-800/80 mt-0.5">
            "Follow Bunny across 4 secret stages!"
          </p>
        </div>

        {/* Dialogue Banner (Placed strictly ABOVE the illustration card - ZERO overlap with Bunny!) */}
        <div className="h-7 w-full flex items-center justify-center my-1">
          {dialogueBanner ? (
            <div className="px-3.5 py-1 rounded-full bg-white border-2 border-amber-400 text-amber-950 font-black text-xs shadow-md animate-bounce">
              {dialogueBanner}
            </div>
          ) : (
            <span className="text-[11px] font-bold text-amber-700/70">
              Tap the bush below to see Bunny peek! 🍃
            </span>
          )}
        </div>
      </div>

      {/* 2. THE MAIN PICTURE-BOOK ILLUSTRATION CARD */}
      <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#FDF8EE] via-[#FFFDF5] to-[#FBF2DE] p-3.5 sm:p-4 shadow-2xl border-4 border-amber-300 flex flex-col items-center justify-between my-auto">
        <div
          onClick={handleBushClick}
          className={`relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border-2 border-amber-300/80 shadow-md cursor-pointer transition-transform duration-300 group ${
            bushShaking ? 'scale-105 rotate-1' : 'hover:scale-[1.02]'
          }`}
        >
          {/* Authentic Children's Storybook Watercolor Illustration */}
          <StorybookImage
            src={STORY_IMAGES.cover}
            alt="Where is Bunny? Storybook Adventure"
            fallbackIcon="🐰"
            fallbackTitle="Where is Bunny?"
          />

          {/* Interactive Tap Pill Overlay */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur-xs rounded-full border border-amber-300 shadow-md">
            <span className="text-xs">🐰</span>
            <span className="text-[11px] font-black text-amber-950 whitespace-nowrap">
              Tap Bunny to Play! ✨
            </span>
          </div>

          {/* Tap sparkle effect */}
          {bunnyPeek && (
            <div className="absolute inset-0 bg-amber-200/20 z-10 flex items-center justify-center animate-pulse">
              <div className="px-4 py-1.5 rounded-full bg-white/95 text-amber-950 font-black text-sm border-2 border-amber-400 shadow-xl animate-bounce">
                🐰 "Let&apos;s explore together! 💖"
              </div>
            </div>
          )}
        </div>

        {/* 4-Stage Signpost & Woodland Friends Bar */}
        <div className="w-full flex justify-between items-center z-10 pt-2.5 px-1">
          <button
            onClick={handleSignpostClick}
            className="px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-[11px] font-black text-amber-900 flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-amber-700" />
            <span>{currentStage.icon} Stage {currentStage.id}: {currentStage.name}</span>
          </button>

          <div className="flex gap-2 text-2xl">
            <span
              className="cursor-pointer hover:scale-125 transition-transform"
              onClick={() => handleAnimalClick('bear', '🐻 Bear: "Let\'s chase Bunny!"')}
              title="Bear"
            >
              🐻
            </span>
            <span
              className="cursor-pointer hover:scale-125 transition-transform"
              onClick={() => handleAnimalClick('squirrel', '🐿️ Squirrel: "He ran that way!"')}
              title="Squirrel"
            >
              🐿️
            </span>
            <span
              className="cursor-pointer hover:scale-125 transition-transform inline-flex items-center"
              onClick={() => handleAnimalClick('bird', '💙 Bluebird: "Tweet! Follow me!"')}
              title="Bluebird"
            >
              <BluebirdIcon size={26} />
            </span>
          </div>
        </div>

        {/* 4-Stage Trail Ribbon (Strictly BELOW the illustration scene) */}
        <div className="w-full mt-2.5 p-2 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-[11px] font-black text-amber-900">
          <span className="flex items-center gap-0.5">🌲 1. Entrance</span>
          <span>➔</span>
          <span className="flex items-center gap-0.5">🌳 2. Deep Forest</span>
          <span>➔</span>
          <span className="flex items-center gap-0.5">🏡 3. Cabin</span>
          <span>➔</span>
          <span className="flex items-center gap-0.5">🛏️ 4. Room</span>
        </div>
      </div>

      {/* 3. BOTTOM ACTION BUTTONS (Strictly BELOW Bunny) */}
      <div className="w-full max-w-sm flex flex-col gap-2 mb-2 pt-2">
        <button
          onClick={handleStart}
          className="w-full py-4 sm:py-4.5 px-6 rounded-3xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 hover:from-amber-500 hover:to-orange-500 active:scale-95 text-white font-black text-xl sm:text-2xl font-heading shadow-xl shadow-amber-400/35 flex items-center justify-center gap-3 cursor-pointer transition-all border-3 border-white ring-4 ring-amber-300/40 animate-pulse"
        >
          <Play className="w-7 h-7 fill-white" />
          <span>Start Story 📖</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playPop();
            onOpenWordAdventure();
          }}
          className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-amber-50 active:scale-98 text-amber-950 font-black text-sm border-2 border-amber-300 flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>Bunny's Word Adventure 🌸</span>
        </button>
      </div>
    </div>
  );
};
