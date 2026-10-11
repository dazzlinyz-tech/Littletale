import React, { useState } from 'react';
import { soundEngine } from '../utils/audio';

interface StoryIllustrationProps {
  pageNumber: number;
  onBunnyTapped?: () => void;
  isQuestionMode?: boolean;
  highlightBunny?: boolean;
}

export const StoryIllustration: React.FC<StoryIllustrationProps> = ({
  pageNumber,
  onBunnyTapped,
  isQuestionMode = false,
  highlightBunny = false,
}) => {
  const [bunnyBounced, setBunnyBounced] = useState(false);
  const [tapEffect, setTapEffect] = useState<{ text: string } | null>(null);

  const handleBunnyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playAnimalSound('bunny');
    soundEngine.playPop();
    setBunnyBounced(true);
    setTimeout(() => setBunnyBounced(false), 800);

    setTapEffect({
      text: pageNumber === 8 ? '🤗 Caught you! 💖' : '🐰 Peek-a-boo! ✨',
    });
    setTimeout(() => setTapEffect(null), 1200);

    if (onBunnyTapped) {
      onBunnyTapped();
    }
  };

  const handleAnimalClick = (e: React.MouseEvent, type: string, soundText: string) => {
    e.stopPropagation();
    soundEngine.playAnimalSound(type);
    soundEngine.playPop();
    setTapEffect({ text: soundText });
    setTimeout(() => setTapEffect(null), 1200);
  };

  return (
    <div className="relative w-full h-full min-h-[280px] max-h-[380px] md:max-h-[440px] rounded-3xl overflow-hidden shadow-inner border-4 border-amber-200/70 bg-gradient-to-b from-sky-100 via-emerald-50 to-emerald-100 transition-all select-none">
      {/* Floating tap message effect strictly at top edge (zero overlap with Bunny) */}
      {tapEffect && (
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 z-40 px-3.5 py-1 rounded-full bg-white/95 shadow-md border-2 border-amber-400 text-amber-950 font-black text-xs tracking-wide animate-bounce pointer-events-none transition-all"
        >
          {tapEffect.text}
        </div>
      )}

      {/* Interactive Helper Cue */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1 bg-white/85 backdrop-blur-xs rounded-full text-xs font-black text-emerald-900 shadow-sm border border-emerald-300/60">
        <span>👆</span>
        <span>Tap characters!</span>
      </div>

      {/* SVG Viewport */}
      <svg
        viewBox="0 0 500 340"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="skyGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="70%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#FEF3C7" />
          </linearGradient>

          <linearGradient id="deepForestSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="60%" stopColor="#7DD3FC" />
            <stop offset="100%" stopColor="#BBF7D0" />
          </linearGradient>

          <linearGradient id="cabinSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#FED7AA" />
          </linearGradient>

          <linearGradient id="roomSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FBCFE8" />
            <stop offset="100%" stopColor="#FEF08A" />
          </linearGradient>

          <linearGradient id="treeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#854D0E" />
            <stop offset="100%" stopColor="#A16207" />
          </linearGradient>

          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>

        {/* ============================================================== */}
        {/* 1. FOREST ENTRANCE - Page 1: Where is little Bunny? */}
        {/* ============================================================== */}
        {pageNumber === 1 && (
          <g id="scene-1-forest-entrance">
            <rect width="500" height="340" fill="url(#skyGrad1)" />
            <circle cx="70" cy="50" r="30" fill="#FDE047" opacity="0.9" />

            {/* Distant Hills */}
            <path d="M0 210 Q 130 160, 260 210 T 500 200 L 500 340 L 0 340 Z" fill="#BBF7D0" />
            <path d="M0 240 Q 180 190, 360 250 T 500 240 L 500 340 L 0 340 Z" fill="#86EFAC" />

            {/* Wooden Trail Arch */}
            <path d="M 120 280 L 120 120 Q 250 80 380 120 L 380 280" stroke="#854D0E" strokeWidth="12" fill="none" strokeLinecap="round" />
            {/* Arch Sign: "Forest Trail" */}
            <rect x="180" y="90" width="140" height="30" rx="8" fill="#D97706" stroke="#92400E" strokeWidth="2" />
            <text x="250" y="110" fill="#FFFFFF" fontSize="13" fontWeight="bold" textAnchor="middle">FOREST TRAIL 🌲</text>

            {/* Meadow Flowers with Bunny peeking */}
            <g transform="translate(240, 220)">
              <circle cx="-30" cy="20" r="38" fill="#4ADE80" />
              <circle cx="30" cy="20" r="42" fill="#22C55E" />

              {/* BUNNY */}
              <g
                className={`cursor-pointer transition-transform duration-300 ${bunnyBounced ? '-translate-y-4 scale-105' : 'hover:-translate-y-1'} ${highlightBunny ? 'filter drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]' : ''}`}
                onClick={handleBunnyClick}
              >
                {isQuestionMode && <circle cx="0" cy="-20" r="46" fill="#FDE047" opacity="0.35" className="animate-pulse" />}
                {/* Ears */}
                <ellipse cx="-16" cy="-45" rx="8" ry="26" fill="#FFFBEB" transform="rotate(-8 -16 -45)" />
                <ellipse cx="-16" cy="-45" rx="4" ry="18" fill="#F472B6" transform="rotate(-8 -16 -45)" />
                <ellipse cx="16" cy="-45" rx="8" ry="26" fill="#FFFBEB" transform="rotate(8 16 -45)" />
                <ellipse cx="16" cy="-45" rx="4" ry="18" fill="#F472B6" transform="rotate(8 16 -45)" />
                {/* Head */}
                <circle cx="0" cy="-12" r="28" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="2" />
                <circle cx="-10" cy="-14" r="3.5" fill="#1E293B" />
                <circle cx="10" cy="-14" r="3.5" fill="#1E293B" />
                <polygon points="0,-8 -4,-12 4,-12" fill="#F472B6" />
                <circle cx="-18" cy="-8" r="5" fill="#FCA5A5" opacity="0.6" />
                <circle cx="18" cy="-8" r="5" fill="#FCA5A5" opacity="0.6" />
              </g>

              {/* Flowers in front */}
              <circle cx="-35" cy="28" r="22" fill="#FB7185" />
              <circle cx="-35" cy="28" r="8" fill="#FEF08A" />
              <circle cx="0" cy="36" r="26" fill="#F43F5E" />
              <circle cx="0" cy="36" r="9" fill="#FEF08A" />
              <circle cx="35" cy="26" r="20" fill="#EC4899" />
              <circle cx="35" cy="26" r="7" fill="#FEF08A" />
            </g>
          </g>
        )}

        {/* ============================================================== */}
        {/* 1. FOREST ENTRANCE - Page 2: Bunny runs into the forest! */}
        {/* ============================================================== */}
        {pageNumber === 2 && (
          <g id="scene-2-forest-trail">
            <rect width="500" height="340" fill="#BAE6FD" />
            {/* Winding trail path */}
            <path d="M 0 220 Q 200 180 350 210 T 500 200 L 500 340 L 0 340 Z" fill="#6EE7B7" />
            <path d="M 50 340 Q 200 240 450 200 L 490 230 Q 250 280 80 340 Z" fill="#FDE68A" opacity="0.8" />

            {/* Wooden directional signpost pointing forward */}
            <g
              transform="translate(140, 180)"
              className="cursor-pointer"
              onClick={() => {
                soundEngine.playCreakingDoor();
                setTapEffect({ text: '🪵 Sign: "Deep Forest ➡️"' });
                setTimeout(() => setTapEffect(null), 1200);
              }}
            >
              <rect x="-8" y="0" width="16" height="110" fill="#854D0E" rx="3" />
              {/* Arrow sign pointing Right */}
              <polygon points="-40,-35 60,-35 80,-20 60,-5 -40,-5" fill="#D97706" stroke="#92400E" strokeWidth="2" />
              <text x="15" y="-16" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">DEEP FOREST ➔</text>
            </g>

            {/* BUNNY (Running fast ahead on the trail!) */}
            <g
              transform="translate(360, 185)"
              className={`cursor-pointer transition-transform duration-300 ${bunnyBounced ? '-translate-y-4 scale-105' : 'hover:scale-105'} ${highlightBunny ? 'filter drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]' : ''}`}
              onClick={handleBunnyClick}
            >
              {isQuestionMode && <circle cx="0" cy="0" r="48" fill="#FDE047" opacity="0.4" className="animate-pulse" />}
              {/* Speed dust puffs */}
              <circle cx="-35" cy="20" r="8" fill="#E2E8F0" opacity="0.8" />
              <circle cx="-48" cy="22" r="5" fill="#CBD5E1" opacity="0.6" />

              {/* Bunny body leaning forward into a run */}
              <ellipse cx="0" cy="10" rx="26" ry="18" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="2" transform="rotate(-15 0 10)" />
              {/* Running paws */}
              <ellipse cx="24" cy="24" rx="8" ry="4" fill="#FFFBEB" transform="rotate(20 24 24)" />
              <ellipse cx="-20" cy="20" rx="8" ry="5" fill="#FFFBEB" transform="rotate(-30 -20 20)" />

              {/* Head turned forward */}
              <circle cx="16" cy="-4" r="22" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="2" />
              <circle cx="24" cy="-6" r="3.5" fill="#1E293B" />
              <polygon points="28,-2 25,-5 29,-5" fill="#F472B6" />

              {/* Ears streaming backward in the wind */}
              <ellipse cx="-10" cy="-24" rx="22" ry="7" fill="#FFFBEB" transform="rotate(-25 -10 -24)" />
              <ellipse cx="-10" cy="-24" rx="14" ry="3.5" fill="#F472B6" transform="rotate(-25 -10 -24)" />
              <ellipse cx="-4" cy="-34" rx="20" ry="6" fill="#FFFBEB" transform="rotate(-18 -4 -34)" />
              <ellipse cx="-4" cy="-34" rx="12" ry="3" fill="#F472B6" transform="rotate(-18 -4 -34)" />
            </g>
          </g>
        )}

        {/* ============================================================== */}
        {/* 2. DEEP FOREST - Page 3: Bunny is behind the tree. */}
        {/* ============================================================== */}
        {pageNumber === 3 && (
          <g id="scene-3-behind-tree">
            <rect width="500" height="340" fill="url(#deepForestSky)" />
            <path d="M0 240 Q 250 180, 500 240 L 500 340 L 0 340 Z" fill="#22C55E" />

            {/* BUNNY (Peeking from BEHIND tree) */}
            <g
              transform="translate(325, 175)"
              className={`cursor-pointer transition-transform duration-300 ${bunnyBounced ? 'translate-x-3' : 'hover:translate-x-2'} ${highlightBunny ? 'filter drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]' : ''}`}
              onClick={handleBunnyClick}
            >
              {isQuestionMode && <circle cx="16" cy="10" r="44" fill="#FDE047" opacity="0.4" className="animate-pulse" />}
              <ellipse cx="28" cy="-28" rx="8" ry="24" fill="#FFFBEB" transform="rotate(25 28 -28)" />
              <ellipse cx="28" cy="-28" rx="4" ry="16" fill="#F472B6" transform="rotate(25 28 -28)" />
              <circle cx="18" cy="10" r="26" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="2" />
              <circle cx="26" cy="8" r="3.5" fill="#1E293B" />
              <polygon points="26,16 23,13 29,13" fill="#F472B6" />
            </g>

            {/* Giant Oak Tree in front */}
            <path d="M 230 110 L 220 310 Q 260 325 310 310 L 295 110 Z" fill="url(#treeGrad)" />
            <circle cx="260" cy="80" r="85" fill="#15803D" />
            <circle cx="195" cy="95" r="70" fill="#16A34A" />
            <circle cx="325" cy="90" r="75" fill="#22C55E" />

            {/* Squirrel on branch */}
            <g
              transform="translate(145, 125)"
              className="cursor-pointer"
              onClick={(e) => handleAnimalClick(e, 'squirrel', '🐿️ Squeak-chatter!')}
            >
              <path d="M 12 10 Q 35 -10 25 -30 Q 15 -45 -5 -35 Q -10 -25 5 -10 Z" fill="#D97706" />
              <ellipse cx="-8" cy="10" rx="13" ry="16" fill="#F59E0B" />
              <circle cx="-16" cy="-4" r="12" fill="#F59E0B" />
              <circle cx="-19" cy="-6" r="2.5" fill="#1E293B" />
            </g>
          </g>
        )}

        {/* ============================================================== */}
        {/* 2. DEEP FOREST - Page 4: Bunny is across the river. */}
        {/* ============================================================== */}
        {pageNumber === 4 && (
          <g id="scene-4-across-river">
            <rect width="500" height="340" fill="url(#deepForestSky)" />
            {/* Near river bank */}
            <path d="M 0 270 Q 120 250 200 290 L 200 340 L 0 340 Z" fill="#4ADE80" />
            {/* River Stream */}
            <path d="M 120 180 Q 240 220 380 180 L 450 340 L 150 340 Z" fill="url(#waterGrad)" />

            {/* Stepping Stones in water */}
            <ellipse cx="230" cy="270" rx="28" ry="15" fill="#64748B" />
            <ellipse cx="290" cy="245" rx="30" ry="16" fill="#475569" />

            {/* Far River Bank */}
            <path d="M 330 160 Q 420 150 500 170 L 500 340 L 350 340 Z" fill="#86EFAC" />

            {/* Bluebird (파랑새) perched on riverside flowering branch */}
            <g
              transform="translate(70, 115)"
              className="cursor-pointer hover:scale-110 transition-transform"
              onClick={(e) => handleAnimalClick(e, 'bird', '💙 Bluebird: "Tweet-twoo! Across the river!"')}
            >
              {/* Wooden tree branch */}
              <path d="M -50 20 Q 0 14 45 22" stroke="#78350F" strokeWidth="6" strokeLinecap="round" fill="none" />
              <circle cx="15" cy="16" r="5" fill="#86EFAC" />
              <circle cx="30" cy="18" r="4" fill="#86EFAC" />
              <circle cx="-10" cy="16" r="3" fill="#FDE047" />

              {/* Bluebird tail */}
              <path d="M -12 14 L -24 19 Q -20 14 -14 11 Z" fill="#0369A1" />

              {/* Bluebird Body (Sky Blue) */}
              <ellipse cx="2" cy="7" rx="16" ry="13" fill="#0284C7" />

              {/* Soft light cyan belly */}
              <path d="M -4 5 Q 10 5 12 13 Q 5 19 -4 17 Z" fill="#BAE6FD" opacity="0.9" />

              {/* Royal Blue Wing */}
              <path d="M -9 5 Q -1 3 5 11 Q -3 18 -11 11 Z" fill="#0369A1" />

              {/* Bluebird Head */}
              <circle cx="11" cy="-3" r="11" fill="#0284C7" />
              {/* Crest feather */}
              <path d="M 9 -13 Q 13 -16 15 -11 Q 11 -9 9 -13 Z" fill="#0369A1" />

              {/* Big sparkly eye */}
              <circle cx="14" cy="-5" r="2.8" fill="#0F172A" />
              <circle cx="15" cy="-6" r="1" fill="#FFFFFF" />

              {/* Bright yellow beak */}
              <polygon points="20,-4 28,-1 20,2" fill="#FACC15" stroke="#EAB308" strokeWidth="0.8" />

              {/* Orange feet grasping branch */}
              <line x1="-2" y1="18" x2="-2" y2="23" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="4" y1="18" x2="4" y2="23" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />

              {/* Music notes */}
              <text x="24" y="-12" fill="#0284C7" fontSize="12" fontWeight="bold">♪</text>
            </g>

            {/* Frog on Near Bank */}
            <g
              transform="translate(90, 275)"
              className="cursor-pointer"
              onClick={(e) => handleAnimalClick(e, 'frog', '🐸 Ribbit-ribbit!')}
            >
              <ellipse cx="0" cy="0" rx="16" ry="12" fill="#22C55E" />
              <circle cx="-6" cy="-8" r="6" fill="#22C55E" />
              <circle cx="-6" cy="-8" r="3" fill="#1E293B" />
              <circle cx="6" cy="-8" r="6" fill="#22C55E" />
              <circle cx="6" cy="-8" r="3" fill="#1E293B" />
            </g>

            {/* BUNNY (Sitting proudly ACROSS on the far rock bank!) */}
            <g
              transform="translate(420, 210)"
              className={`cursor-pointer transition-transform duration-300 ${bunnyBounced ? '-translate-y-4' : 'hover:-translate-y-1'} ${highlightBunny ? 'filter drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]' : ''}`}
              onClick={handleBunnyClick}
            >
              {isQuestionMode && <circle cx="0" cy="-5" r="45" fill="#FDE047" opacity="0.4" className="animate-pulse" />}
              {/* Rock under Bunny */}
              <ellipse cx="0" cy="30" rx="40" ry="18" fill="#475569" />
              {/* Body */}
              <ellipse cx="0" cy="10" rx="20" ry="22" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="2" />
              {/* Ears */}
              <ellipse cx="-8" cy="-35" rx="7" ry="24" fill="#FFFBEB" transform="rotate(-6 -8 -35)" />
              <ellipse cx="-8" cy="-35" rx="3.5" ry="16" fill="#F472B6" transform="rotate(-6 -8 -35)" />
              <ellipse cx="8" cy="-35" rx="7" ry="24" fill="#FFFBEB" transform="rotate(6 8 -35)" />
              <ellipse cx="8" cy="-35" rx="3.5" ry="16" fill="#F472B6" transform="rotate(6 8 -35)" />
              {/* Head */}
              <circle cx="0" cy="-12" r="20" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="2" />
              <circle cx="-6" cy="-14" r="3" fill="#1E293B" />
              <circle cx="6" cy="-14" r="3" fill="#1E293B" />
              <polygon points="0,-9 -3,-12 3,-12" fill="#F472B6" />
            </g>
          </g>
        )}

        {/* ============================================================== */}
        {/* 3. OUTSIDE CABIN - Page 5: Bunny is by the fence. */}
        {/* ============================================================== */}
        {pageNumber === 5 && (
          <g id="scene-5-by-fence">
            <rect width="500" height="340" fill="url(#cabinSky)" />
            <path d="M0 210 Q 250 180 500 210 L 500 340 L 0 340 Z" fill="#86EFAC" />

            {/* Cozy Woodland Cabin in background */}
            <g transform="translate(320, 110)">
              {/* Stone Chimney with smoke */}
              <rect x="70" y="-30" width="24" height="60" fill="#78716C" />
              <circle cx="82" cy="-45" r="10" fill="#E2E8F0" opacity="0.7" />
              <circle cx="90" cy="-65" r="14" fill="#E2E8F0" opacity="0.5" />
              {/* Log Walls */}
              <rect x="-40" y="20" width="140" height="90" fill="#B45309" stroke="#78350F" strokeWidth="3" />
              {/* Roof */}
              <polygon points="-60,20 30,-35 120,20" fill="#991B1B" />
              {/* Window */}
              <rect x="10" y="45" width="30" height="30" fill="#FEF08A" stroke="#451A03" strokeWidth="3" />
            </g>

            {/* Warm Wooden & White Picket Fence in Foreground */}
            <g transform="translate(0, 215)">
              {/* Wooden Rails */}
              <rect x="0" y="26" width="290" height="7" rx="2" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
              <rect x="0" y="52" width="290" height="7" rx="2" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
              {/* White Pickets with brown outlines */}
              {[25, 65, 105, 145, 185, 225, 265].map((x) => (
                <g key={x}>
                  <polygon points={`${x - 9},12 ${x},2 ${x + 9},12 ${x + 9},82 ${x - 9},82`} fill="#FFFFFF" stroke="#78350F" strokeWidth="2" />
                  <line x1={x - 4} y1="14" x2={x - 4} y2="78" stroke="#E2E8F0" strokeWidth="1.5" />
                </g>
              ))}
              {/* Little flowers along fence */}
              <circle cx="45" cy="80" r="4" fill="#FACC15" />
              <circle cx="125" cy="80" r="4" fill="#FB7185" />
              <circle cx="205" cy="80" r="4" fill="#FACC15" />
            </g>

            {/* BUNNY (Running right BY the fence!) */}
            <g
              transform="translate(170, 230)"
              className={`cursor-pointer transition-transform duration-300 ${bunnyBounced ? '-translate-y-4' : 'hover:scale-105'} ${highlightBunny ? 'filter drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]' : ''}`}
              onClick={handleBunnyClick}
            >
              {isQuestionMode && <circle cx="0" cy="0" r="44" fill="#FDE047" opacity="0.4" className="animate-pulse" />}
              <ellipse cx="0" cy="12" rx="20" ry="16" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="2" />
              <ellipse cx="-8" cy="-30" rx="6" ry="22" fill="#FFFBEB" transform="rotate(-10 -8 -30)" />
              <ellipse cx="8" cy="-30" rx="6" ry="22" fill="#FFFBEB" transform="rotate(10 8 -30)" />
              <circle cx="0" cy="-8" r="18" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="2" />
              <circle cx="-5" cy="-10" r="2.5" fill="#1E293B" />
              <circle cx="5" cy="-10" r="2.5" fill="#1E293B" />
              <polygon points="0,-6 -2,-9 2,-9" fill="#F472B6" />
            </g>
          </g>
        )}

        {/* ============================================================== */}
        {/* 3. OUTSIDE CABIN - Page 6: Bunny goes under the porch. */}
        {/* ============================================================== */}
        {pageNumber === 6 && (
          <g id="scene-6-under-porch">
            <rect width="500" height="340" fill="url(#cabinSky)" />
            <path d="M0 240 L 500 240 L 500 340 L 0 340 Z" fill="#FED7AA" />

            {/* Front Wooden Cabin Porch & Steps */}
            <g transform="translate(180, 110)">
              {/* Cabin Door */}
              <rect x="60" y="30" width="60" height="100" fill="#92400E" stroke="#451A03" strokeWidth="3" />
              <circle cx="110" cy="80" r="4" fill="#FACC15" />
              {/* Porch roof beam */}
              <rect x="-10" y="20" width="160" height="15" fill="#78350F" />
              {/* Wooden Steps */}
              <rect x="10" y="130" width="140" height="18" fill="#B45309" stroke="#78350F" strokeWidth="2" />
              <rect x="0" y="148" width="160" height="20" fill="#92400E" stroke="#78350F" strokeWidth="2" />
              <rect x="-10" y="168" width="180" height="22" fill="#78350F" stroke="#451A03" strokeWidth="2" />
            </g>

            {/* Shaded space UNDER the porch */}
            <rect x="170" y="240" width="180" height="60" fill="#451A03" opacity="0.6" rx="6" />

            {/* BUNNY (Sheltered UNDER the porch steps!) */}
            <g
              transform="translate(250, 255)"
              className={`cursor-pointer transition-transform duration-300 ${bunnyBounced ? '-translate-y-3' : 'hover:-translate-y-1'} ${highlightBunny ? 'filter drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]' : ''}`}
              onClick={handleBunnyClick}
            >
              {isQuestionMode && <circle cx="0" cy="5" r="44" fill="#FDE047" opacity="0.4" className="animate-pulse" />}
              <ellipse cx="0" cy="14" rx="20" ry="18" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="2" />
              {/* Tilted ears under steps */}
              <ellipse cx="-10" cy="-22" rx="7" ry="18" fill="#FFFBEB" transform="rotate(-20 -10 -22)" />
              <ellipse cx="10" cy="-22" rx="7" ry="18" fill="#FFFBEB" transform="rotate(15 10 -22)" />
              <circle cx="0" cy="-4" r="18" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="2" />
              <circle cx="-6" cy="-6" r="3" fill="#1E293B" />
              <circle cx="6" cy="-6" r="3" fill="#1E293B" />
              <polygon points="0,-2 -3,-5 3,-5" fill="#F472B6" />
            </g>
          </g>
        )}

        {/* ============================================================== */}
        {/* 4. INSIDE CABIN - Page 7: Bunny is in the basket. */}
        {/* ============================================================== */}
        {pageNumber === 7 && (
          <g id="scene-7-in-basket">
            <rect width="500" height="340" fill="#FEF3C7" />
            {/* Wooden Floor Planks */}
            <path d="M 0 200 L 500 200 L 500 340 L 0 340 Z" fill="#FED7AA" />
            <line x1="0" y1="240" x2="500" y2="240" stroke="#FDBA74" strokeWidth="2" />
            <line x1="0" y1="280" x2="500" y2="280" stroke="#FDBA74" strokeWidth="2" />

            {/* Fireplace Hearth Left */}
            <g transform="translate(80, 140)">
              <rect x="-40" y="-10" width="80" height="90" fill="#78716C" rx="4" />
              <rect x="-25" y="15" width="50" height="65" fill="#1C1917" rx="4" />
              {/* Flames */}
              <polygon points="-12,70 0,35 12,70" fill="#EA580C" />
              <polygon points="-6,70 0,45 6,70" fill="#FACC15" />
            </g>

            {/* Sleeping Cat on Rug */}
            <g
              transform="translate(390, 260)"
              className="cursor-pointer"
              onClick={(e) => handleAnimalClick(e, 'cat', '🐱 Purr... Meow!')}
            >
              <ellipse cx="0" cy="0" rx="30" ry="20" fill="#FB923C" />
              <circle cx="-16" cy="-8" r="14" fill="#FFFFFF" />
              <path d="M -22 -8 Q -16 -4 -10 -8" stroke="#431407" strokeWidth="2" fill="none" />
            </g>

            {/* Woven Blanket Basket */}
            <g transform="translate(240, 210)">
              {/* Back of basket */}
              <ellipse cx="0" cy="0" rx="55" ry="24" fill="#92400E" />

              {/* BUNNY (Popping out of basket!) */}
              <g
                className={`cursor-pointer transition-transform duration-300 ${bunnyBounced ? '-translate-y-5' : 'hover:-translate-y-1'} ${highlightBunny ? 'filter drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]' : ''}`}
                onClick={handleBunnyClick}
              >
                {isQuestionMode && <circle cx="0" cy="-15" r="46" fill="#FDE047" opacity="0.4" className="animate-pulse" />}
                <ellipse cx="-12" cy="-50" rx="8" ry="26" fill="#FFFBEB" transform="rotate(-6 -12 -50)" />
                <ellipse cx="-12" cy="-50" rx="4" ry="18" fill="#F472B6" transform="rotate(-6 -12 -50)" />
                <ellipse cx="12" cy="-50" rx="8" ry="26" fill="#FFFBEB" transform="rotate(6 12 -50)" />
                <ellipse cx="12" cy="-50" rx="4" ry="18" fill="#F472B6" transform="rotate(6 12 -50)" />
                <circle cx="0" cy="-18" r="26" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="2" />
                <circle cx="-9" cy="-20" r="3.5" fill="#1E293B" />
                <circle cx="9" cy="-20" r="3.5" fill="#1E293B" />
                <polygon points="0,-14 -3,-18 3,-18" fill="#F472B6" />
                <path d="M -5 -10 Q 0 -6 5 -10" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
                {/* Paws on rim */}
                <ellipse cx="-18" cy="8" rx="8" ry="5" fill="#FFFBEB" stroke="#FDE68A" />
                <ellipse cx="18" cy="8" rx="8" ry="5" fill="#FFFBEB" stroke="#FDE68A" />
              </g>

              {/* Front of wicker basket */}
              <path d="M -55 0 Q 0 45 55 0 L 45 65 Q 0 85 -45 65 Z" fill="#D97706" stroke="#78350F" strokeWidth="2" />
              <path d="M -45 25 Q 0 50 45 25" stroke="#B45309" strokeWidth="3" fill="none" strokeDasharray="6 4" />
            </g>
          </g>
        )}

        {/* ============================================================== */}
        {/* 5. BEDROOM - Page 8: Caught you! Happy Bunny! */}
        {/* ============================================================== */}
        {pageNumber === 8 && (
          <g id="scene-8-bedroom-caught">
            <rect width="500" height="340" fill="url(#roomSky)" />
            <path d="M0 220 L 500 220 L 500 340 L 0 340 Z" fill="#FBCFE8" />

            {/* Cozy Bedroom Quilt Bed */}
            <g transform="translate(250, 180)">
              {/* Wooden Headboard */}
              <rect x="-130" y="-70" width="260" height="80" rx="10" fill="#92400E" stroke="#451A03" strokeWidth="3" />
              {/* Pillows */}
              <ellipse cx="-60" cy="-20" rx="35" ry="18" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
              <ellipse cx="60" cy="-20" rx="35" ry="18" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
              {/* Colorful Patchwork Quilt Blanket */}
              <rect x="-120" y="0" width="240" height="110" rx="16" fill="#F472B6" stroke="#DB2777" strokeWidth="3" />
              <rect x="-100" y="20" width="50" height="40" fill="#FDE047" opacity="0.8" rx="6" />
              <rect x="-40" y="20" width="50" height="40" fill="#67E8F9" opacity="0.8" rx="6" />
              <rect x="20" y="20" width="50" height="40" fill="#A7F3D0" opacity="0.8" rx="6" />
            </g>

            {/* Nightstand Lamp */}
            <g transform="translate(60, 160)">
              <rect x="-15" y="40" width="30" height="50" fill="#B45309" />
              <polygon points="-25,40 25,40 15,0 -15,0" fill="#FEF08A" stroke="#EAB308" strokeWidth="2" />
              <circle cx="0" cy="20" r="14" fill="#FDE047" opacity="0.4" className="animate-pulse" />
            </g>

            {/* Bear & Friends celebrating around bed */}
            <g
              transform="translate(100, 230)"
              className="cursor-pointer"
              onClick={(e) => handleAnimalClick(e, 'bear', '🐻 Bear: "We found you!"')}
            >
              <ellipse cx="0" cy="20" rx="38" ry="36" fill="#78350F" />
              <circle cx="0" cy="-14" r="26" fill="#78350F" />
              <ellipse cx="0" cy="-8" rx="12" ry="8" fill="#B45309" />
            </g>

            {/* FINAL CAUGHT BUNNY (Jumping joyfully with heart sparkles!) */}
            <g
              transform="translate(250, 170)"
              className={`cursor-pointer transition-transform duration-300 ${bunnyBounced ? '-translate-y-8 scale-110' : 'animate-bounce'} ${highlightBunny ? 'filter drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]' : ''}`}
              onClick={handleBunnyClick}
            >
              {isQuestionMode && <circle cx="0" cy="-10" r="52" fill="#FDE047" opacity="0.4" className="animate-pulse" />}
              {/* Big Celebration Heart */}
              <text x="32" y="-35" fontSize="28" className="animate-ping">💖</text>

              {/* Ears spread wide in happiness */}
              <ellipse cx="-18" cy="-50" rx="7" ry="26" fill="#FFFBEB" transform="rotate(-20 -18 -50)" />
              <ellipse cx="-18" cy="-50" rx="3.5" ry="18" fill="#F472B6" transform="rotate(-20 -18 -50)" />
              <ellipse cx="18" cy="-50" rx="7" ry="26" fill="#FFFBEB" transform="rotate(20 18 -50)" />
              <ellipse cx="18" cy="-50" rx="3.5" ry="18" fill="#F472B6" transform="rotate(20 18 -50)" />
              {/* Body */}
              <ellipse cx="0" cy="15" rx="22" ry="24" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="2" />
              {/* Raised Paws */}
              <ellipse cx="-20" cy="-5" rx="8" ry="6" fill="#FFFBEB" transform="rotate(-30 -20 -5)" />
              <ellipse cx="20" cy="-5" rx="8" ry="6" fill="#FFFBEB" transform="rotate(30 20 -5)" />
              {/* Head */}
              <circle cx="0" cy="-14" r="26" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="2" />
              {/* Big Smiling Eyes & Rosy Cheeks */}
              <path d="M -14 -16 Q -8 -22 -2 -16" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 2 -16 Q 8 -22 14 -16" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
              <circle cx="-16" cy="-8" r="6" fill="#FDA4AF" opacity="0.8" />
              <circle cx="16" cy="-8" r="6" fill="#FDA4AF" opacity="0.8" />
              <path d="M -8 -8 Q 0 4 8 -8 Z" fill="#F43F5E" />
              <polygon points="0,-11 -3,-14 3,-14" fill="#F472B6" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
