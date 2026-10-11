import React, { useState } from 'react';
import { soundEngine } from '../utils/audio';
import { Sparkles, Play, Music, Compass } from 'lucide-react';
import { STAGES } from '../data/storyData';
import { BluebirdIcon } from './BluebirdIcon';

interface CoverScreenProps {
  onStartStory: () => void;
  onOpenSoundGame: () => void;
}

export const CoverScreen: React.FC<CoverScreenProps> = ({
  onStartStory,
  onOpenSoundGame,
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

      {/* 2. THE MAIN PICTURE-BOOK ILLUSTRATION CARD
          Bunny is placed with clean vertical clearance. No text overlays Bunny's face or body! */}
      <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#FDF8EE] via-[#FFFDF5] to-[#FBF2DE] p-4 shadow-2xl border-4 border-amber-300/80 flex flex-col items-center justify-between my-auto">
        <div className="relative w-full h-56 rounded-2xl bg-gradient-to-b from-sky-200 via-emerald-100 to-emerald-200 p-3 border-2 border-emerald-300/60 overflow-hidden flex flex-col justify-between items-center shadow-inner">
          {/* Top Sky Bar: Sun & Cloud */}
          <div className="w-full flex justify-between items-start z-10">
            <span className="text-3xl animate-bounce">☀️</span>
            <span className="text-2xl opacity-75">☁️</span>
          </div>

          {/* Center Area: Peek-a-boo Bunny & Rustling Bush (Completely Clear Sightline) */}
          <div
            onClick={handleBushClick}
            className={`relative z-20 cursor-pointer flex flex-col items-center transition-transform ${
              bushShaking ? 'scale-110 rotate-3' : 'hover:scale-105'
            }`}
          >
            {/* Peek-a-boo Bunny rising cleanly above the bush foliage */}
            <div
              className={`transition-all duration-300 flex flex-col items-center ${
                bunnyPeek
                  ? '-translate-y-2 opacity-100 scale-110'
                  : 'translate-y-6 opacity-0 pointer-events-none'
              }`}
            >
              <span className="text-5xl filter drop-shadow-sm animate-ear-wiggle">
                🐰
              </span>
            </div>

            {/* Bush Foliage */}
            <div className="flex items-center justify-center -mt-3">
              <span className="text-6xl filter drop-shadow-md">🌳</span>
            </div>

            {/* Tap Guide Pill strictly BELOW the bush */}
            <span className="mt-1 text-[10px] font-bold text-emerald-900 bg-white/90 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-xs whitespace-nowrap">
              Tap the bush! 🍃
            </span>
          </div>

          {/* Bottom Bar: 4-Stage Signpost & Woodland Friends (Strictly BELOW Bunny) */}
          <div className="w-full flex justify-between items-end z-10 pt-1.5 border-t border-emerald-300/40">
            <button
              onClick={handleSignpostClick}
              className="px-2.5 py-1 rounded-xl bg-amber-100/90 hover:bg-amber-200 border border-amber-300 text-[10px] font-black text-amber-900 flex items-center gap-1 cursor-pointer shadow-xs active:scale-95 transition-all"
            >
              <Compass className="w-3 h-3 text-amber-700" />
              <span>{currentStage.icon} Stage {currentStage.id}: {currentStage.name}</span>
            </button>

            <div className="flex gap-2 text-2xl">
              <span
                className="cursor-pointer hover:scale-125 transition-transform"
                onClick={() => handleAnimalClick('bear', '🐻 Bear: "Let\'s chase Bunny!"')}
              >
                🐻
              </span>
              <span
                className="cursor-pointer hover:scale-125 transition-transform"
                onClick={() => handleAnimalClick('squirrel', '🐿️ Squirrel: "He ran that way!"')}
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
            onOpenSoundGame();
          }}
          className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-emerald-50 active:scale-98 text-emerald-800 font-black text-sm border-2 border-emerald-300 flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
        >
          <Music className="w-4 h-4 text-emerald-600" />
          <span>Sound Mystery Detective 🎧</span>
        </button>
      </div>
    </div>
  );
};
