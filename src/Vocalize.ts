import { CommandProcessor } from "./CommandProcessor";
import { SpeechRecognizer } from "./SpeechRecogniser";
import { SpeechSynthesizer } from "./SpeechSynthesizer";
import { Command, SpeechOptions, VoiceCommandOptions } from "./types";
import { defaultMoodSettings } from "./utils";

export interface MoodSettings {
  [mood: string]: SpeechOptions;
}

export class Vocalize {
  private commandProcessor: CommandProcessor;
  private speechRecognizer: SpeechRecognizer;
  private speechSynthesizer: SpeechSynthesizer;
  private ttsOptions: SpeechOptions;
  private moodSettings: MoodSettings;
  private currentMood: string | null = null;

  constructor(options: VoiceCommandOptions = {}) {
    this.commandProcessor = new CommandProcessor();
    this.speechSynthesizer = new SpeechSynthesizer();
    this.speechRecognizer = new SpeechRecognizer(options.recognitionOptions);
    this.ttsOptions = options.ttsOptions || {};
    this.moodSettings = defaultMoodSettings || {};
    this.currentMood = options.presetMood || null;
    try {
      this.speechRecognizer.onSpeechRecognized((phrase: string) => {
        const response = this.commandProcessor.executeCommand(phrase);
        if (response) {
          const effectiveOptions = this.getEffectiveTTSOptions(
            response.options
          );
          if (response.speak) {
            this.speechSynthesizer.speak(response.text, effectiveOptions);
          }
          if (options.onCommandRecognized) {
            options.onCommandRecognized(phrase);
          }
        } else {
          if (options.onCommandUnrecognized) {
            options.onCommandUnrecognized(phrase);
          }
        }
      });
    } catch (error: any) {
      if (options.onError) {
        options.onError(error);
      }
    }

    if (options.onError) {
      this.speechRecognizer.onError(options.onError);
    }
  }

  /**
   * Registers a list of commands for the library to recognize.
   * @param {Command[]} commands - An array of commands to register.
   */
  registerCommands(commands: Command[]): void {
    commands.forEach((command) => {
      this.commandProcessor.registerCommand(command.phrase, command.action);
    });
  }

  /**
   * Starts listening for speech input.
   */
  startListening(): void {
    this.speechRecognizer.startListening();
  }

  /**
   * Stops listening for speech input.
   */
  stopListening(): void {
    this.speechRecognizer.stopListening();
  }

  /**
   * Sets the default text-to-speech options.
   * @param {SpeechOptions} options - The options to set.
   */
  setTTSOptions(options: SpeechOptions): void {
    this.ttsOptions = options;
  }

  /**
   * Retrieves the available voices for speech synthesis.
   * @returns {Promise<SpeechSynthesisVoice[]>} - A promise that resolves with the available voices.
   */
  getVoices(): Promise<SpeechSynthesisVoice[]> {
    return this.speechSynthesizer.getVoices();
  }
  /**
   * Sets the voice for speech synthesis based on provided criteria.
   * @param {Object} criteria - The criteria for selecting the voice.
   * @param {string} criteria.language - The language code to filter voices.
   * @param {string} [criteria.name] - The name of the voice to select (optional).
   * @param {string} [criteria.voiceURI] - The URI of the voice to select (optional).
   * @returns {Promise<void>} - A promise that resolves when the voice is set.
   */

  setVoice({
    language,
    name,
    voiceURI,
  }: {
    language: string;
    name?: string;
    voiceURI?: string;
  }): Promise<void> {
    return this.speechSynthesizer.setVoice({ language, name, voiceURI });
  }
  /**
   * Sets the current mood for speech synthesis.
   * @param {string} mood - The mood to set, which maps to preset TTS options.
   */
  setMood(mood: string): void {
    this.currentMood = mood;
  }

  /**
   * Gets the effective TTS options, considering the preset mood.
   * @param {SpeechOptions | undefined} commandOptions - The command-specific TTS options.
   * @returns {SpeechOptions} - The final TTS options to use.
   */
  private getEffectiveTTSOptions(
    commandOptions?: SpeechOptions
  ): SpeechOptions {
    const moodOptions = this.currentMood
      ? this.moodSettings[this.currentMood]
      : {};
    return { ...this.ttsOptions, ...commandOptions, ...moodOptions };
  }
}
