import React, { useState, useEffect } from 'react';
import { WordMatchPair } from '../../types/wordAdventure';
import { soundEngine, speakSentence } from '../../utils/audio';
import { Sparkles, RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WordMatchGameProps {
  pairs: WordMatchPair[];
  onGameComplete: (starsEarned: number) => void;
  onBackToMenu: () => void;
}

interface MatchCard {
  cardId: string;
  pairId: string;
  type: 'en' | 'ko';
  text: string;
  subtext?: string;
  icon: string;
  image?: string;
}

export const WordMatchGame: React.FC<WordMatchGameProps> = ({
  pairs,
  onGameComplete,
  onBackToMenu,
}) => {
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<MatchCard[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [wrongPairAnimation, setWrongPairAnimation] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Take 6 pairs per game round to keep it kid-friendly and responsive
  const gamePairs = pairs.slice(0, 6);

  useEffect(() => {
    startNewGame();
  }, [pairs]);

  const startNewGame = () => {
    // Generate English and Korean cards, then shuffle
    const newCards: MatchCard[] = [];
    gamePairs.forEach((p) => {
      // English card with scene image thumbnail
      newCards.push({
        cardId: `${p.id}-en`,
        pairId: p.id,
        type: 'en',
        text: p.en,
        icon: p.icon,
        image: p.image,
      });
      // Korean meaning card
      newCards.push({
        cardId: `${p.id}-ko`,
        pairId: p.id,
        type: 'ko',
        text: p.ko,
        subtext: '한국어 뜻',
        icon: p.icon,
      });
    });

    // Shuffle cards with Fisher-Yates
    for (let i = newCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
    }

    setCards(newCards);
    setSelectedCards([]);
    setMatchedPairIds([]);
    setWrongPairAnimation([]);
    setIsCompleted(false);
  };

  const handleCardClick = (card: MatchCard) => {
    // Already matched or already selected or currently showing error
    if (
      matchedPairIds.includes(card.pairId) ||
      selectedCards.some((c) => c.cardId === card.cardId) ||
      wrongPairAnimation.length > 0
    ) {
      return;
    }

    soundEngine.playPop();

    // If English card, speak it
    if (card.type === 'en') {
      speakSentence(card.text, { rate: 0.9, pitch: 1.15 });
    }

    const newSelection = [...selectedCards, card];
    setSelectedCards(newSelection);

    if (newSelection.length === 2) {
      const [c1, c2] = newSelection;
      if (c1.pairId === c2.pairId && c1.type !== c2.type) {
        // MATCH!
        soundEngine.playSuccessChime();
        const updatedMatches = [...matchedPairIds, c1.pairId];
        setMatchedPairIds(updatedMatches);
        setSelectedCards([]);

        try {
          confetti({
            particleCount: 25,
            spread: 50,
            origin: { y: 0.7 },
          });
        } catch (e) {}

        // Check if all matched
        if (updatedMatches.length === gamePairs.length) {
          setTimeout(() => {
            setIsCompleted(true);
            soundEngine.playSpeakingStarFanfare();
            onGameComplete(3); // 3 stars reward
            try {
              confetti({
                particleCount: 70,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#F59E0B', '#10B981', '#EC4899', '#38BDF8'],
              });
            } catch (e) {}
          }, 600);
        }
      } else {
        // MISMATCH
        soundEngine.playHintSound();
        setWrongPairAnimation([c1.cardId, c2.cardId]);
        setTimeout(() => {
          setSelectedCards([]);
          setWrongPairAnimation([]);
        }, 900);
      }
    }
  };

  if (isCompleted) {
    return (
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border-4 border-amber-300 text-center flex flex-col items-center select-none">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-300 flex items-center justify-center text-4xl shadow-lg border-4 border-white mb-3 animate-bounce">
          🏆
        </div>

        <h2 className="text-3xl font-black font-heading text-amber-950 mb-1">
          Word Match Champion!
        </h2>
        <p className="text-sm font-bold text-slate-600 mb-4">
          All {gamePairs.length} pairs matched successfully!
        </p>

        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 mb-5 w-full flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="text-base font-black text-amber-950">
            Earned +3 Star Flowers! 🌸
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            onClick={() => {
              soundEngine.playPop();
              startNewGame();
            }}
            className="py-3 px-4 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-sm flex items-center justify-center gap-1.5 cursor-pointer border border-amber-300"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          <button
            onClick={onBackToMenu}
            className="py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 text-white font-black text-sm shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>All Games</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md flex flex-col items-center select-none">
      {/* Header with matches progress */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
          Matched: {matchedPairIds.length} / {gamePairs.length} Pairs
        </span>

        <button
          onClick={() => {
            soundEngine.playPop();
            startNewGame();
          }}
          className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Shuffle 🔀</span>
        </button>
      </div>

      <p className="text-xs font-bold text-slate-600 mb-3 text-center">
        Tap an English word and its matching Korean card!
      </p>

      {/* Card Grid (4 cols on sm, 3 cols on mobile) */}
      <div className="w-full grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-2.5">
        {cards.map((card) => {
          const isMatched = matchedPairIds.includes(card.pairId);
          const isSelected = selectedCards.some((c) => c.cardId === card.cardId);
          const isWrong = wrongPairAnimation.includes(card.cardId);

          let cardStyle = 'bg-white border-amber-200 hover:border-amber-400 shadow-sm hover:scale-102';
          if (isMatched) {
            cardStyle = 'bg-emerald-50 border-emerald-400 opacity-60 pointer-events-none scale-95';
          } else if (isSelected) {
            cardStyle = 'bg-amber-100 border-amber-500 ring-4 ring-amber-300/60 scale-105';
          } else if (isWrong) {
            cardStyle = 'bg-rose-100 border-rose-400 ring-4 ring-rose-200 animate-shake';
          }

          return (
            <button
              key={card.cardId}
              onClick={() => handleCardClick(card)}
              disabled={isMatched}
              className={`min-h-[84px] sm:min-h-[94px] p-2 rounded-2xl border-2 sm:border-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-95 ${cardStyle}`}
            >
              {isMatched ? (
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-1" />
                  <span className="text-[11px] font-black text-emerald-800 line-through">
                    {card.text}
                  </span>
                </div>
              ) : (
                <>
                  <span className="text-xl sm:text-2xl mb-1">{card.icon}</span>
                  <span className="font-heading font-black text-xs sm:text-sm text-amber-950 leading-tight">
                    {card.text}
                  </span>
                  <span className="text-[9px] font-bold text-amber-700/80 mt-0.5">
                    {card.type === 'en' ? 'English' : '한국어'}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
