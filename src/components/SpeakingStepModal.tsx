import React, { useState, useEffect, useRef } from 'react';
import { soundEngine, speakSentence } from '../utils/audio';
import { Volume2, Mic, Square, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SpeakingStepModalProps {
  targetSentence: string;
  modelAudioPrompt: string;
  instruction: string;
  onComplete: () => void;
  isCompleted?: boolean;
}

export const SpeakingStepModal: React.FC<SpeakingStepModalProps> = ({
  targetSentence,
  instruction,
  onComplete,
  isCompleted = false,
}) => {
  const [isPlayingModel, setIsPlayingModel] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [spokenWordIdx, setSpokenWordIdx] = useState<number>(-1);
  const [hasCompletedFullSentence, setHasCompletedFullSentence] = useState(isCompleted);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'hint' | 'success'; text: string } | null>(null);

  const cleanWords = targetSentence
    .split(' ')
    .map((w) => w.replace(/[.,?!]/g, '').trim())
    .filter(Boolean);

  const recognitionRef = useRef<any>(null);
  const recordingStartTimeRef = useRef<number>(0);
  const matchedWordsCountRef = useRef<number>(0);
  const pacingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      stopAllCleanup();
    };
  }, []);

  const stopAllCleanup = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    if (pacingIntervalRef.current) {
      clearInterval(pacingIntervalRef.current);
      pacingIntervalRef.current = null;
    }
  };

  const handlePlayModel = () => {
    soundEngine.playPop();
    setIsPlayingModel(true);
    setFeedbackMsg(null);
    speakSentence(targetSentence, {
      rate: 0.85,
      pitch: 1.15,
      onEnd: () => setIsPlayingModel(false),
    });
  };

  // MANUAL START: User presses [Start Speaking]
  const handleStartSpeaking = () => {
    soundEngine.playPop();
    stopAllCleanup();
    setIsRecording(true);
    setSpokenWordIdx(0);
    setFeedbackMsg(null);
    recordingStartTimeRef.current = Date.now();
    matchedWordsCountRef.current = 1;

    // Web Speech Recognition if available
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.continuous = true;

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          const lowerTranscript = transcript.toLowerCase();

          // Match words in target sentence
          let matched = 0;
          for (let i = 0; i < cleanWords.length; i++) {
            if (lowerTranscript.includes(cleanWords[i].toLowerCase())) {
              matched = i + 1;
            }
          }
          if (matched > matchedWordsCountRef.current) {
            matchedWordsCountRef.current = matched;
            setSpokenWordIdx(matched - 1);
          }
        };

        recognition.onerror = () => {};
        recognition.start();
      } catch (err) {}
    }

    // Visual word progress timer while recording
    let currentIdx = 0;
    const intervalPerWord = 650;
    pacingIntervalRef.current = setInterval(() => {
      currentIdx++;
      if (currentIdx < cleanWords.length) {
        setSpokenWordIdx((prev) => Math.max(prev, currentIdx));
        matchedWordsCountRef.current = Math.max(matchedWordsCountRef.current, currentIdx + 1);
      }
    }, intervalPerWord);
  };

  // MANUAL STOP: User presses [Stop Speaking]
  // Praise audio triggered ONLY AFTER pressing [Stop Speaking] AND confirming FULL sentence completion!
  const handleStopSpeaking = () => {
    soundEngine.playPop();
    const durationMs = Date.now() - recordingStartTimeRef.current;
    stopAllCleanup();
    setIsRecording(false);

    // Full sentence evaluation:
    // Required duration is at least ~500ms per word (e.g. 2.0s for 4 words)
    // AND all words matched or paced
    const minRequiredDurationMs = Math.max(1800, cleanWords.length * 450);
    const hasEnoughWords = matchedWordsCountRef.current >= cleanWords.length;
    const hasEnoughTime = durationMs >= minRequiredDurationMs;

    if (hasEnoughWords && hasEnoughTime) {
      // SUCCESS: Full sentence was spoken!
      setSpokenWordIdx(cleanWords.length - 1);
      setHasCompletedFullSentence(true);

      // Trigger praise audio and fanfare ONLY NOW
      soundEngine.playSpeakingStarFanfare();

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
        });
      } catch (e) {}

      setFeedbackMsg({
        type: 'success',
        text: 'Great job! Full sentence spoken to completion! ⭐',
      });

      speakSentence('Great job! You said the whole sentence! Well done!', {
        rate: 1.0,
        pitch: 1.2,
        onEnd: () => {
          setTimeout(() => {
            onComplete();
          }, 400);
        },
      });
    } else {
      // INCOMPLETE: User stopped mid-sentence or prematurely
      // NO praise audio!
      soundEngine.playHintSound();
      setSpokenWordIdx(-1);

      setFeedbackMsg({
        type: 'hint',
        text: `Incomplete sentence! Say all ${cleanWords.length} words from start to finish before pressing Stop.`,
      });

      speakSentence(`Almost! Speak the full sentence before pressing stop: ${targetSentence}`, {
        rate: 0.85,
        pitch: 1.1,
      });
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-sky-50 to-indigo-50/70 rounded-3xl p-4 sm:p-5 shadow-lg border-3 border-indigo-200 transition-all select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            🗣️
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 block">
              Step 2 • Manual Speaking
            </span>
            <span className="text-xs font-bold text-slate-600">
              {instruction}
            </span>
          </div>
        </div>

        {hasCompletedFullSentence && (
          <div className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Completed! ⭐</span>
          </div>
        )}
      </div>

      {/* Target Sentence Card */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border-2 border-indigo-100 shadow-sm text-center mb-3">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 block mb-1.5">
          Sentence to speak
        </span>

        {/* Word chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {cleanWords.map((word, idx) => {
            const isSpoken = idx <= spokenWordIdx;
            const isCurrent = isRecording && idx === spokenWordIdx;

            return (
              <span
                key={idx}
                className={`px-2 py-1 rounded-xl text-lg sm:text-xl font-heading font-black transition-all ${
                  hasCompletedFullSentence || isSpoken
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 scale-105'
                    : isCurrent
                    ? 'bg-amber-300 text-amber-950 ring-2 ring-amber-400 scale-110 animate-pulse'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {word}
                {isSpoken && <span className="ml-1 text-xs text-emerald-600">✓</span>}
              </span>
            );
          })}
        </div>
      </div>

      {/* Feedback Message */}
      {feedbackMsg && (
        <div
          className={`mb-3 p-2.5 rounded-2xl border text-xs sm:text-sm font-black flex items-center justify-center gap-2 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 animate-fadeIn'
              : 'bg-amber-50 border-amber-300 text-amber-900 animate-bounce'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Manual Recording Controls: Start / Stop */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-center">
        {/* Model Audio Button */}
        <button
          onClick={handlePlayModel}
          disabled={isPlayingModel || isRecording}
          className="w-full sm:w-auto flex-1 py-3 px-4 rounded-2xl bg-white hover:bg-indigo-50 active:scale-95 text-indigo-800 font-extrabold text-sm border-2 border-indigo-200 flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
        >
          <Volume2 className={`w-4 h-4 text-indigo-600 ${isPlayingModel ? 'animate-bounce' : ''}`} />
          <span>{isPlayingModel ? 'Listening...' : 'Hear Model 🔊'}</span>
        </button>

        {/* Manual Start / Stop Toggle Button */}
        {!isRecording ? (
          <button
            onClick={handleStartSpeaking}
            className="w-full sm:w-auto flex-1 py-3 px-5 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-indigo-500/30"
          >
            <Mic className="w-5 h-5" />
            <span>{hasCompletedFullSentence ? 'Start Speaking Again 🎙️' : 'Start Speaking 🎙️'}</span>
          </button>
        ) : (
          <button
            onClick={handleStopSpeaking}
            className="w-full sm:w-auto flex-1 py-3 px-5 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg active:scale-95 bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-200 animate-pulse"
          >
            <Square className="w-5 h-5 fill-white" />
            <span>Stop Speaking ⏹️</span>
          </button>
        )}
      </div>

      <p className="mt-2 text-center text-[11px] font-semibold text-slate-500">
        💡 Press [Start Speaking], speak the full sentence, then press [Stop Speaking]!
      </p>
    </div>
  );
};
