/**
 * Web Audio procedural sound synthesizer & SpeechSynthesis controller
 * Specially tuned for 1st-2nd grade educational clarity and joy.
 * Includes multi-layered ambient environment generators and phonics audio.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /** Gentle tactile pop for buttons */
  playPop() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.06);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  /** Cheerful star / success fanfare */
  playSuccessChime() {
    const ctx = this.getContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + i * 0.09;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.45);
    });
  }

  /** Fanfare when learner successfully speaks sentence */
  playSpeakingStarFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;
    const notes = [440, 554.37, 659.25, 880, 1108.7]; // A4, C#5, E5, A5, C#6
    const now = ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + i * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.28, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  }

  /** Gentle hint / "try again" sound */
  playHintSound() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [440, 392];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + i * 0.12;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.28);
    });
  }

  /** Stamp collection thump + high sparkle */
  playStampSound() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const bass = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bass.type = 'sine';
    bass.frequency.setValueAtTime(260, now);
    bass.frequency.exponentialRampToValueAtTime(90, now + 0.12);
    bassGain.gain.setValueAtTime(0.35, now);
    bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    bass.connect(bassGain);
    bassGain.connect(ctx.destination);
    bass.start(now);
    bass.stop(now + 0.15);

    const spark = ctx.createOscillator();
    const sparkGain = ctx.createGain();
    spark.type = 'triangle';
    spark.frequency.setValueAtTime(1174.66, now + 0.08);
    spark.frequency.exponentialRampToValueAtTime(1760, now + 0.25);
    sparkGain.gain.setValueAtTime(0.2, now + 0.08);
    sparkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    spark.connect(sparkGain);
    sparkGain.connect(ctx.destination);
    spark.start(now + 0.08);
    spark.stop(now + 0.35);
  }

  // ==========================================
  // AMBIENT ENVIRONMENTAL SOUNDS (Layer 1)
  // ==========================================

  /** Rustling leaves in forest breeze */
  playRustlingLeaves() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Buffer noise filtered to sound like leaves
    const bufferSize = ctx.sampleRate * 0.8;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.linearRampToValueAtTime(1800, now + 0.4);
    filter.Q.value = 3.0;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.8);
  }

  /** Creaking wooden cabin door */
  playCreakingDoor() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.linearRampToValueAtTime(260, now + 0.25);
    osc.frequency.linearRampToValueAtTime(180, now + 0.5);
    osc.frequency.linearRampToValueAtTime(320, now + 0.7);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.75);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.75);
  }

  /** Bubbling river stream */
  playRiverWater() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    [300, 480, 620, 420].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + idx * 0.12;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq + 150, t + 0.15);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.25);
    });
  }

  /** Cozy fireplace crackle & wind */
  playFireplaceWind() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Pop crackles
    for (let i = 0; i < 4; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.15 + Math.random() * 0.05;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 + Math.random() * 400, t);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.07);
    }
  }

  /** Play environmental sound by key */
  playEnvironmentSound(type: string) {
    switch (type) {
      case 'rustling_leaves':
        this.playRustlingLeaves();
        break;
      case 'creaking_door':
        this.playCreakingDoor();
        break;
      case 'river_stream':
        this.playRiverWater();
        break;
      case 'fireplace_wind':
        this.playFireplaceWind();
        break;
      default:
        this.playRustlingLeaves();
    }
  }

  // ==========================================
  // ANIMAL VOCALIZATIONS (Layer 2)
  // ==========================================

  playAnimalSound(type: string) {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    switch (type) {
      case 'bird': {
        // Melodious Bluebird Song: Sweet musical sliding avian flute whistle with trill vibrato ("휘이익-피로롱-지저귐~ 🎶")
        // Note 1: Sweet rising flute whistle (1800Hz -> 2500Hz) with natural 7Hz vibrato
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(1800, now);
        osc1.frequency.exponentialRampToValueAtTime(2500, now + 0.14);

        // Avian singing vibrato (LFO)
        const lfo1 = ctx.createOscillator();
        const lfoGain1 = ctx.createGain();
        lfo1.frequency.value = 7.5;
        lfoGain1.gain.value = 50;
        lfo1.connect(osc1.frequency);
        lfo1.start(now);
        lfo1.stop(now + 0.16);

        gain1.gain.setValueAtTime(0.001, now);
        gain1.gain.linearRampToValueAtTime(0.28, now + 0.04);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.16);

        // Note 2: Cascading sweet downward warble (2950Hz -> 2150Hz)
        const t2 = now + 0.17;
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(2950, t2);
        osc2.frequency.exponentialRampToValueAtTime(2150, t2 + 0.12);

        gain2.gain.setValueAtTime(0.001, t2);
        gain2.gain.linearRampToValueAtTime(0.24, t2 + 0.03);
        gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.13);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(t2);
        osc2.stop(t2 + 0.14);

        // Note 3: Joyful high finishing whistle (2350Hz -> 3400Hz with sweet sustained ring)
        const t3 = now + 0.31;
        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(2350, t3);
        osc3.frequency.exponentialRampToValueAtTime(3400, t3 + 0.1);

        gain3.gain.setValueAtTime(0.001, t3);
        gain3.gain.linearRampToValueAtTime(0.22, t3 + 0.03);
        gain3.gain.exponentialRampToValueAtTime(0.001, t3 + 0.15);
        osc3.connect(gain3);
        gain3.connect(ctx.destination);
        osc3.start(t3);
        osc3.stop(t3 + 0.16);
        break;
      }

      case 'frog': {
        // Frog: Realistic Korean "개굴!" (Gae-gul!) - distinctive double-syllable throaty croak
        // Syllable 1: "개-" (140Hz -> 200Hz throaty formants)
        const t1 = now;
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(140, t1);
        osc1.frequency.exponentialRampToValueAtTime(210, t1 + 0.05);
        osc1.frequency.linearRampToValueAtTime(160, t1 + 0.11);

        const filter1 = ctx.createBiquadFilter();
        filter1.type = 'bandpass';
        filter1.frequency.setValueAtTime(520, t1);
        filter1.Q.value = 3.2;

        gain1.gain.setValueAtTime(0.001, t1);
        gain1.gain.linearRampToValueAtTime(0.32, t1 + 0.02);
        gain1.gain.exponentialRampToValueAtTime(0.001, t1 + 0.12);

        osc1.connect(filter1);
        filter1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(t1);
        osc1.stop(t1 + 0.13);

        // Syllable 2: "-굴!" (160Hz -> 105Hz deep pond gulp)
        const t2 = now + 0.13;
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(180, t2);
        osc2.frequency.exponentialRampToValueAtTime(105, t2 + 0.15);

        const filter2 = ctx.createBiquadFilter();
        filter2.type = 'bandpass';
        filter2.frequency.setValueAtTime(380, t2);
        filter2.Q.value = 4.0;

        gain2.gain.setValueAtTime(0.001, t2);
        gain2.gain.linearRampToValueAtTime(0.35, t2 + 0.03);
        gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.18);

        osc2.connect(filter2);
        filter2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(t2);
        osc2.stop(t2 + 0.19);
        break;
      }

      case 'duck': {
        for (let i = 0; i < 2; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = now + i * 0.15;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(380, t);
          osc.frequency.exponentialRampToValueAtTime(260, t + 0.12);

          gain.gain.setValueAtTime(0.25, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.13);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.14);
        }
        break;
      }

      case 'cat': {
        // Cat: Sweet, natural "야옹~" (Ya-ong~)
        // Phase 1: Rising "야-" (high soft glide 580Hz -> 820Hz)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(560, now);
        osc1.frequency.exponentialRampToValueAtTime(840, now + 0.16);

        // Vocal tract formant filter for natural feline vowel "야"
        const filter1 = ctx.createBiquadFilter();
        filter1.type = 'bandpass';
        filter1.frequency.setValueAtTime(1200, now);
        filter1.Q.value = 2.0;

        gain1.gain.setValueAtTime(0.001, now);
        gain1.gain.linearRampToValueAtTime(0.26, now + 0.08);

        osc1.connect(filter1);
        filter1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.2);

        // Phase 2: Gentle sliding down "-옹~" (840Hz -> 480Hz with soft nasal decay)
        const t2 = now + 0.16;
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(840, t2);
        osc2.frequency.exponentialRampToValueAtTime(460, t2 + 0.32);

        const filter2 = ctx.createBiquadFilter();
        filter2.type = 'lowpass';
        filter2.frequency.setValueAtTime(850, t2);

        gain2.gain.setValueAtTime(0.24, t2);
        gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.36);

        osc2.connect(filter2);
        filter2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(t2);
        osc2.stop(t2 + 0.38);
        break;
      }

      case 'bear': {
        // Bear: Lower, deeper forest rumble growl ("우우웅~ 크르릉!")
        // Fundamental deep bass oscillator (lowered from 95Hz to 58Hz - 75Hz)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(62, now);
        osc.frequency.linearRampToValueAtTime(74, now + 0.22);
        osc.frequency.linearRampToValueAtTime(52, now + 0.58);

        // Deep chest resonance lowpass filter
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(140, now);
        filter.Q.value = 3.5;

        // Sub-bass growl layer (38Hz sub rumble)
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(42, now);
        subGain.gain.setValueAtTime(0.2, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 0.62);

        gain.gain.setValueAtTime(0.02, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.62);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.65);
        break;
      }

      case 'squirrel': {
        // Squirrel: Acorn-Clicking & Woody Cheek Chattering ("따각-따각-따각-치칫-치칫! 🐿️🌰")
        // Distinct from bird flute: Hollow woody nut-block resonance + raspy dry cheek chatter
        // Part 1: Hollow woody acorn taps (4 staccato wood-block clicks at 420-560Hz)
        const clickTimes = [0, 0.08, 0.16, 0.24];
        const clickFreqs = [440, 520, 480, 560];
        clickTimes.forEach((dt, idx) => {
          const t = now + dt;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(clickFreqs[idx], t);
          osc.frequency.exponentialRampToValueAtTime(clickFreqs[idx] * 0.45, t + 0.03);

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(clickFreqs[idx], t);
          filter.Q.value = 4.5; // Resonant woody hollow tap

          gain.gain.setValueAtTime(0.001, t);
          gain.gain.linearRampToValueAtTime(0.35, t + 0.004);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.038);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(t);
          osc.stop(t + 0.045);
        });

        // Part 2: Fast scratchy cheek chatter bursts ("Tsk-tsk-tsk!")
        const chitterTimes = [0.32, 0.38, 0.44];
        chitterTimes.forEach((dt, idx) => {
          const t = now + dt;
          const bufferSize = Math.floor(ctx.sampleRate * 0.03);
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
          }
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;

          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1500 + idx * 100, t);
          filter.Q.value = 2.5;

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.18, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          noise.start(t);
          noise.stop(t + 0.035);
        });
        break;
      }

      case 'bunny':
      default: {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(950, now + 0.12);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }
    }
  }
}

export const soundEngine = new SoundEngine();

export interface SpeechOptions {
  rate?: number;
  pitch?: number;
  onBoundary?: (charIndex: number, word: string) => void;
  onEnd?: () => void;
  onError?: () => void;
}

let activeUtterance: SpeechSynthesisUtterance | null = null;

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}

function getEnglishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(
    v => (v.lang.startsWith('en-US') || v.lang.startsWith('en-GB') || v.lang.startsWith('en')) &&
         (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen'))
  );
  if (preferred) return preferred;
  return voices.find(v => v.lang.startsWith('en')) || null;
}

export function speakSentence(text: string, options: SpeechOptions = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options.onEnd?.();
    return;
  }

  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(text);
  activeUtterance = utterance;

  utterance.rate = options.rate ?? 0.95;
  utterance.pitch = options.pitch ?? 1.1;
  utterance.lang = 'en-US';

  const voice = getEnglishVoice();
  if (voice) {
    utterance.voice = voice;
  }

  if (options.onBoundary) {
    utterance.onboundary = (e: SpeechSynthesisEvent) => {
      if (e.name === 'word') {
        const charIndex = e.charIndex;
        const rest = text.slice(charIndex);
        const match = rest.match(/^[a-zA-Z0-9'’-]+/);
        const word = match ? match[0] : '';
        options.onBoundary?.(charIndex, word);
      }
    };
  }

  utterance.onend = () => {
    activeUtterance = null;
    options.onEnd?.();
  };

  utterance.onerror = () => {
    activeUtterance = null;
    options.onError?.();
    options.onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
}

export function speakPhonicsWord(word: string, phonicsBreakdown: string, onEnd?: () => void) {
  stopSpeaking();
  const phrase = `${phonicsBreakdown}. ${word}!`;
  speakSentence(phrase, {
    rate: 0.8,
    pitch: 1.15,
    onEnd,
  });
}
