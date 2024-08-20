import { RecognitionOptions } from "./types";

export class SpeechRecognizer {
  private recognition: SpeechRecognition;

  constructor(options: RecognitionOptions = {}) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      throw new Error("SpeechRecognition is not supported in this browser.");
    }
    this.recognition = new SpeechRecognition();

    Object.defineProperty(this.recognition, "lang", {
      value: options.lang || "en-US",
      writable: true,
    });
    Object.defineProperty(this.recognition, "continuous", {
      value: options.continuous || false,
      writable: true,
    });
    Object.defineProperty(this.recognition, "interimResults", {
      value: options.interimResults || false,
      writable: true,
    });
  }

  /**
   * Starts speech recognition.
   */
  startListening() {
    this.recognition.start();
  }

  /**
   * Stops speech recognition.
   */
  stopListening() {
    this.recognition.stop();
  }

  /**
   * Sets a callback to be triggered when speech is recognized.
   * @param {function(string): void} callback - The function to call with the recognized speech.
   */
  onSpeechRecognized(callback: (phrase: string) => void) {
    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.trim().toLowerCase();
      callback(transcript);
    };
  }

  /**
   * Sets a callback to be triggered when an error occurs during recognition.
   * @param {function(Error): void} callback - The function to call with the error.
   */
  onError(callback: (error: Error) => void) {
    this.recognition.onerror = (event: Event) => {
      const errorMessage = (event as any).error || "Unknown error";
      callback(new Error(errorMessage));
    };
  }
}
