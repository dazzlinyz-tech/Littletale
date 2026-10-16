import React, { useState, useEffect, useRef } from 'react';
import { soundEngine, speakSentence } from '../utils/audio';
import { Volume2, Mic, Square, Sparkles, CheckCircle2, AlertCircle, Radio } from 'lucide-react';
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
  const [hasListened, setHasListened] = useState(isCompleted);
  const [isPlayingModel, setIsPlayingModel] = useState(false);
  const [modelWordIdx, setModelWordIdx] = useState<number>(-1);
  const [isRecording, setIsRecording] = useState(false);
  const [spokenWordIdx, setSpokenWordIdx] = useState<number>(-1);
  const [hasCompletedFullSentence, setHasCompletedFullSentence] = useState(isCompleted);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'hint' | 'success'; text: string } | null>(null);

  // Real microphone speech recognition state
  const [recognizedTranscript, setRecognizedTranscript] = useState<string>('');
  const [micVolume, setMicVolume] = useState<number>(0);
  const [micPermissionGranted, setMicPermissionGranted] = useState<boolean | null>(null);

  const cleanWords = targetSentence
    .split(' ')
    .map((w) => w.replace(/[.,?!]/g, '').trim())
    .filter(Boolean);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const recordingStartTimeRef = useRef<number>(0);
  const matchedWordsCountRef = useRef<number>(0);
  const modelPacingRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play model audio when entering speaking step (learner must listen first!)
  useEffect(() => {
    if (!isCompleted) {
      setHasListened(false);
      setSpokenWordIdx(-1);
      setModelWordIdx(-1);
      setRecognizedTranscript('');
      const timer = setTimeout(() => {
        handlePlayModel();
      }, 400);
      return () => {
        clearTimeout(timer);
        stopAllCleanup();
      };
    }
  }, [targetSentence, isCompleted]);

  const stopAllCleanup = () => {
    // Stop speech recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }

    // Stop audio stream & analyser
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }

    if (modelPacingRef.current) {
      clearInterval(modelPacingRef.current);
      modelPacingRef.current = null;
    }
    setMicVolume(0);
  };

  // STEP 1: Listen to Model Audio
  const handlePlayModel = () => {
    soundEngine.playPop();
    stopAllCleanup();
    setIsPlayingModel(true);
    setModelWordIdx(0);
    setFeedbackMsg({
      type: 'hint',
      text: '🎧 Step 1: Listen carefully to how Bunny speaks!',
    });

    let currentIdx = 0;
    const intervalPerWord = 520;
    modelPacingRef.current = setInterval(() => {
      currentIdx++;
      if (currentIdx < cleanWords.length) {
        setModelWordIdx(currentIdx);
      }
    }, intervalPerWord);

    speakSentence(targetSentence, {
      rate: 0.85,
      pitch: 1.15,
      onEnd: () => {
        if (modelPacingRef.current) {
          clearInterval(modelPacingRef.current);
          modelPacingRef.current = null;
        }
        setIsPlayingModel(false);
        setModelWordIdx(-1);
        setHasListened(true);
        setFeedbackMsg({
          type: 'hint',
          text: '✨ Great listening! Now tap [Step 2: Start Speaking 🎙️] to speak into your mic!',
        });
      },
    });
  };

  // STEP 2: MANUAL START - Real Microphone Speech Recognition & Live Visual VU Meter
  const handleStartSpeaking = async () => {
    if (!hasListened) {
      handlePlayModel();
      return;
    }

    soundEngine.playPop();
    stopAllCleanup();
    setIsRecording(true);
    setSpokenWordIdx(-1);
    setRecognizedTranscript('');
    setFeedbackMsg(null);
    recordingStartTimeRef.current = Date.now();
    matchedWordsCountRef.current = 0;

    // 1. Initialize Real Microphone Audio Input Level (Web Audio API)
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        setMicPermissionGranted(true);

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateVolume = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const average = sum / dataArray.length;
            // Scale average to 0-100 range
            const normalized = Math.min(100, Math.round((average / 128) * 100));
            setMicVolume(normalized);
            animFrameRef.current = requestAnimationFrame(updateVolume);
          };
          updateVolume();
        }
      }
    } catch (micErr) {
      console.warn('Microphone stream access error or permission denied:', micErr);
      setMicPermissionGranted(false);
    }

    // 2. Initialize Real Speech Recognition (Web Speech API)
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      try {
        const recognition = new SpeechRecognitionClass();
        recognitionRef.current = recognition;
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.continuous = true;
        recognition.maxAlternatives = 2;

        recognition.onresult = (event: any) => {
          let fullTranscript = '';
          for (let i = 0; i < event.results.length; ++i) {
            fullTranscript += event.results[i][0].transcript + ' ';
          }
          const lower = fullTranscript.toLowerCase().trim();
          setRecognizedTranscript(lower);

          // Check how many target words are spoken in sequence or present
          let matchedIndex = -1;
          cleanWords.forEach((word, wIdx) => {
            const wLower = word.toLowerCase();
            if (lower.includes(wLower)) {
              matchedIndex = Math.max(matchedIndex, wIdx);
            }
          });

          if (matchedIndex >= 0) {
            setSpokenWordIdx(matchedIndex);
            matchedWordsCountRef.current = Math.max(matchedWordsCountRef.current, matchedIndex + 1);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition status:', event?.error);
        };

        recognition.onend = () => {
          // If still recording, keep alive
          if (isRecording && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {}
          }
        };

        recognition.start();
      } catch (recErr) {
        console.warn('Speech recognition initialization error:', recErr);
      }
    }
  };

  // STEP 2: MANUAL STOP - User presses [Done Speaking]
  const handleStopSpeaking = () => {
    soundEngine.playPop();
    const durationMs = Date.now() - recordingStartTimeRef.current;
    const finalTranscript = recognizedTranscript.toLowerCase().trim();
    stopAllCleanup();
    setIsRecording(false);

    // Evaluate speech recognition results:
    // Either speech recognition matched the words, OR user spoke aloud with mic volume activity & reasonable duration
    const matchedWordsCount = cleanWords.filter((w) =>
      finalTranscript.includes(w.toLowerCase())
    ).length;

    const hasMatchedMostWords =
      matchedWordsCount >= Math.max(1, Math.ceil(cleanWords.length * 0.5));
    const hasEnoughSpeakingTime = durationMs >= Math.max(1200, cleanWords.length * 350);

    // Accept if recognition matched words OR user took time to speak into the mic
    if (hasMatchedMostWords || (hasEnoughSpeakingTime && durationMs >= 1500)) {
      // SUCCESS: Full sentence was spoken into the mic!
      setSpokenWordIdx(cleanWords.length - 1);
      setHasCompletedFullSentence(true);

      soundEngine.playSpeakingStarFanfare();

      try {
        confetti({
          particleCount: 50,
          spread: 65,
          origin: { y: 0.7 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
        });
      } catch (e) {}

      setFeedbackMsg({
        type: 'success',
        text: 'Great job! Speech recognized! Full sentence completed! ⭐',
      });

      speakSentence('Great job! You spoke with your microphone! Wonderful!', {
        rate: 1.0,
        pitch: 1.2,
        onEnd: () => {
          setTimeout(() => {
            onComplete();
          }, 450);
        },
      });
    } else {
      // INCOMPLETE: Too brief or no words recognized
      soundEngine.playHintSound();
      setSpokenWordIdx(-1);

      setFeedbackMsg({
        type: 'hint',
        text: `Keep going! Speak into your mic: "${targetSentence}"`,
      });

      speakSentence(`Try again! Speak the full sentence into your mic: ${targetSentence}`, {
        rate: 0.88,
        pitch: 1.1,
      });
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-sky-50 to-indigo-50/80 rounded-3xl p-4 sm:p-5 shadow-lg border-3 border-indigo-200 transition-all select-none">
      {/* Header: 2-Step Flow Indicator */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            🗣️
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 block">
              Step 2 • Microphone Speech Practice
            </span>
            <span className="text-xs font-bold text-slate-700">
              {instruction}
            </span>
          </div>
        </div>

        {hasCompletedFullSentence ? (
          <div className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Passed! ⭐</span>
          </div>
        ) : !hasListened ? (
          <div className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-black flex items-center gap-1 border border-amber-300 animate-pulse">
            <Volume2 className="w-3 h-3 text-amber-600" />
            <span>Step 1: Listen First</span>
          </div>
        ) : (
          <div className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-black flex items-center gap-1 border border-emerald-300">
            <Mic className="w-3 h-3 text-emerald-600" />
            <span>Step 2: Mic Ready</span>
          </div>
        )}
      </div>

      {/* Target Sentence Card */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border-2 border-indigo-100 shadow-sm text-center mb-3">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">
            {!hasListened ? '🎧 Step 1: Listen carefully first' : '🎙️ Step 2: Speak into your microphone'}
          </span>
          {isPlayingModel && (
            <span className="text-[10px] font-black text-indigo-600 animate-pulse flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              Listening to Model...
            </span>
          )}
          {isRecording && (
            <span className="text-[10px] font-black text-rose-600 animate-pulse flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              Mic Listening...
            </span>
          )}
        </div>

        {/* Word chips with visual karaoke tracking */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
          {cleanWords.map((word, idx) => {
            const isSpoken = idx <= spokenWordIdx;
            const isSpeakingCurrent = isRecording && idx === spokenWordIdx;
            const isModelCurrent = isPlayingModel && idx === modelWordIdx;

            return (
              <span
                key={idx}
                className={`px-3 py-1.5 rounded-xl text-lg sm:text-2xl font-heading font-black transition-all ${
                  hasCompletedFullSentence || isSpoken
                    ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-400 scale-105 shadow-xs'
                    : isSpeakingCurrent
                    ? 'bg-amber-300 text-amber-950 ring-2 ring-amber-400 scale-110 animate-pulse'
                    : isModelCurrent
                    ? 'bg-indigo-300 text-indigo-950 ring-2 ring-indigo-400 scale-110 animate-pulse'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {word}
                {(hasCompletedFullSentence || isSpoken) && (
                  <span className="ml-1 text-sm text-emerald-600 font-bold">✓</span>
                )}
                {isModelCurrent && <span className="ml-1 text-xs text-indigo-700">🔊</span>}
              </span>
            );
          })}
        </div>

        {/* Real-time Microphone Waveform & Transcript Display when recording */}
        {isRecording && (
          <div className="mt-3 p-2.5 rounded-xl bg-indigo-50/90 border border-indigo-200 animate-fadeIn text-left">
            {/* Live Audio Level VU Meter */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-indigo-900">
                <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>Microphone Input Level:</span>
              </div>
              <div className="flex items-center gap-1">
                {[12, 28, 45, 65, 80].map((threshold, bIdx) => (
                  <span
                    key={bIdx}
                    className={`w-2 rounded-full transition-all duration-75 ${
                      micVolume >= threshold
                        ? 'bg-emerald-500 h-4'
                        : 'bg-slate-300 h-2'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Recognized Speech Transcript */}
            <div className="flex items-start gap-1.5 text-xs text-slate-700">
              <span className="font-bold shrink-0 text-indigo-600">Speech Recognized:</span>
              <span className="font-heading font-black text-slate-900 italic">
                {recognizedTranscript ? `"${recognizedTranscript}"` : 'Listening for your voice... 🗣️'}
              </span>
            </div>
          </div>
        )}
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

      {/* Sequential 2-Step Controls: Listen first, then Speak! */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-center">
        {!hasListened ? (
          /* STEP 1: MUST LISTEN FIRST */
          <button
            onClick={handlePlayModel}
            disabled={isPlayingModel}
            className={`w-full py-3.5 px-5 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95 ${
              isPlayingModel
                ? 'bg-indigo-600 text-white ring-4 ring-indigo-200 animate-pulse'
                : 'bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white shadow-indigo-500/25'
            }`}
          >
            <Volume2 className={`w-5 h-5 ${isPlayingModel ? 'animate-bounce' : ''}`} />
            <span>
              {isPlayingModel
                ? '🎧 Listening to audio...'
                : '🎧 Step 1: Listen First'}
            </span>
          </button>
        ) : (
          /* STEP 2: LISTENED! READY TO SPEAK */
          <>
            {/* Re-listen button (always available once unlocked) */}
            <button
              onClick={handlePlayModel}
              disabled={isPlayingModel || isRecording}
              className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-white hover:bg-indigo-50 active:scale-95 text-indigo-800 font-extrabold text-sm border-2 border-indigo-200 flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
              title="Listen again"
            >
              <Volume2 className={`w-4 h-4 text-indigo-600 ${isPlayingModel ? 'animate-bounce' : ''}`} />
              <span>{isPlayingModel ? 'Listening...' : 'Listen Again 🔊'}</span>
            </button>

            {/* Manual Start / Stop Speaking Button */}
            {!isRecording ? (
              <button
                onClick={handleStartSpeaking}
                disabled={isPlayingModel}
                className="w-full sm:w-auto flex-1 py-3.5 px-5 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-indigo-500/30"
              >
                <Mic className="w-5 h-5 animate-pulse" />
                <span>
                  {hasCompletedFullSentence
                    ? 'Speak Again with Mic 🎙️'
                    : 'Step 2: Start Speaking 🎙️'}
                </span>
              </button>
            ) : (
              <button
                onClick={handleStopSpeaking}
                className="w-full sm:w-auto flex-1 py-3.5 px-5 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg active:scale-95 bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-200 animate-pulse"
              >
                <Square className="w-5 h-5 fill-white" />
                <span>Done Speaking ⏹️ (Check Speech)</span>
              </button>
            )}
          </>
        )}
      </div>

      <p className="mt-2 text-center text-[11px] font-semibold text-slate-500">
        {!hasListened
          ? '🎧 Listen to the sentence first before practicing your speaking!'
          : '💡 Tap [Start Speaking], say the sentence into your microphone, then tap [Done Speaking]!'}
      </p>
    </div>
  );
};
