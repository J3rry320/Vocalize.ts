import { defaultMoodSettings } from "./utils";
import { MoodSettings } from "./Vocalize";

export interface Command {
  phrase: string;
  action: () => CommandResponse | void;
}

export interface CommandResponse {
  text: string;
  speak?: boolean;
  options?: SpeechOptions;
  callback?: () => void;
}

export interface VoiceCommandOptions {
  language?: string;
  onCommandRecognized?: (command: string) => void;
  onError?: (error: Error) => void;
  ttsOptions?: SpeechOptions; // Default TTS options
  recognitionOptions?: RecognitionOptions; // Default speech recognition options
  presetMood?: "happy" | "calm" | "sad" | "angry" | "surprised" | "neutral"; // Map of moods to TTS options
}

export interface SpeechOptions {
  volume?: number; // 0 to 1
  rate?: number; // 0.1 to 10
  pitch?: number; // 0 to 2
  voice?: SpeechSynthesisVoice;
}

export interface RecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
}
