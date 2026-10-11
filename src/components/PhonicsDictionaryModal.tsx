import React, { useEffect, useState } from 'react';
import { WordDefinition } from '../types/story';
import { soundEngine, speakPhonicsWord, speakSentence } from '../utils/audio';
import { Volume2, Sparkles, X, Play } from 'lucide-react';
import { FenceIcon } from './FenceIcon';

interface PhonicsDictionaryModalProps {
  wordData: WordDefinition | null;
  onClose: () => void;
}

export const PhonicsDictionaryModal: React.FC<PhonicsDictionaryModalProps> = ({
  wordData,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightedSoundIdx, setHighlightedSoundIdx] = useState<number | null>(null);

  useEffect(() => {
    if (wordData) {
      soundEngine.playPop();
      // Auto-play phonics immediately within 0.5s as per completion criteria!
      playPhonics();
    }
  }, [wordData?.word]);

  if (!wordData) return null;

  const playPhonics = () => {
    setIsPlaying(true);
    soundEngine.playPop();

    // Sequence highlights through phonics segments
    const phonicsCount = wordData.phonics.length;
    wordData.phonics.forEach((_, idx) => {
      setTimeout(() => {
        setHighlightedSoundIdx(idx);
      }, idx * 450);
    });

    setTimeout(() => {
      setHighlightedSoundIdx(null);
    }, phonicsCount * 450 + 200);

    speakPhonicsWord(wordData.word, wordData.phonicsAudioText, () => {
      setIsPlaying(false);
      setHighlightedSoundIdx(null);
    });
  };

  const playSinglePhonics = (index: number) => {
    soundEngine.playPop();
    setHighlightedSoundIdx(index);
    const sound = wordData.phonics[index];
    speakSentence(sound, {
      rate: 0.7,
      pitch: 1.2,
      onEnd: () => setHighlightedSoundIdx(null),
    });
  };

  const playExampleSentence = () => {
    soundEngine.playPop();
    speakSentence(wordData.example, { rate: 0.85, pitch: 1.1 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-sm bg-[#FFFDF9] rounded-3xl p-6 shadow-2xl border-4 border-amber-300 text-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => {
            soundEngine.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center font-bold transition-transform active:scale-90 cursor-pointer shadow-xs"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-800 text-xs font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          {wordData.category}
        </div>

        {/* Word Display with Big Font */}
        <h2 className="text-4xl font-extrabold text-slate-800 tracking-wide font-heading mb-1">
          {wordData.word}
        </h2>

        {/* Phonics Segment Bubbles */}
        <div className="flex items-center justify-center gap-2 my-3">
          {wordData.phonics.map((seg, idx) => (
            <button
              key={idx}
              onClick={() => playSinglePhonics(idx)}
              className={`min-w-10 h-11 px-2.5 rounded-2xl flex items-center justify-center font-bold text-lg border-2 transition-all cursor-pointer shadow-xs ${
                highlightedSoundIdx === idx
                  ? 'bg-amber-400 border-amber-500 text-white scale-110 shadow-md ring-2 ring-amber-300'
                  : 'bg-white border-amber-200 text-amber-900 hover:bg-amber-50 active:scale-95'
              }`}
            >
              {seg}
            </button>
          ))}
        </div>

        {/* Animated Visual Card according to visualType */}
        <div className="my-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col items-center justify-center">
          <div className="w-20 h-20 mb-2 flex items-center justify-center text-5xl animate-bounce">
            {wordData.word === 'fence' ? (
              <FenceIcon size={72} />
            ) : (
              wordData.emoji
            )}
          </div>

          {/* Visual diagram explanation for prepositions */}
          {wordData.category === 'preposition' && (
            <div className="text-xs font-bold text-amber-700 bg-white/90 px-3 py-1 rounded-full border border-amber-200 shadow-xs mb-1">
              {wordData.word === 'behind' && 'At the back of the tree 🌳'}
              {wordData.word === 'on' && 'Resting on top of the rock 🪨'}
              {wordData.word === 'under' && 'Beneath the flower umbrella 🌻'}
              {wordData.word === 'in' && 'Inside the cozy box 📦'}
              {wordData.word === 'by' && 'Beside the pond water 🌊'}
              {wordData.word === 'with' && 'Together with a friend 🤝'}
            </div>
          )}

          <p className="text-sm font-semibold text-slate-600 px-2 leading-snug">
            {wordData.definition}
          </p>
        </div>

        {/* Example Sentence with audio */}
        <div
          onClick={playExampleSentence}
          className="mb-5 p-2.5 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between text-left cursor-pointer hover:bg-sky-100/70 active:scale-98 transition-all group"
        >
          <div className="flex-1 pr-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 block">Example Sentence</span>
            <p className="text-xs font-bold text-slate-700">"{wordData.example}"</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-sky-400 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <Volume2 className="w-4 h-4" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={playPhonics}
            disabled={isPlaying}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-white font-extrabold text-base shadow-md shadow-amber-400/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Play className={`w-4 h-4 fill-white ${isPlaying ? 'animate-spin' : ''}`} />
            {isPlaying ? 'Speaking...' : 'Hear Phonics'}
          </button>

          <button
            onClick={() => {
              soundEngine.playPop();
              onClose();
            }}
            className="py-3 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-base shadow-md shadow-emerald-500/30 transition-all cursor-pointer"
          >
            Got it! ✨
          </button>
        </div>
      </div>
    </div>
  );
};
