export interface SignSequenceItem {
  word: string;
  sign_data: unknown;
}

export interface TextTranslationResult {
  original_text: string;
  language: string;
  sign_sequence: SignSequenceItem[];
  avatar_animations: string[];
}

export interface SpeechTranslationResult {
  transcribed_text: string;
  sign_sequence: SignSequenceItem[];
  avatar_animations: string[];
  message?: string;
}

export interface GestureItem {
  label: string;
  num_frames: number;
}
