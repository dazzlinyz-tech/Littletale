export type WordCategory = 'animals' | 'nature' | 'places_objects' | 'feelings_actions';

export interface WordAdventureItem {
  id: string;
  word: string;
  korean: string;
  category: WordCategory;
  categoryLabel: string;
  categoryIcon: string;
  sceneImage: string;
  icon: string;
  exampleEn: string;
  exampleKo: string;
  phonicsAudioText: string;
  storyPageNumber: number;
}

export interface PictureMatchQuestion {
  id: string;
  targetWord: string;
  targetKorean: string;
  prompt: string;
  options: {
    id: string;
    word: string;
    korean: string;
    image: string;
    icon: string;
    isCorrect: boolean;
  }[];
  hint: string;
}

export interface WordMatchPair {
  id: string;
  en: string;
  ko: string;
  icon: string;
  image: string;
}

export interface BunnyQuizQuestion {
  id: string;
  type: 'picture_to_word' | 'word_to_korean' | 'fill_in_the_blank';
  questionText: string;
  questionSubtext?: string;
  image?: string;
  options: {
    id: string;
    text: string;
    subtext?: string;
    isCorrect: boolean;
  }[];
  correctWord: string;
  explanation: string;
}

export interface WordGardenProgress {
  stars: number;
  flowers: number;
  learnedWordIds: string[];
  reviewWordIds: string[];
  gamesCompleted: number;
}
