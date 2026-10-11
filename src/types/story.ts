export interface PhonicsSegment {
  letter: string;
  sound: string;
  ipa?: string;
}

export interface WordDefinition {
  word: string;
  category: 'animal' | 'preposition' | 'adjective' | 'noun' | 'verb';
  phonics: string[];
  phonicsAudioText: string;
  definition: string;
  emoji: string;
  visualType: string;
  example: string;
}

export interface QuestionChoice {
  id: string;
  text: string;
  subtext?: string;
  icon: string;
  isCorrect: boolean;
  visualType: string;
}

export interface StoryQuestion {
  promptText: string;
  voicePrompt: string;
  targetHint: string;
  choices: [QuestionChoice, QuestionChoice];
  hotspotLabel?: string;
}

export interface StampData {
  id: string;
  title: string;
  animal: string;
  icon: string;
  color: string;
  description: string;
  locationName: string;
  stageNumber: number;
}

export interface StageInfo {
  id: number;
  name: string;
  koreanName: string;
  icon: string;
  themeColor: string;
  description: string;
}

export interface StoryPage {
  pageNumber: number;
  stage: StageInfo;
  text: string;
  keyWords: string[];
  readSpeedText?: string;
  question: StoryQuestion;
  stamp: StampData;
  speakingPrompt: {
    instruction: string;
    modelAudioPrompt: string;
    targetSentence: string;
  };
  sceneTheme: {
    bgGradient: string;
    skyColor: string;
    groundColor: string;
    accentColor: string;
  };
  bunnyPosition: {
    x: number;
    y: number;
    hintDescription: string;
  };
}

export interface SoundMysteryCase {
  id: string;
  title: string;
  stageName: string;
  environmentName: string;
  environmentSoundType: 'rustling_leaves' | 'creaking_door' | 'river_stream' | 'fireplace_wind';
  animalSoundType: 'bird' | 'frog' | 'duck' | 'cat' | 'bear' | 'squirrel';
  targetAnimalName: string;
  mysteryQuestion: string;
  clue1: string;
  clue2: string;
  options: {
    id: string;
    name: string;
    emoji: string;
    isCorrect: boolean;
  }[];
}
