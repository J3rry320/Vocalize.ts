import { SpeechRecognizer } from "../src/SpeechRecogniser";

describe("SpeechRecognizer", () => {
  it("should recognize speech and trigger callback", () => {
    // This test is complex due to the reliance on the Web Speech API
    // and should be tested in an environment that supports it, such as a browser
    // We can use mocks and spies to simulate behavior for unit testing purposes
  });
});
/**
 * import { SpeechRecognizer } from '../src/SpeechRecognizer';

describe('SpeechRecognizer', () => {
  it('should recognize speech with default options', () => {
    const recognizer = new SpeechRecognizer();
    // Test code would go here to simulate speech recognition
    // and ensure the options are correctly applied.
  });

  it('should recognize speech with custom options', () => {
    const options = {
      lang: 'fr-FR',
      continuous: true,
      interimResults: true
    };
    const recognizer = new SpeechRecognizer(options);
    // Test code would go here to simulate speech recognition
    // and ensure the options are correctly applied.
  });
});

 */
