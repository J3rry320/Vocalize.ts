import { Command, CommandResponse } from "./types";

export class CommandProcessor {
  private commands: Map<string, () => CommandResponse | void> = new Map();

  /**
   * Registers a command and its associated action.
   * @param {string} phrase - The phrase that triggers the command.
   * @param {function(): CommandResponse | void} action - The function to execute when the phrase is recognized.
   */
  registerCommand(phrase: string, action: () => CommandResponse | void): void {
    this.commands.set(phrase.toLowerCase(), action);
  }

  /**
   * Executes the action associated with the recognized phrase.
   * @param {string} phrase - The recognized phrase.
   * @returns {CommandResponse | void} - The response from the executed command.
   */
  executeCommand(phrase: string): CommandResponse | void {
    const action = this.commands.get(phrase.toLowerCase());
    if (action) {
      const response = action();
      if (response?.callback) {
        response.callback();
      }
      return response;
    } else {
      console.warn(`No command found for phrase: "${phrase}"`);
      return;
    }
  }
}
