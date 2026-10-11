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
  const [hasListened, setHasListened] = useState(isCompleted);
  const [isPlayingModel, setIsPlayingModel] = useState(false);
  const [modelWordIdx, setModelWordIdx] = useState<number>(-1);
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
  const modelPacingRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play model audio when entering speaking step (learner must listen first!)
  useEffect(() => {
    if (!isCompleted) {
      setHasListened(false);
      setSpokenWordIdx(-1);
      setModelWordIdx(-1);
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
    if (modelPacingRef.current) {
      clearInterval(modelPacingRef.current);
      modelPacingRef.current = null;
    }
  };

  // STEP 1: Listen to Model Audio
  const handlePlayModel = () => {
    soundEngine.playPop();
    stopAllCleanup();
    setIsPlayingModel(true);
    setModelWordIdx(0);
    setFeedbackMsg({
      type: 'hint',
      text: '🎧 1단계: 원어민 발음을 귀 기울여 잘 들어보세요!',
    });

    // Pacing for word highlighting during model playback
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
          text: '✨ 잘 들었나요? 이제 [2단계: 따라 말하기 🎙️] 버튼을 누르고 문장을 말해보세요!',
        });
      },
    });
  };

  // STEP 2: MANUAL START - User presses [Start Speaking]
  const handleStartSpeaking = () => {
    if (!hasListened) {
      // Must listen first before speaking!
      handlePlayModel();
      return;
    }

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

  // STEP 2: MANUAL STOP - User presses [Stop Speaking]
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
      {/* Header: 2-Step Flow Indicator */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            🗣️
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 block">
              Step 2 • Listen & Speak
            </span>
            <span className="text-xs font-bold text-slate-600">
              {instruction}
            </span>
          </div>
        </div>

        {hasCompletedFullSentence ? (
          <div className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Completed! ⭐</span>
          </div>
        ) : !hasListened ? (
          <div className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-black flex items-center gap-1 border border-amber-300 animate-pulse">
            <Volume2 className="w-3 h-3 text-amber-600" />
            <span>1단계: 먼저 듣기</span>
          </div>
        ) : (
          <div className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-black flex items-center gap-1 border border-emerald-300">
            <Mic className="w-3 h-3 text-emerald-600" />
            <span>2단계: 말하기 준비</span>
          </div>
        )}
      </div>

      {/* Target Sentence Card */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border-2 border-indigo-100 shadow-sm text-center mb-3">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">
            {!hasListened ? '🎧 1단계: 먼저 귀 기울여 들어보세요' : '🎙️ 2단계: 따라 말할 문장'}
          </span>
          {isPlayingModel && (
            <span className="text-[10px] font-black text-indigo-600 animate-pulse flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              듣는 중...
            </span>
          )}
        </div>

        {/* Word chips with visual karaoke tracking */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {cleanWords.map((word, idx) => {
            const isSpoken = idx <= spokenWordIdx;
            const isSpeakingCurrent = isRecording && idx === spokenWordIdx;
            const isModelCurrent = isPlayingModel && idx === modelWordIdx;

            return (
              <span
                key={idx}
                className={`px-2.5 py-1 rounded-xl text-lg sm:text-xl font-heading font-black transition-all ${
                  hasCompletedFullSentence || isSpoken
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 scale-105'
                    : isSpeakingCurrent
                    ? 'bg-amber-300 text-amber-950 ring-2 ring-amber-400 scale-110 animate-pulse'
                    : isModelCurrent
                    ? 'bg-indigo-300 text-indigo-950 ring-2 ring-indigo-400 scale-110 animate-pulse'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {word}
                {isSpoken && <span className="ml-1 text-xs text-emerald-600">✓</span>}
                {isModelCurrent && <span className="ml-1 text-xs text-indigo-700">🔊</span>}
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
                ? '🎧 원어민 발음 듣는 중... (Listening)'
                : '🎧 1단계: 먼저 문장 듣기 (Listen First)'}
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
              title="다시 듣기"
            >
              <Volume2 className={`w-4 h-4 text-indigo-600 ${isPlayingModel ? 'animate-bounce' : ''}`} />
              <span>{isPlayingModel ? '듣는 중...' : '다시 듣기 🔊'}</span>
            </button>

            {/* Manual Start / Stop Speaking Button */}
            {!isRecording ? (
              <button
                onClick={handleStartSpeaking}
                disabled={isPlayingModel}
                className="w-full sm:w-auto flex-1 py-3 px-5 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-indigo-500/30"
              >
                <Mic className="w-5 h-5" />
                <span>
                  {hasCompletedFullSentence
                    ? '다시 따라 말하기 🎙️'
                    : '2단계: 따라 말하기 시작 🎙️'}
                </span>
              </button>
            ) : (
              <button
                onClick={handleStopSpeaking}
                className="w-full sm:w-auto flex-1 py-3 px-5 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg active:scale-95 bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-200 animate-pulse"
              >
                <Square className="w-5 h-5 fill-white" />
                <span>말하기 완료 ⏹️ (Stop Speaking)</span>
              </button>
            )}
          </>
        )}
      </div>

      <p className="mt-2 text-center text-[11px] font-semibold text-slate-500">
        {!hasListened
          ? '🎧 스피킹하기 전에 원어민 문장을 먼저 끝까지 들어보세요!'
          : '💡 [따라 말하기 시작]을 누르고 문장을 끝까지 말한 뒤 [말하기 완료]를 누르세요!'}
      </p>
    </div>
  );
};
