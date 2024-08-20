import { CommandProcessor } from "./CommandProcessor";
import { SpeechRecognizer } from "./SpeechRecogniser";
import { SpeechSynthesizer } from "./SpeechSynthesizer";
import { Command, SpeechOptions, VoiceCommandOptions } from "./types";

export class Vocalize {
  private commandProcessor: CommandProcessor;
  private speechRecognizer: SpeechRecognizer;
  private speechSynthesizer: SpeechSynthesizer;
  private ttsOptions: SpeechOptions;

  constructor(options: VoiceCommandOptions = {}) {
    this.commandProcessor = new CommandProcessor();
    this.speechSynthesizer = new SpeechSynthesizer();
    this.speechRecognizer = new SpeechRecognizer(options.recognitionOptions);
    this.ttsOptions = options.ttsOptions || {};

    this.speechRecognizer.onSpeechRecognized((phrase: string) => {
      const response = this.commandProcessor.executeCommand(phrase);
      if (response && response.speak) {
        this.speechSynthesizer.speak(
          response.text,
          response.options || this.ttsOptions
        );
      }

      if (options.onCommandRecognized) {
        options.onCommandRecognized(phrase);
      }
    });

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
}
