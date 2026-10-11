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
    <div className="relative w-full h-full min-h-[290px] max-h-[390px] md:max-h-[440px] rounded-3xl overflow-hidden shadow-md border-4 border-amber-300/80 bg-gradient-to-b from-sky-100 via-emerald-50 to-emerald-100 transition-all select-none">
      {/* Floating tap message effect strictly at top edge (zero overlap with Bunny) */}
      {tapEffect && (
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 z-40 px-4 py-1.5 rounded-full bg-white/95 shadow-lg border-2 border-amber-400 text-amber-950 font-black text-xs tracking-wide animate-bounce pointer-events-none transition-all"
        >
          {tapEffect.text}
        </div>
      )}

      {/* Interactive Helper Cue */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-xs rounded-full text-xs font-black text-emerald-900 shadow-sm border border-emerald-300">
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
          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.18" />
          </filter>
          <filter id="characterShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodOpacity="0.25" />
          </filter>

          {/* Sky Gradients */}
          <linearGradient id="skyGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="45%" stopColor="#BAE6FD" />
            <stop offset="80%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#FEF3C7" />
          </linearGradient>

          <linearGradient id="deepForestSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="40%" stopColor="#38BDF8" />
            <stop offset="80%" stopColor="#7DD3FC" />
            <stop offset="100%" stopColor="#BBF7D0" />
          </linearGradient>

          <linearGradient id="cabinSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="40%" stopColor="#FDE68A" />
            <stop offset="85%" stopColor="#FED7AA" />
            <stop offset="100%" stopColor="#FED7AA" />
          </linearGradient>

          <linearGradient id="roomSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="50%" stopColor="#FBCFE8" />
            <stop offset="100%" stopColor="#FEF08A" />
          </linearGradient>

          {/* Foliage and Terrain Gradients */}
          <linearGradient id="hillGradDistant" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="100%" stopColor="#6EE7B7" />
          </linearGradient>
          <linearGradient id="hillGradMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
          <linearGradient id="hillGradForeground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>

          {/* Tree Trunk Gradient */}
          <linearGradient id="treeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="50%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Sparkling River Gradient */}
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>

          {/* Wooden arch & sign gradient */}
          <linearGradient id="woodSignGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* ============================================================== */}
        {/* 1. FOREST ENTRANCE - Page 1: Where is little Bunny? */}
        {/* ============================================================== */}
        {pageNumber === 1 && (
          <g id="scene-1-forest-entrance">
            <rect width="500" height="340" fill="url(#skyGrad1)" />

            {/* Glowing Sun with Sunrays */}
            <circle cx="80" cy="50" r="32" fill="#FBBF24" opacity="0.35" />
            <circle cx="80" cy="50" r="24" fill="#FDE047" stroke="#F59E0B" strokeWidth="2" />
            {/* Sun rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <line
                key={angle}
                x1={80 + 30 * Math.cos((angle * Math.PI) / 180)}
                y1={50 + 30 * Math.sin((angle * Math.PI) / 180)}
                x2={80 + 38 * Math.cos((angle * Math.PI) / 180)}
                y2={50 + 38 * Math.sin((angle * Math.PI) / 180)}
                stroke="#FBBF24"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ))}

            {/* Fluffy Clouds */}
            <g opacity="0.9" filter="url(#softShadow)">
              <ellipse cx="210" cy="45" rx="35" ry="14" fill="#FFFFFF" />
              <ellipse cx="230" cy="38" rx="22" ry="16" fill="#FFFFFF" />
              <ellipse cx="195" cy="42" rx="18" ry="12" fill="#FFFFFF" />

              <ellipse cx="380" cy="65" rx="30" ry="12" fill="#FFFFFF" />
              <ellipse cx="395" cy="58" rx="18" ry="14" fill="#FFFFFF" />
            </g>

            {/* Layered Distant Mountains & Rolling Hills */}
            <path d="M0 190 Q 90 145 190 185 T 390 170 Q 450 160 500 180 L 500 340 L 0 340 Z" fill="url(#hillGradDistant)" />
            <path d="M0 220 Q 140 180 270 215 T 500 210 L 500 340 L 0 340 Z" fill="url(#hillGradMid)" />
            <path d="M0 250 Q 180 215 360 255 T 500 245 L 500 340 L 0 340 Z" fill="url(#hillGradForeground)" />

            {/* Background Pine Trees */}
            {[[30, 160], [70, 150], [420, 155], [460, 165]].map(([tx, ty], i) => (
              <g key={i} transform={`translate(${tx}, ${ty})`}>
                <rect x="-4" y="24" width="8" height="18" fill="#78350F" />
                <polygon points="0,0 -16,14 16,14" fill="#15803D" />
                <polygon points="0,8 -20,24 20,24" fill="#166534" />
                <polygon points="0,16 -24,32 24,32" fill="#14532D" />
              </g>
            ))}

            {/* Wooden Trail Arch with Wood Grain details */}
            <g filter="url(#softShadow)">
              <path d="M 120 290 L 120 120 Q 250 80 380 120 L 380 290" stroke="#78350F" strokeWidth="16" fill="none" strokeLinecap="round" />
              <path d="M 120 290 L 120 120 Q 250 80 380 120 L 380 290" stroke="#B45309" strokeWidth="10" fill="none" strokeLinecap="round" />

              {/* Arch Sign: "Forest Trail" */}
              <rect x="175" y="86" width="150" height="34" rx="10" fill="url(#woodSignGrad)" stroke="#78350F" strokeWidth="3" />
              {/* Hanging chains */}
              <line x1="200" y1="86" x2="200" y2="76" stroke="#475569" strokeWidth="3" />
              <line x1="300" y1="86" x2="300" y2="76" stroke="#475569" strokeWidth="3" />
              <text x="250" y="108" fill="#FFFFFF" fontSize="13" fontWeight="900" letterSpacing="0.5" textAnchor="middle" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.5))">
                🌲 FOREST TRAIL 🌲
              </text>
            </g>

            {/* Stone paved path entering arch */}
            <path d="M 160 340 L 210 240 L 290 240 L 340 340 Z" fill="#FDE68A" stroke="#D97706" strokeWidth="2" opacity="0.8" />
            <ellipse cx="230" cy="275" rx="12" ry="5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
            <ellipse cx="270" cy="295" rx="14" ry="6" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1" />

            {/* Meadow Flowers with Bunny peeking */}
            <g transform="translate(240, 220)">
              {/* Bush Backing */}
              <circle cx="-32" cy="18" r="40" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
              <circle cx="32" cy="18" r="44" fill="#16A34A" stroke="#15803D" strokeWidth="2" />
              <circle cx="0" cy="22" r="36" fill="#4ADE80" />

              {/* BUNNY (Peeking from behind the flower bush) with crisp outline */}
              <g
                className={`cursor-pointer transition-transform duration-300 ${bunnyBounced ? '-translate-y-5 scale-105' : 'hover:-translate-y-1.5'} ${highlightBunny ? 'filter drop-shadow-[0_0_14px_rgba(251,191,36,0.95)]' : ''}`}
                onClick={handleBunnyClick}
                filter="url(#characterShadow)"
              >
                {isQuestionMode && <circle cx="0" cy="-20" r="48" fill="#FDE047" opacity="0.35" className="animate-pulse" />}

                {/* Left Ear */}
                <ellipse cx="-16" cy="-45" rx="9" ry="28" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.5" transform="rotate(-8 -16 -45)" />
                <ellipse cx="-16" cy="-45" rx="4.5" ry="19" fill="#F472B6" transform="rotate(-8 -16 -45)" />
                {/* Right Ear */}
                <ellipse cx="16" cy="-45" rx="9" ry="28" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.5" transform="rotate(8 16 -45)" />
                <ellipse cx="16" cy="-45" rx="4.5" ry="19" fill="#F472B6" transform="rotate(8 16 -45)" />

                {/* Head */}
                <circle cx="0" cy="-12" r="30" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.8" />

                {/* Eyes with highlights */}
                <circle cx="-11" cy="-15" r="4" fill="#0F172A" />
                <circle cx="-9.5" cy="-16.5" r="1.5" fill="#FFFFFF" />
                <circle cx="11" cy="-15" r="4" fill="#0F172A" />
                <circle cx="12.5" cy="-16.5" r="1.5" fill="#FFFFFF" />

                {/* Cute Nose and Mouth */}
                <polygon points="0,-7 -4,-11 4,-11" fill="#F472B6" stroke="#0F172A" strokeWidth="1" />
                <path d="M -5 -5 Q 0 -2 5 -5" stroke="#0F172A" strokeWidth="2" fill="none" strokeLinecap="round" />

                {/* Rosy Cheeks */}
                <circle cx="-20" cy="-8" r="6" fill="#FDA4AF" opacity="0.75" />
                <circle cx="20" cy="-8" r="6" fill="#FDA4AF" opacity="0.75" />

                {/* Whiskers */}
                <line x1="-22" y1="-10" x2="-34" y2="-13" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="-22" y1="-6" x2="-35" y2="-4" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="22" y1="-10" x2="34" y2="-13" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="22" y1="-6" x2="35" y2="-4" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
              </g>

              {/* Lush Detailed Flowers in foreground */}
              {/* Pink Daisy Left */}
              <circle cx="-38" cy="28" r="22" fill="#FB7185" stroke="#E11D48" strokeWidth="2" />
              <circle cx="-38" cy="28" r="8" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
              {/* Big Red Rose Center */}
              <circle cx="0" cy="36" r="26" fill="#F43F5E" stroke="#BE123C" strokeWidth="2" />
              <circle cx="0" cy="36" r="10" fill="#FEF08A" stroke="#EAB308" strokeWidth="1.5" />
              {/* Magenta Blossom Right */}
              <circle cx="38" cy="26" r="20" fill="#EC4899" stroke="#BE185D" strokeWidth="2" />
              <circle cx="38" cy="26" r="7" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
            </g>
          </g>
        )}

        {/* ============================================================== */}
        {/* 1. FOREST ENTRANCE - Page 2: Bunny runs into the forest! */}
        {/* ============================================================== */}
        {pageNumber === 2 && (
          <g id="scene-2-forest-trail">
            <rect width="500" height="340" fill="url(#skyGrad1)" />

            {/* Sunlight & clouds */}
            <circle cx="430" cy="50" r="28" fill="#FDE047" opacity="0.9" />
            <g opacity="0.85">
              <ellipse cx="120" cy="50" rx="30" ry="12" fill="#FFFFFF" />
              <ellipse cx="140" cy="45" rx="20" ry="14" fill="#FFFFFF" />
            </g>

            {/* Background trees */}
            <path d="M 0 170 Q 150 140 300 160 T 500 150 L 500 340 L 0 340 Z" fill="#6EE7B7" />
            {[[40, 130], [90, 120], [160, 135], [440, 130]].map(([tx, ty], i) => (
              <g key={i} transform={`translate(${tx}, ${ty})`}>
                <polygon points="0,0 -16,20 16,20" fill="#15803D" />
                <polygon points="0,10 -20,32 20,32" fill="#166534" />
              </g>
            ))}

            {/* Winding trail path */}
            <path d="M 0 220 Q 200 180 350 210 T 500 200 L 500 340 L 0 340 Z" fill="#34D399" />
            <path d="M 30 340 Q 200 240 450 195 L 495 225 Q 260 285 70 340 Z" fill="#FDE68A" stroke="#D97706" strokeWidth="2.5" />

            {/* Wooden directional signpost */}
            <g
              transform="translate(140, 180)"
              className="cursor-pointer hover:scale-105 transition-transform"
              filter="url(#softShadow)"
              onClick={() => {
                soundEngine.playCreakingDoor();
                setTapEffect({ text: '🪵 Sign: "Deep Forest ➡️"' });
                setTimeout(() => setTapEffect(null), 1200);
              }}
            >
              <rect x="-8" y="0" width="16" height="110" fill="url(#treeGrad)" stroke="#451A03" strokeWidth="2" rx="3" />
              {/* Arrow sign pointing Right */}
              <polygon points="-40,-35 60,-35 84,-19 60,-3 -40,-3" fill="url(#woodSignGrad)" stroke="#78350F" strokeWidth="2.5" />
              <text x="18" y="-15" fill="#FFFFFF" fontSize="11" fontWeight="900" textAnchor="middle" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.4))">
                DEEP FOREST ➔
              </text>
            </g>

            {/* BUNNY (Running fast ahead on the trail!) with crisp cartoon outline */}
            <g
              transform="translate(360, 185)"
              className={`cursor-pointer transition-transform duration-300 ${bunnyBounced ? '-translate-y-5 scale-105' : 'hover:scale-105'} ${highlightBunny ? 'filter drop-shadow-[0_0_14px_rgba(251,191,36,0.95)]' : ''}`}
              onClick={handleBunnyClick}
              filter="url(#characterShadow)"
            >
              {isQuestionMode && <circle cx="0" cy="0" r="50" fill="#FDE047" opacity="0.4" className="animate-pulse" />}

              {/* Speed dust puffs */}
              <circle cx="-35" cy="20" r="8" fill="#E2E8F0" opacity="0.85" />
              <circle cx="-48" cy="22" r="5" fill="#CBD5E1" opacity="0.7" />
              <circle cx="-28" cy="28" r="6" fill="#F1F5F9" opacity="0.8" />

              {/* Running paws */}
              <ellipse cx="24" cy="24" rx="9" ry="5" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2" transform="rotate(20 24 24)" />
              <ellipse cx="-20" cy="20" rx="9" ry="6" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2" transform="rotate(-30 -20 20)" />

              {/* Bunny body leaning forward into a run */}
              <ellipse cx="0" cy="10" rx="27" ry="19" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.6" transform="rotate(-15 0 10)" />

              {/* Fluffy tail */}
              <circle cx="-24" cy="4" r="8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />

              {/* Head turned forward */}
              <circle cx="16" cy="-4" r="23" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.6" />
              <circle cx="24" cy="-6" r="3.8" fill="#0F172A" />
              <circle cx="25.5" cy="-7.5" r="1.4" fill="#FFFFFF" />
              <polygon points="28,-2 25,-5 29,-5" fill="#F472B6" />
              <circle cx="18" cy="2" r="4.5" fill="#FDA4AF" opacity="0.75" />

              {/* Ears streaming backward in the wind */}
              <ellipse cx="-10" cy="-24" rx="23" ry="7" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.2" transform="rotate(-25 -10 -24)" />
              <ellipse cx="-10" cy="-24" rx="14" ry="3.5" fill="#F472B6" transform="rotate(-25 -10 -24)" />
              <ellipse cx="-4" cy="-34" rx="21" ry="6" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.2" transform="rotate(-18 -4 -34)" />
              <ellipse cx="-4" cy="-34" rx="13" ry="3" fill="#F472B6" transform="rotate(-18 -4 -34)" />
            </g>
          </g>
        )}

        {/* ============================================================== */}
        {/* 2. DEEP FOREST - Page 3: Bunny is behind the tree. */}
        {/* ============================================================== */}
        {pageNumber === 3 && (
          <g id="scene-3-behind-tree">
            <rect width="500" height="340" fill="url(#deepForestSky)" />

            {/* Dappled light filtering through the canopy */}
            <ellipse cx="140" cy="60" rx="40" ry="18" fill="#FEF08A" opacity="0.25" />
            <ellipse cx="380" cy="80" rx="50" ry="22" fill="#FEF08A" opacity="0.2" />

            {/* Forest Ground */}
            <path d="M0 240 Q 250 180, 500 240 L 500 340 L 0 340 Z" fill="#15803D" />
            {/* Moss and grass tufts */}
            <path d="M 60 270 Q 75 250 90 270 Q 105 250 120 270" stroke="#4ADE80" strokeWidth="3" fill="none" />
            <path d="M 380 290 Q 395 270 410 290 Q 425 270 440 290" stroke="#4ADE80" strokeWidth="3" fill="none" />

            {/* BUNNY (Peeking out from BEHIND giant oak tree) */}
            <g
              transform="translate(325, 175)"
              className={`cursor-pointer transition-transform duration-300 ${bunnyBounced ? 'translate-x-4 scale-105' : 'hover:translate-x-2'} ${highlightBunny ? 'filter drop-shadow-[0_0_14px_rgba(251,191,36,0.95)]' : ''}`}
              onClick={handleBunnyClick}
              filter="url(#characterShadow)"
            >
              {isQuestionMode && <circle cx="16" cy="10" r="46" fill="#FDE047" opacity="0.4" className="animate-pulse" />}

              {/* Ears popping out */}
              <ellipse cx="28" cy="-28" rx="8" ry="25" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.5" transform="rotate(25 28 -28)" />
              <ellipse cx="28" cy="-28" rx="4" ry="17" fill="#F472B6" transform="rotate(25 28 -28)" />

              {/* Head peeking */}
              <circle cx="18" cy="10" r="27" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.8" />
              <circle cx="26" cy="8" r="3.8" fill="#0F172A" />
              <circle cx="27.5" cy="6.5" r="1.4" fill="#FFFFFF" />
              <polygon points="26,16 23,13 29,13" fill="#F472B6" stroke="#0F172A" strokeWidth="1" />
              <circle cx="22" cy="18" r="5" fill="#FDA4AF" opacity="0.75" />

              {/* Peeking paw on trunk */}
              <ellipse cx="6" cy="28" rx="9" ry="6" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2" />
            </g>

            {/* Giant Oak Tree in foreground with textured bark and canopy */}
            <g filter="url(#softShadow)">
              <path d="M 230 110 L 215 320 Q 260 335 315 320 L 295 110 Z" fill="url(#treeGrad)" stroke="#451A03" strokeWidth="3" />
              {/* Bark ridges */}
              <path d="M 245 130 Q 255 210 248 300" stroke="#451A03" strokeWidth="2.5" fill="none" opacity="0.6" />
              <path d="M 275 125 Q 265 210 275 305" stroke="#451A03" strokeWidth="2.5" fill="none" opacity="0.6" />

              {/* Tree Canopy Clusters */}
              <circle cx="260" cy="75" r="90" fill="#166534" stroke="#0F172A" strokeWidth="2" />
              <circle cx="190" cy="95" r="75" fill="#15803D" stroke="#0F172A" strokeWidth="2" />
              <circle cx="330" cy="90" r="80" fill="#22C55E" stroke="#0F172A" strokeWidth="2" />
              <circle cx="260" cy="65" r="70" fill="#4ADE80" opacity="0.4" />
            </g>

            {/* Squirrel on branch with bold cartoon outline */}
            <g
              transform="translate(145, 125)"
              className="cursor-pointer hover:scale-110 transition-transform"
              filter="url(#characterShadow)"
              onClick={(e) => handleAnimalClick(e, 'squirrel', '🐿️ Squeak-chatter!')}
            >
              {/* Branch */}
              <path d="M -20 25 L 30 15" stroke="#78350F" strokeWidth="8" strokeLinecap="round" />

              {/* Bushy Tail with black outline */}
              <path
                d="M 12 10 Q 38 -12 28 -34 Q 16 -48 -6 -36 Q -12 -24 6 -8 Z"
                fill="#EA580C"
                stroke="#0F172A"
                strokeWidth="2.2"
              />
              <path d="M 10 4 Q 28 -14 20 -30" stroke="#FDBA74" strokeWidth="2" fill="none" />

              {/* Body */}
              <ellipse cx="-8" cy="10" rx="14" ry="17" fill="#F59E0B" stroke="#0F172A" strokeWidth="2.2" />
              <ellipse cx="-6" cy="12" rx="8" ry="11" fill="#FEF3C7" />

              {/* Head */}
              <circle cx="-16" cy="-4" r="13" fill="#F59E0B" stroke="#0F172A" strokeWidth="2.2" />
              {/* Little Ears */}
              <polygon points="-22,-14 -16,-22 -12,-14" fill="#D97706" stroke="#0F172A" strokeWidth="1.8" />
              {/* Eye */}
              <circle cx="-19" cy="-6" r="3" fill="#0F172A" />
              <circle cx="-18.2" cy="-7" r="1.1" fill="#FFFFFF" />
              {/* Nose */}
              <circle cx="-27" cy="-2" r="2" fill="#0F172A" />
              {/* Acorn in paws */}
              <ellipse cx="-20" cy="14" rx="5" ry="6" fill="#92400E" stroke="#0F172A" strokeWidth="1.5" />
            </g>
          </g>
        )}

        {/* ============================================================== */}
        {/* 2. DEEP FOREST - Page 4: Bunny is across the river. */}
        {/* ============================================================== */}
        {pageNumber === 4 && (
          <g id="scene-4-across-river">
            <rect width="500" height="340" fill="url(#deepForestSky)" />

            {/* Distant River Valley Hills */}
            <path d="M 0 140 Q 150 110 320 135 T 500 120 L 500 340 L 0 340 Z" fill="#6EE7B7" />

            {/* Far River Bank */}
            <path d="M 310 150 Q 410 135 500 160 L 500 340 L 330 340 Z" fill="#22C55E" />

            {/* River Stream with Ripples */}
            <path d="M 110 170 Q 230 220 380 170 L 460 340 L 130 340 Z" fill="url(#waterGrad)" />
            {/* Water ripples */}
            <path d="M 180 230 Q 220 220 260 230" stroke="#BAE6FD" strokeWidth="2.5" fill="none" opacity="0.8" strokeLinecap="round" />
            <path d="M 240 280 Q 290 270 340 280" stroke="#BAE6FD" strokeWidth="2.5" fill="none" opacity="0.8" strokeLinecap="round" />
            <path d="M 300 210 Q 330 205 360 210" stroke="#BAE6FD" strokeWidth="2" fill="none" opacity="0.8" strokeLinecap="round" />

            {/* Stepping Stones in water */}
            <g filter="url(#softShadow)">
              <ellipse cx="230" cy="270" rx="30" ry="16" fill="#64748B" stroke="#334155" strokeWidth="2" />
              <ellipse cx="225" cy="266" rx="22" ry="11" fill="#94A3B8" />
              <ellipse cx="295" cy="245" rx="32" ry="17" fill="#475569" stroke="#1E293B" strokeWidth="2" />
              <ellipse cx="290" cy="241" rx="24" ry="12" fill="#64748B" />
            </g>

            {/* Near river bank (Foreground) */}
            <path d="M 0 260 Q 110 240 190 280 L 190 340 L 0 340 Z" fill="#16A34A" />

            {/* Bluebird (파랑새) perched on riverside flowering branch with clean black outline */}
            <g
              transform="translate(70, 115)"
              className="cursor-pointer hover:scale-110 transition-transform"
              filter="url(#characterShadow)"
              onClick={(e) => handleAnimalClick(e, 'bird', '💙 Bluebird: "Tweet-twoo! Across the river!"')}
            >
              {/* Wooden tree branch */}
              <path d="M -50 20 Q 0 14 45 22" stroke="#78350F" strokeWidth="7" strokeLinecap="round" fill="none" />
              <circle cx="15" cy="16" r="5" fill="#86EFAC" stroke="#15803D" strokeWidth="1" />
              <circle cx="30" cy="18" r="4" fill="#86EFAC" stroke="#15803D" strokeWidth="1" />
              <circle cx="-10" cy="16" r="3" fill="#FDE047" />

              {/* Bluebird tail */}
              <path d="M -12 14 L -24 19 Q -20 14 -14 11 Z" fill="#0369A1" stroke="#0F172A" strokeWidth="1.8" />

              {/* Bluebird Body (Sky Blue) with distinct black outline */}
              <ellipse cx="2" cy="7" rx="17" ry="14" fill="#0284C7" stroke="#0F172A" strokeWidth="2.2" />

              {/* Soft light cyan belly */}
              <path d="M -4 5 Q 10 5 12 13 Q 5 19 -4 17 Z" fill="#BAE6FD" opacity="0.9" />

              {/* Royal Blue Wing with outline */}
              <path d="M -9 5 Q -1 3 5 11 Q -3 18 -11 11 Z" fill="#0369A1" stroke="#0F172A" strokeWidth="1.8" />

              {/* Bluebird Head with outline */}
              <circle cx="11" cy="-3" r="12" fill="#0284C7" stroke="#0F172A" strokeWidth="2.2" />
              <path d="M 9 -13 Q 13 -16 15 -11 Q 11 -9 9 -13 Z" fill="#0369A1" stroke="#0F172A" strokeWidth="1.5" />

              {/* Big sparkly eye with highlight */}
              <circle cx="14" cy="-5" r="3.2" fill="#0F172A" />
              <circle cx="15.2" cy="-6.2" r="1.2" fill="#FFFFFF" />

              {/* Bright yellow beak with outline */}
              <polygon points="20,-4 28,-1 20,2" fill="#FACC15" stroke="#0F172A" strokeWidth="1.5" strokeLinejoin="round" />

              {/* Orange feet grasping branch */}
              <line x1="-2" y1="18" x2="-2" y2="23" stroke="#0F172A" strokeWidth="2.6" strokeLinecap="round" />
              <line x1="4" y1="18" x2="4" y2="23" stroke="#0F172A" strokeWidth="2.6" strokeLinecap="round" />

              {/* Music notes */}
              <text x="24" y="-14" fill="#0284C7" fontSize="14" fontWeight="bold">♪</text>
            </g>

            {/* Frog on Near Bank with black outline */}
            <g
              transform="translate(90, 275)"
              className="cursor-pointer hover:scale-110 transition-transform"
              filter="url(#characterShadow)"
              onClick={(e) => handleAnimalClick(e, 'frog', '🐸 Ribbit-ribbit!')}
            >
              <ellipse cx="0" cy="0" rx="17" ry="13" fill="#22C55E" stroke="#0F172A" strokeWidth="2" />
              <ellipse cx="0" cy="2" rx="10" ry="7" fill="#86EFAC" />
              {/* Frog Eyes */}
              <circle cx="-6" cy="-9" r="6" fill="#22C55E" stroke="#0F172A" strokeWidth="2" />
              <circle cx="-6" cy="-9" r="3.2" fill="#0F172A" />
              <circle cx="-5" cy="-10.5" r="1" fill="#FFFFFF" />
              <circle cx="6" cy="-9" r="6" fill="#22C55E" stroke="#0F172A" strokeWidth="2" />
              <circle cx="6" cy="-9" r="3.2" fill="#0F172A" />
              <circle cx="7" cy="-10.5" r="1" fill="#FFFFFF" />
              {/* Smile */}
              <path d="M -6 1 Q 0 5 6 1" stroke="#0F172A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </g>

            {/* BUNNY (Sitting proudly ACROSS on the far rock bank!) */}
            <g
              transform="translate(420, 210)"
              className={`cursor-pointer transition-transform duration-300 ${bunnyBounced ? '-translate-y-5' : 'hover:-translate-y-1.5'} ${highlightBunny ? 'filter drop-shadow-[0_0_14px_rgba(251,191,36,0.95)]' : ''}`}
              onClick={handleBunnyClick}
              filter="url(#characterShadow)"
            >
              {isQuestionMode && <circle cx="0" cy="-5" r="48" fill="#FDE047" opacity="0.4" className="animate-pulse" />}

              {/* Rock under Bunny */}
              <ellipse cx="0" cy="30" rx="42" ry="19" fill="#475569" stroke="#1E293B" strokeWidth="2" />
              <ellipse cx="-8" cy="26" rx="26" ry="10" fill="#64748B" />

              {/* Body with black outline */}
              <ellipse cx="0" cy="10" rx="21" ry="23" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.6" />

              {/* Ears */}
              <ellipse cx="-8" cy="-35" rx="7.5" ry="25" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.2" transform="rotate(-6 -8 -35)" />
              <ellipse cx="-8" cy="-35" rx="3.5" ry="17" fill="#F472B6" transform="rotate(-6 -8 -35)" />
              <ellipse cx="8" cy="-35" rx="7.5" ry="25" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.2" transform="rotate(6 8 -35)" />
              <ellipse cx="8" cy="-35" rx="3.5" ry="17" fill="#F472B6" transform="rotate(6 8 -35)" />

              {/* Head with black outline */}
              <circle cx="0" cy="-12" r="21" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.6" />
              <circle cx="-6" cy="-14" r="3.2" fill="#0F172A" />
              <circle cx="-5" cy="-15.5" r="1.1" fill="#FFFFFF" />
              <circle cx="6" cy="-14" r="3.2" fill="#0F172A" />
              <circle cx="7" cy="-15.5" r="1.1" fill="#FFFFFF" />
              <polygon points="0,-9 -3,-12 3,-12" fill="#F472B6" />
              <circle cx="-13" cy="-10" r="4.5" fill="#FDA4AF" opacity="0.75" />
              <circle cx="13" cy="-10" r="4.5" fill="#FDA4AF" opacity="0.75" />
            </g>
          </g>
        )}

        {/* ============================================================== */}
        {/* 3. OUTSIDE CABIN - Page 5: Bunny is by the fence. */}
        {/* ============================================================== */}
        {pageNumber === 5 && (
          <g id="scene-5-by-fence">
            <rect width="500" height="340" fill="url(#cabinSky)" />
            <path d="M0 200 Q 250 170 500 200 L 500 340 L 0 340 Z" fill="#86EFAC" />

            {/* Cozy Woodland Cabin in background */}
            <g transform="translate(320, 105)" filter="url(#softShadow)">
              {/* Stone Chimney with smoke */}
              <rect x="70" y="-30" width="24" height="60" fill="#78716C" stroke="#44403C" strokeWidth="2" />
              <circle cx="82" cy="-45" r="10" fill="#E2E8F0" opacity="0.7" />
              <circle cx="90" cy="-65" r="14" fill="#E2E8F0" opacity="0.5" />
              {/* Log Walls */}
              <rect x="-40" y="20" width="140" height="90" fill="#B45309" stroke="#78350F" strokeWidth="3" />
              {/* Roof */}
              <polygon points="-60,20 30,-35 120,20" fill="#991B1B" stroke="#7F1D1D" strokeWidth="3" />
              {/* Window */}
              <rect x="10" y="45" width="30" height="30" fill="#FEF08A" stroke="#451A03" strokeWidth="3" />
              <line x1="25" y1="45" x2="25" y2="75" stroke="#451A03" strokeWidth="2" />
              <line x1="10" y1="60" x2="40" y2="60" stroke="#451A03" strokeWidth="2" />
            </g>

            {/* Warm Wooden & White Picket Fence in Foreground with crisp outlines */}
            <g transform="translate(0, 215)" filter="url(#softShadow)">
              {/* Wooden Rails */}
              <rect x="0" y="26" width="300" height="8" rx="2" fill="#B45309" stroke="#78350F" strokeWidth="2" />
              <rect x="0" y="52" width="300" height="8" rx="2" fill="#B45309" stroke="#78350F" strokeWidth="2" />
              {/* White Pickets with brown outlines */}
              {[25, 65, 105, 145, 185, 225, 265].map((x) => (
                <g key={x}>
                  <polygon points={`${x - 9},12 ${x},2 ${x + 9},12 ${x + 9},82 ${x - 9},82`} fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
                  <line x1={x - 4} y1="14" x2={x - 4} y2="78" stroke="#E2E8F0" strokeWidth="1.5" />
                </g>
              ))}
              {/* Little flowers along fence */}
              <circle cx="45" cy="80" r="5" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
              <circle cx="125" cy="80" r="5" fill="#FB7185" stroke="#E11D48" strokeWidth="1" />
              <circle cx="205" cy="80" r="5" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
            </g>

            {/* BUNNY (Running right BY the fence!) with black outline */}
            <g
              transform="translate(170, 230)"
              className={`cursor-pointer transition-transform duration-300 ${bunnyBounced ? '-translate-y-5' : 'hover:scale-105'} ${highlightBunny ? 'filter drop-shadow-[0_0_14px_rgba(251,191,36,0.95)]' : ''}`}
              onClick={handleBunnyClick}
              filter="url(#characterShadow)"
            >
              {isQuestionMode && <circle cx="0" cy="0" r="46" fill="#FDE047" opacity="0.4" className="animate-pulse" />}

              <ellipse cx="0" cy="12" rx="21" ry="17" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.5" />
              <ellipse cx="-8" cy="-30" rx="6.5" ry="23" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.2" transform="rotate(-10 -8 -30)" />
              <ellipse cx="-8" cy="-30" rx="3.5" ry="16" fill="#F472B6" transform="rotate(-10 -8 -30)" />
              <ellipse cx="8" cy="-30" rx="6.5" ry="23" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.2" transform="rotate(10 8 -30)" />
              <ellipse cx="8" cy="-30" rx="3.5" ry="16" fill="#F472B6" transform="rotate(10 8 -30)" />

              <circle cx="0" cy="-8" r="19" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.6" />
              <circle cx="-5" cy="-10" r="2.8" fill="#0F172A" />
              <circle cx="-4" cy="-11.2" r="1" fill="#FFFFFF" />
              <circle cx="5" cy="-10" r="2.8" fill="#0F172A" />
              <circle cx="6" cy="-11.2" r="1" fill="#FFFFFF" />
              <polygon points="0,-6 -2,-9 2,-9" fill="#F472B6" />
              <circle cx="-11" cy="-7" r="4.5" fill="#FDA4AF" opacity="0.75" />
              <circle cx="11" cy="-7" r="4.5" fill="#FDA4AF" opacity="0.75" />
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
            <g transform="translate(180, 110)" filter="url(#softShadow)">
              {/* Cabin Door */}
              <rect x="60" y="30" width="60" height="100" fill="#92400E" stroke="#451A03" strokeWidth="3" />
              <circle cx="110" cy="80" r="4" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
              {/* Porch roof beam */}
              <rect x="-10" y="20" width="160" height="15" fill="#78350F" stroke="#451A03" strokeWidth="2" />
              {/* Wooden Steps */}
              <rect x="10" y="130" width="140" height="18" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
              <rect x="0" y="148" width="160" height="20" fill="#92400E" stroke="#78350F" strokeWidth="2.5" />
              <rect x="-10" y="168" width="180" height="22" fill="#78350F" stroke="#451A03" strokeWidth="2.5" />
            </g>

            {/* Shaded space UNDER the porch */}
            <rect x="170" y="240" width="180" height="60" fill="#451A03" opacity="0.7" rx="6" />

            {/* BUNNY (Sheltered UNDER the porch steps!) with black outline */}
            <g
              transform="translate(250, 255)"
              className={`cursor-pointer transition-transform duration-300 ${bunnyBounced ? '-translate-y-4' : 'hover:-translate-y-1.5'} ${highlightBunny ? 'filter drop-shadow-[0_0_14px_rgba(251,191,36,0.95)]' : ''}`}
              onClick={handleBunnyClick}
              filter="url(#characterShadow)"
            >
              {isQuestionMode && <circle cx="0" cy="5" r="46" fill="#FDE047" opacity="0.4" className="animate-pulse" />}

              <ellipse cx="0" cy="14" rx="21" ry="19" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.6" />
              {/* Tilted ears under steps */}
              <ellipse cx="-10" cy="-22" rx="7.5" ry="19" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.2" transform="rotate(-20 -10 -22)" />
              <ellipse cx="-10" cy="-22" rx="4" ry="13" fill="#F472B6" transform="rotate(-20 -10 -22)" />
              <ellipse cx="10" cy="-22" rx="7.5" ry="19" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.2" transform="rotate(15 10 -22)" />
              <ellipse cx="10" cy="-22" rx="4" ry="13" fill="#F472B6" transform="rotate(15 10 -22)" />

              <circle cx="0" cy="-4" r="19" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.6" />
              <circle cx="-6" cy="-6" r="3.2" fill="#0F172A" />
              <circle cx="-5" cy="-7.5" r="1.1" fill="#FFFFFF" />
              <circle cx="6" cy="-6" r="3.2" fill="#0F172A" />
              <circle cx="7" cy="-7.5" r="1.1" fill="#FFFFFF" />
              <polygon points="0,-2 -3,-5 3,-5" fill="#F472B6" />
              <circle cx="-12" cy="-3" r="4.5" fill="#FDA4AF" opacity="0.75" />
              <circle cx="12" cy="-3" r="4.5" fill="#FDA4AF" opacity="0.75" />
            </g>
          </g>
        )}

        {/* ============================================================== */}
        {/* 4. INSIDE CABIN - Page 7: Bunny is in the basket. */}
        {/* ============================================================== */}
        {pageNumber === 7 && (
          <g id="scene-7-in-basket">
            <rect width="500" height="340" fill="#FEF3C7" />

            {/* Wallpaper stripes */}
            {[50, 100, 150, 200, 250, 300, 350, 400, 450].map((x) => (
              <line key={x} x1={x} y1="0" x2={x} y2="200" stroke="#FDE68A" strokeWidth="2" strokeDasharray="4 8" opacity="0.5" />
            ))}

            {/* Wooden Floor Planks */}
            <path d="M 0 200 L 500 200 L 500 340 L 0 340 Z" fill="#FED7AA" />
            <line x1="0" y1="240" x2="500" y2="240" stroke="#FDBA74" strokeWidth="2.5" />
            <line x1="0" y1="280" x2="500" y2="280" stroke="#FDBA74" strokeWidth="2.5" />

            {/* Fireplace Hearth Left */}
            <g transform="translate(80, 140)" filter="url(#softShadow)">
              <rect x="-40" y="-10" width="80" height="90" fill="#78716C" stroke="#44403C" strokeWidth="2.5" rx="4" />
              <rect x="-25" y="15" width="50" height="65" fill="#1C1917" rx="4" />
              {/* Flames */}
              <polygon points="-12,70 0,35 12,70" fill="#EA580C" />
              <polygon points="-6,70 0,45 6,70" fill="#FACC15" />
            </g>

            {/* Sleeping Cat on Rug with bold cartoon outline */}
            <g
              transform="translate(390, 260)"
              className="cursor-pointer hover:scale-105 transition-transform"
              filter="url(#characterShadow)"
              onClick={(e) => handleAnimalClick(e, 'cat', '🐱 Purr... Meow!')}
            >
              {/* Round rug */}
              <ellipse cx="0" cy="10" rx="45" ry="24" fill="#E0E7FF" stroke="#A5B4FC" strokeWidth="2" />

              {/* Cat Body */}
              <ellipse cx="0" cy="0" rx="30" ry="20" fill="#FB923C" stroke="#0F172A" strokeWidth="2.2" />
              <path d="M -12 -6 Q 0 -12 12 -6" stroke="#C2410C" strokeWidth="2" fill="none" />

              {/* Cat Head */}
              <circle cx="-16" cy="-8" r="15" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.2" />
              {/* Cat Ears */}
              <polygon points="-26,-20 -20,-26 -16,-18" fill="#FB923C" stroke="#0F172A" strokeWidth="1.8" />
              <polygon points="-14,-20 -8,-26 -4,-18" fill="#FB923C" stroke="#0F172A" strokeWidth="1.8" />
              {/* Sleeping eye lines */}
              <path d="M -22 -8 Q -16 -4 -10 -8" stroke="#0F172A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
              <polygon points="-16,-4 -18,-6 -14,-6" fill="#F472B6" />
            </g>

            {/* Woven Blanket Basket */}
            <g transform="translate(240, 210)" filter="url(#softShadow)">
              {/* Back of basket */}
              <ellipse cx="0" cy="0" rx="55" ry="24" fill="#92400E" stroke="#451A03" strokeWidth="2" />

              {/* Soft blanket inside */}
              <ellipse cx="0" cy="6" rx="48" ry="18" fill="#BAE6FD" />

              {/* BUNNY (Popping out of basket!) with bold black outline */}
              <g
                className={`cursor-pointer transition-transform duration-300 ${bunnyBounced ? '-translate-y-6' : 'hover:-translate-y-2'} ${highlightBunny ? 'filter drop-shadow-[0_0_14px_rgba(251,191,36,0.95)]' : ''}`}
                onClick={handleBunnyClick}
                filter="url(#characterShadow)"
              >
                {isQuestionMode && <circle cx="0" cy="-15" r="48" fill="#FDE047" opacity="0.4" className="animate-pulse" />}

                <ellipse cx="-12" cy="-50" rx="8.5" ry="27" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.5" transform="rotate(-6 -12 -50)" />
                <ellipse cx="-12" cy="-50" rx="4" ry="19" fill="#F472B6" transform="rotate(-6 -12 -50)" />
                <ellipse cx="12" cy="-50" rx="8.5" ry="27" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.5" transform="rotate(6 12 -50)" />
                <ellipse cx="12" cy="-50" rx="4" ry="19" fill="#F472B6" transform="rotate(6 12 -50)" />

                <circle cx="0" cy="-18" r="27" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.8" />
                <circle cx="-9" cy="-20" r="3.8" fill="#0F172A" />
                <circle cx="-8" cy="-21.5" r="1.3" fill="#FFFFFF" />
                <circle cx="9" cy="-20" r="3.8" fill="#0F172A" />
                <circle cx="10" cy="-21.5" r="1.3" fill="#FFFFFF" />

                <polygon points="0,-14 -3,-18 3,-18" fill="#F472B6" stroke="#0F172A" strokeWidth="1" />
                <path d="M -5 -10 Q 0 -6 5 -10" stroke="#0F172A" strokeWidth="2" fill="none" strokeLinecap="round" />
                <circle cx="-16" cy="-14" r="5" fill="#FDA4AF" opacity="0.75" />
                <circle cx="16" cy="-14" r="5" fill="#FDA4AF" opacity="0.75" />

                {/* Paws grasping basket rim */}
                <ellipse cx="-18" cy="8" rx="9" ry="6" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.2" />
                <ellipse cx="18" cy="8" rx="9" ry="6" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.2" />
              </g>

              {/* Front of wicker basket with texture */}
              <path d="M -55 0 Q 0 45 55 0 L 45 65 Q 0 85 -45 65 Z" fill="#D97706" stroke="#78350F" strokeWidth="3" />
              <path d="M -45 25 Q 0 50 45 25" stroke="#B45309" strokeWidth="3" fill="none" strokeDasharray="6 4" />
              <path d="M -38 45 Q 0 70 38 45" stroke="#B45309" strokeWidth="3" fill="none" strokeDasharray="6 4" />
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
            <g transform="translate(250, 180)" filter="url(#softShadow)">
              {/* Wooden Headboard */}
              <rect x="-130" y="-70" width="260" height="80" rx="10" fill="#92400E" stroke="#451A03" strokeWidth="3" />
              {/* Pillows */}
              <ellipse cx="-60" cy="-20" rx="35" ry="18" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
              <ellipse cx="60" cy="-20" rx="35" ry="18" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
              {/* Colorful Patchwork Quilt Blanket */}
              <rect x="-120" y="0" width="240" height="110" rx="16" fill="#F472B6" stroke="#DB2777" strokeWidth="3" />
              <rect x="-100" y="20" width="50" height="40" fill="#FDE047" opacity="0.85" rx="6" stroke="#EAB308" strokeWidth="1" />
              <rect x="-40" y="20" width="50" height="40" fill="#67E8F9" opacity="0.85" rx="6" stroke="#0891B2" strokeWidth="1" />
              <rect x="20" y="20" width="50" height="40" fill="#A7F3D0" opacity="0.85" rx="6" stroke="#059669" strokeWidth="1" />
            </g>

            {/* Nightstand Lamp */}
            <g transform="translate(60, 160)" filter="url(#softShadow)">
              <rect x="-15" y="40" width="30" height="50" fill="#B45309" stroke="#451A03" strokeWidth="2" />
              <polygon points="-25,40 25,40 15,0 -15,0" fill="#FEF08A" stroke="#EAB308" strokeWidth="2" />
              <circle cx="0" cy="20" r="14" fill="#FDE047" opacity="0.4" className="animate-pulse" />
            </g>

            {/* Bear & Friends celebrating around bed with bold outline */}
            <g
              transform="translate(100, 230)"
              className="cursor-pointer hover:scale-105 transition-transform"
              filter="url(#characterShadow)"
              onClick={(e) => handleAnimalClick(e, 'bear', '🐻 Bear: "We found you!"')}
            >
              {/* Bear Body */}
              <ellipse cx="0" cy="20" rx="38" ry="36" fill="#78350F" stroke="#0F172A" strokeWidth="2.8" />
              {/* Bear Head */}
              <circle cx="0" cy="-14" r="27" fill="#78350F" stroke="#0F172A" strokeWidth="2.8" />
              {/* Round Ears */}
              <circle cx="-22" cy="-32" r="10" fill="#78350F" stroke="#0F172A" strokeWidth="2.2" />
              <circle cx="-22" cy="-32" r="5" fill="#B45309" />
              <circle cx="22" cy="-32" r="10" fill="#78350F" stroke="#0F172A" strokeWidth="2.2" />
              <circle cx="22" cy="-32" r="5" fill="#B45309" />
              {/* Snout */}
              <ellipse cx="0" cy="-8" rx="13" ry="9" fill="#FDE68A" stroke="#0F172A" strokeWidth="2" />
              <polygon points="0,-12 -4,-7 4,-7" fill="#0F172A" />
              {/* Eyes */}
              <circle cx="-9" cy="-18" r="3" fill="#0F172A" />
              <circle cx="-8" cy="-19" r="1" fill="#FFFFFF" />
              <circle cx="9" cy="-18" r="3" fill="#0F172A" />
              <circle cx="10" cy="-19" r="1" fill="#FFFFFF" />
            </g>

            {/* FINAL CAUGHT BUNNY (Jumping joyfully with heart sparkles!) with bold outlines */}
            <g
              transform="translate(250, 170)"
              className={`cursor-pointer transition-transform duration-300 ${bunnyBounced ? '-translate-y-8 scale-110' : 'animate-bounce'} ${highlightBunny ? 'filter drop-shadow-[0_0_14px_rgba(251,191,36,0.95)]' : ''}`}
              onClick={handleBunnyClick}
              filter="url(#characterShadow)"
            >
              {isQuestionMode && <circle cx="0" cy="-10" r="54" fill="#FDE047" opacity="0.4" className="animate-pulse" />}

              {/* Big Celebration Heart */}
              <text x="32" y="-35" fontSize="28" className="animate-ping select-none">💖</text>

              {/* Ears spread wide in happiness */}
              <ellipse cx="-18" cy="-50" rx="7.5" ry="27" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.5" transform="rotate(-20 -18 -50)" />
              <ellipse cx="-18" cy="-50" rx="3.5" ry="19" fill="#F472B6" transform="rotate(-20 -18 -50)" />
              <ellipse cx="18" cy="-50" rx="7.5" ry="27" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.5" transform="rotate(20 18 -50)" />
              <ellipse cx="18" cy="-50" rx="3.5" ry="19" fill="#F472B6" transform="rotate(20 18 -50)" />

              {/* Body */}
              <ellipse cx="0" cy="15" rx="23" ry="25" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.8" />

              {/* Raised Paws */}
              <ellipse cx="-20" cy="-5" rx="9" ry="7" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.2" transform="rotate(-30 -20 -5)" />
              <ellipse cx="20" cy="-5" rx="9" ry="7" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.2" transform="rotate(30 20 -5)" />

              {/* Head */}
              <circle cx="0" cy="-14" r="27" fill="#FFFBEB" stroke="#0F172A" strokeWidth="2.8" />

              {/* Big Smiling Eyes & Rosy Cheeks */}
              <path d="M -14 -16 Q -8 -22 -2 -16" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 2 -16 Q 8 -22 14 -16" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round" />
              <circle cx="-16" cy="-8" r="6" fill="#FDA4AF" opacity="0.85" />
              <circle cx="16" cy="-8" r="6" fill="#FDA4AF" opacity="0.85" />
              <path d="M -8 -8 Q 0 4 8 -8 Z" fill="#F43F5E" stroke="#0F172A" strokeWidth="1.5" />
              <polygon points="0,-11 -3,-14 3,-14" fill="#F472B6" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
