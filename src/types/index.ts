export type NameStyle = "Classic" | "Modern" | "Unique" | "Nature-inspired" | "Vintage";
export type Gender = "Boy" | "Girl" | "Gender-neutral" | "Surprise me";
export type Syllables = "1" | "2" | "3" | "4+" | "Any";
export type CulturalOrigin =
  | "Any"
  | "English"
  | "Irish"
  | "Italian"
  | "Japanese"
  | "Hebrew"
  | "Arabic"
  | "Indian"
  | "African"
  | "Nordic"
  | "Latin";
export type NameMeaning = "Strength" | "Wisdom" | "Joy" | "Nature" | "Love" | "Any";
export type PersonalityVibe = "Adventurous" | "Creative" | "Thoughtful" | "Charming" | "Bold";

export interface QuizAnswers {
  style: NameStyle;
  gender: Gender;
  firstLetter: string;
  syllables: Syllables;
  origin: CulturalOrigin;
  meaning: NameMeaning;
  siblingName: string;
  lastName: string;
  namesToAvoid: string;
  vibe: PersonalityVibe;
}

export interface BabyName {
  name: string;
  meaning: string;
  origin: string;
  vibe: string;
}

export interface GenerateNamesResponse {
  names: BabyName[];
}

export interface GenerateNamesRequest {
  answers: QuizAnswers;
}
