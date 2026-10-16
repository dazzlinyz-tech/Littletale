import React, { useState } from 'react';
import { soundEngine } from '../utils/audio';
import { Sparkles } from 'lucide-react';
import { STORY_IMAGES } from '../assets/storyImages';
import { StorybookImage } from './StorybookImage';

interface StoryIllustrationProps {
  pageNumber: number;
  onBunnyTapped?: () => void;
  isQuestionMode?: boolean;
  highlightBunny?: boolean;
}

export const STORY_SCENE_IMAGES: Record<number, {
  src: string;
  alt: string;
  title: string;
  bunnyLocation: { left: string; top: string; width: string; height: string };
  interactiveSpots: {
    name: string;
    soundType: string;
    dialogue: string;
    rect: { left: string; top: string; width: string; height: string };
  }[];
}> = {
  1: {
    src: STORY_IMAGES[1],
    alt: 'Forest Trail Entrance with little Bunny hiding in the daisies',
    title: 'Stage 1 • Forest Entrance',
    bunnyLocation: { left: '26%', top: '32%', width: '28%', height: '52%' },
    interactiveSpots: [
      {
        name: 'Bluebird',
        soundType: 'bird',
        dialogue: '💙 Bluebird: "Tweet-tweet! Welcome to our forest trail!"',
        rect: { left: '80%', top: '10%', width: '14%', height: '18%' },
      },
      {
        name: 'Forest Trail Sign',
        soundType: 'pop',
        dialogue: '🌲 Trail Sign: "Follow Bunny into the magic woods!"',
        rect: { left: '62%', top: '26%', width: '26%', height: '14%' },
      },
    ],
  },
  2: {
    src: STORY_IMAGES[2],
    alt: 'Bunny running along the forest trail past the waving bear',
    title: 'Stage 1 • Forest Trail',
    bunnyLocation: { left: '56%', top: '26%', width: '36%', height: '62%' },
    interactiveSpots: [
      {
        name: 'Friendly Bear',
        soundType: 'bear',
        dialogue: '🐻 Bear: "Roar! Have fun on the woodland trail!"',
        rect: { left: '24%', top: '22%', width: '18%', height: '34%' },
      },
      {
        name: 'Wooden Signpost',
        soundType: 'pop',
        dialogue: '🪵 Signpost: "Deep Forest this way! ➔"',
        rect: { left: '8%', top: '46%', width: '22%', height: '40%' },
      },
    ],
  },
  3: {
    src: STORY_IMAGES[3],
    alt: 'Bunny peeking from behind the ancient mossy oak tree',
    title: 'Stage 2 • Ancient Oak Tree',
    bunnyLocation: { left: '33%', top: '35%', width: '24%', height: '44%' },
    interactiveSpots: [
      {
        name: 'Little Squirrel',
        soundType: 'squirrel',
        dialogue: '🐿️ Squirrel: "Chitter-chatter! Look at my crunchy acorn!"',
        rect: { left: '61%', top: '48%', width: '24%', height: '32%' },
      },
      {
        name: 'Ancient Oak',
        soundType: 'rustling_leaves',
        dialogue: '🌳 Giant Oak: "Rustle rustle... Welcome to deep forest!"',
        rect: { left: '6%', top: '15%', width: '32%', height: '70%' },
      },
    ],
  },
  4: {
    src: STORY_IMAGES[4],
    alt: 'Bunny across the river by the stepping stones with a mallard duck',
    title: 'Stage 2 • Sparkling River',
    bunnyLocation: { left: '61%', top: '14%', width: '24%', height: '50%' },
    interactiveSpots: [
      {
        name: 'Mallard Duck',
        soundType: 'duck',
        dialogue: '🦆 Duck: "Quack-quack! Cool water feels so nice!"',
        rect: { left: '16%', top: '63%', width: '26%', height: '22%' },
      },
      {
        name: 'Singing Bluebird',
        soundType: 'bird',
        dialogue: '💙 Bluebird: "Tweet! Bunny made it across safely!"',
        rect: { left: '14%', top: '50%', width: '14%', height: '18%' },
      },
    ],
  },
  5: {
    src: STORY_IMAGES[5],
    alt: 'Bunny running along the country cabin fence beside a playful puppy',
    title: 'Stage 3 • Cabin Yard Fence',
    bunnyLocation: { left: '31%', top: '40%', width: '22%', height: '38%' },
    interactiveSpots: [
      {
        name: 'Playful Puppy',
        soundType: 'dog',
        dialogue: '🐶 Puppy: "Woof-woof! Come play in our cabin yard!"',
        rect: { left: '67%', top: '58%', width: '22%', height: '30%' },
      },
      {
        name: 'Country Cabin',
        soundType: 'creaking_door',
        dialogue: '🏡 Log Cabin: "A cozy warm home in the countryside!"',
        rect: { left: '18%', top: '16%', width: '34%', height: '30%' },
      },
    ],
  },
  6: {
    src: STORY_IMAGES[6],
    alt: 'Bunny hiding under the wooden cabin porch with a friendly green frog',
    title: 'Stage 3 • Under the Porch',
    bunnyLocation: { left: '25%', top: '58%', width: '24%', height: '36%' },
    interactiveSpots: [
      {
        name: 'Green Frog',
        soundType: 'frog',
        dialogue: '🐸 Frog: "Ribbit-ribbit! It\'s cool and shady down here!"',
        rect: { left: '73%', top: '66%', width: '20%', height: '24%' },
      },
      {
        name: 'Wooden Porch Steps',
        soundType: 'pop',
        dialogue: '🪜 Porch Steps: "Bunny slipped right underneath!"',
        rect: { left: '42%', top: '40%', width: '34%', height: '48%' },
      },
    ],
  },
  7: {
    src: STORY_IMAGES[7],
    alt: 'Bunny snug in the cozy woven blanket basket by the warm fireplace',
    title: 'Stage 4 • Cozy Room Basket',
    bunnyLocation: { left: '34%', top: '22%', width: '30%', height: '48%' },
    interactiveSpots: [
      {
        name: 'Sleeping Calico Cat',
        soundType: 'cat',
        dialogue: '🐱 Cat: "Purr... meow... taking a warm cozy nap!"',
        rect: { left: '67%', top: '64%', width: '28%', height: '26%' },
      },
      {
        name: 'Warm Fireplace',
        soundType: 'fireplace_wind',
        dialogue: '🔥 Fireplace: "Crackling warm logs keep everyone cozy!"',
        rect: { left: '10%', top: '28%', width: '24%', height: '42%' },
      },
    ],
  },
  8: {
    src: STORY_IMAGES[8],
    alt: 'Caught you! Happy Bunny smiling right in the center with all friends',
    title: 'Stage 4 • Happy Celebration Party!',
    bunnyLocation: { left: '36%', top: '26%', width: '28%', height: '62%' },
    interactiveSpots: [
      {
        name: 'Bluebird',
        soundType: 'bird',
        dialogue: '💙 Bluebird: "Tweet! We found our best friend Bunny!"',
        rect: { left: '18%', top: '36%', width: '20%', height: '22%' },
      },
      {
        name: 'Party Squirrel',
        soundType: 'squirrel',
        dialogue: '🐿️ Squirrel: "Hooray! Waving my party flag for Bunny!"',
        rect: { left: '14%', top: '54%', width: '22%', height: '34%' },
      },
      {
        name: 'Party Puppy',
        soundType: 'dog',
        dialogue: '🐶 Puppy: "Woof-woof! Dancing with joy! 🎈"',
        rect: { left: '60%', top: '48%', width: '22%', height: '38%' },
      },
      {
        name: 'Leaping Frog',
        soundType: 'frog',
        dialogue: '🐸 Frog: "Ribbit! Jumping party time! 🎉"',
        rect: { left: '76%', top: '60%', width: '20%', height: '32%' },
      },
    ],
  },
};

export const StoryIllustration: React.FC<StoryIllustrationProps> = ({
  pageNumber,
  onBunnyTapped,
  isQuestionMode = false,
  highlightBunny = false,
}) => {
  const [bunnyBounced, setBunnyBounced] = useState(false);
  const [tapEffect, setTapEffect] = useState<{ text: string } | null>(null);

  const scene = STORY_SCENE_IMAGES[pageNumber] || STORY_SCENE_IMAGES[1];

  const handleBunnyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playAnimalSound('bunny');
    soundEngine.playPop();
    setBunnyBounced(true);
    setTimeout(() => setBunnyBounced(false), 800);

    setTapEffect({
      text: pageNumber === 8 ? '🤗 "Caught you! Happy Bunny!" 💖' : '🐰 "Peek-a-boo! You found me!" ✨',
    });
    setTimeout(() => setTapEffect(null), 1800);

    if (onBunnyTapped) {
      onBunnyTapped();
    }
  };

  const handleInteractiveSpotClick = (e: React.MouseEvent, soundType: string, dialogue: string) => {
    e.stopPropagation();
    soundEngine.playAnimalSound(soundType);
    soundEngine.playPop();
    setTapEffect({ text: dialogue });
    setTimeout(() => setTapEffect(null), 1800);
  };

  return (
    <div className="relative w-full h-full min-h-[280px] sm:min-h-[310px] rounded-3xl overflow-hidden shadow-xl border-4 border-amber-300 bg-[#FFFDF5] select-none group transition-all">
      {/* 1. AUTHENTIC WATERCOLOR CHILDREN'S PICTURE BOOK ILLUSTRATION */}
      <img
        src={scene.src}
        alt={scene.alt}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 group-hover:scale-[1.02]"
      />

      {/* Storybook watercolor vignette & subtle paper grain border */}
      <div className="absolute inset-0 pointer-events-none rounded-3xl ring-1 ring-inset ring-amber-900/10 shadow-[inset_0_0_24px_rgba(217,119,6,0.12)]" />

      {/* Floating tap message effect strictly at top edge */}
      {tapEffect && (
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-40 max-w-[92%] px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-xs shadow-xl border-2 border-amber-400 text-amber-950 font-black text-xs sm:text-sm tracking-wide animate-bounce pointer-events-none text-center">
          {tapEffect.text}
        </div>
      )}

      {/* Interactive Helper Cue */}
      <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-xs rounded-full text-[11px] font-black text-amber-950 shadow-md border border-amber-300 pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
        <span>Tap Bunny & friends!</span>
      </div>

      {/* Stage / Scene Tag */}
      <div className="absolute bottom-2.5 left-2.5 z-20 px-2.5 py-1 bg-white/90 backdrop-blur-xs rounded-full text-[10px] font-black text-amber-900 shadow-md border border-amber-200 pointer-events-none">
        {scene.title}
      </div>

      {/* 2. INTERACTIVE SUPPORTING CHARACTER HOTSPOTS */}
      {scene.interactiveSpots.map((spot, idx) => (
        <div
          key={idx}
          onClick={(e) => handleInteractiveSpotClick(e, spot.soundType, spot.dialogue)}
          style={{
            left: spot.rect.left,
            top: spot.rect.top,
            width: spot.rect.width,
            height: spot.rect.height,
          }}
          className="absolute z-25 cursor-pointer rounded-2xl hover:bg-amber-400/15 active:scale-95 transition-all group/spot"
          title={`Tap ${spot.name}`}
        >
          {/* Subtle pulse hint on hover */}
          <div className="w-full h-full opacity-0 group-hover/spot:opacity-100 flex items-center justify-center transition-opacity">
            <span className="text-xs bg-white/90 px-2 py-0.5 rounded-full border border-amber-300 text-amber-950 font-bold shadow-xs">
              🎵
            </span>
          </div>
        </div>
      ))}

      {/* 3. INTERACTIVE BUNNY HOTSPOT WITH GOLDEN GLOW & BOUNCE */}
      <div
        onClick={handleBunnyClick}
        style={{
          left: scene.bunnyLocation.left,
          top: scene.bunnyLocation.top,
          width: scene.bunnyLocation.width,
          height: scene.bunnyLocation.height,
        }}
        className={`absolute z-30 cursor-pointer rounded-3xl transition-transform duration-300 flex items-center justify-center ${
          bunnyBounced ? '-translate-y-3 scale-110' : 'hover:scale-105'
        }`}
        title="Tap Bunny!"
      >
        {/* Golden hint glow when question mode is active or bunny is highlighted */}
        {(isQuestionMode || highlightBunny) && (
          <div className="absolute inset-0 rounded-3xl border-3 border-amber-400/90 bg-amber-300/20 animate-pulse pointer-events-none shadow-[0_0_20px_rgba(251,191,36,0.6)]" />
        )}

        {/* Floating tiny heart on hover */}
        <div className="opacity-0 hover:opacity-100 transition-opacity absolute -top-3 pointer-events-none">
          <span className="px-2 py-0.5 rounded-full bg-white/95 border border-rose-300 text-rose-600 text-[10px] font-black shadow-md">
            🐰 Tap me!
          </span>
        </div>
      </div>
    </div>
  );
};
