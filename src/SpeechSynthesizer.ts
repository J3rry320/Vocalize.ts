import { SpeechOptions } from "./types";

export class SpeechSynthesizer {
  private synth: SpeechSynthesis;
  private currentVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.synth = window.speechSynthesis;

    // Log if the speech synthesis is supported
    if (!this.synth) {
      console.error("SpeechSynthesis API is not supported in this browser.");
    }
  }

  /**
   * Preloads available voices for the SpeechSynthesis API.
   * This should be called after a user interaction.
   * @returns {Promise<void>}
   */
  async preloadVoices(): Promise<void> {
    await this.getVoices();
  }

  /**
   * Speaks the provided text using the SpeechSynthesis API.
   * Throws an error if speech synthesis fails due to lack of user interaction.
   * @param {string} text - The text to be spoken.
   * @param {SpeechOptions} options - The options for speech synthesis, such as volume, rate, pitch, and voice.
   * @throws {Error} - Throws an error if the SpeechSynthesisUtterance fails or if user interaction is required.
   */
  speak(text: string, options: SpeechOptions = {}): void {
    try {
      const utterance = new SpeechSynthesisUtterance(text);

      if (options.volume !== undefined) utterance.volume = options.volume;
      if (options.rate !== undefined) utterance.rate = options.rate;
      if (options.pitch !== undefined) utterance.pitch = options.pitch;
      if (this.currentVoice) utterance.voice = this.currentVoice;

      // Debugging utterance settings
      if (this.synth.getVoices().length === 0) {
        console.warn("No voices loaded. Trying to load voices...");
        // Optionally, load voices here
      }

      if (this.synth.speaking) {
        console.warn(
          "SpeechSynthesis is already speaking. Cancelling current speech."
        );
        this.synth.cancel();
      }

      utterance.onerror = (e) => {
        console.error("SpeechSynthesisUtterance error:", e);
        // Throwing a custom error in case of failure
        throw new Error(
          "Speech synthesis error occurred. Please ensure that the user has interacted with the page."
        );
      };

      this.synth.speak(utterance);
    } catch (error: any) {
      // Catching and rethrowing errors with a custom message
      throw new Error(
        `Speech synthesis failed: ${error.message}. Ensure that a user action has been performed on the webpage.`
      );
    }
  }

  /**
   * Sets the voice for speech synthesis based on provided criteria.
   * @param {Object} criteria - The criteria for selecting the voice.
   * @param {string} criteria.language - The language code to filter voices.
   * @param {string} [criteria.name] - The name of the voice to select (optional).
   * @param {string} [criteria.voiceURI] - The URI of the voice to select (optional).
   * @returns {Promise<void>} - A promise that resolves when the voice is set.
   */
  async setVoice({
    language,
    name,
    voiceURI,
  }: {
    language: string;
    name?: string;
    voiceURI?: string;
  }): Promise<void> {
    const voices = await this.getVoices();

    // Try to find the voice matching the provided criteria
    this.currentVoice =
      voices.find(
        (voice) =>
          voice.lang === language &&
          (name ? voice.name === name : true) &&
          (voiceURI ? voice.voiceURI === voiceURI : true)
      ) || null;

    if (!this.currentVoice) {
      // If no matching voice found, set to the first available voice
      this.currentVoice = voices[0] || null;
      console.warn(
        `No voice found matching the criteria. Defaulting to the first available voice.`
      );
    }

    if (!this.currentVoice) {
      console.error(`No voices available to set.`);
    }
  }

  /**
   * Returns a list of available voices for the SpeechSynthesis API.
   * @returns {Promise<SpeechSynthesisVoice[]>} - A promise that resolves with the available voices.
   */
  getVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve, reject) => {
      const voices = this.synth.getVoices();

      if (voices.length > 0) {
        resolve(voices);
      } else {
        const onVoicesChanged = () => {
          const loadedVoices = this.synth.getVoices();
          if (loadedVoices.length > 0) {
            resolve(loadedVoices);
            this.synth.removeEventListener("voiceschanged", onVoicesChanged);
          } else {
            reject(new Error("Voices are still not available."));
          }
        };

        this.synth.addEventListener("voiceschanged", onVoicesChanged);

        setTimeout(() => {
          this.synth.removeEventListener("voiceschanged", onVoicesChanged);
          reject(new Error("Voices did not load in time."));
        }, 7000); // Adjust timeout as necessary
      }
    });
  }
}
