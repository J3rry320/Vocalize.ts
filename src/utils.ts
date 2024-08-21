import { SpeechOptions } from "./types";

export const defaultMoodSettings: { [mood: string]: SpeechOptions } = {
  happy: {
    volume: 1.0, // Full volume
    rate: 1.2, // Slightly faster speech rate
    pitch: 1.5, // Higher pitch for a cheerful tone
  },
  calm: {
    volume: 0.8, // Slightly reduced volume
    rate: 0.9, // Slower speech rate for a relaxed tone
    pitch: 1.0, // Neutral pitch
  },
  sad: {
    volume: 0.7, // Lower volume
    rate: 0.8, // Slower speech rate
    pitch: 0.8, // Lower pitch for a melancholic tone
  },
  angry: {
    volume: 1.0, // Full volume
    rate: 1.1, // Slightly faster speech rate
    pitch: 1.3, // Higher pitch to convey intensity
  },
  surprised: {
    volume: 1.0, // Full volume
    rate: 1.2, // Faster speech rate to express surprise
    pitch: 1.4, // Higher pitch for a surprised tone
  },
  neutral: {
    volume: 1.0, // Default volume
    rate: 1.0, // Default speech rate
    pitch: 1.0, // Default pitch
  },
};
