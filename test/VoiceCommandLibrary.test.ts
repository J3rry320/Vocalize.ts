import { Vocalize } from "../src/Vocalize";
import { Command } from "../src/types";

class MockSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: Event) => void) | null;
  onerror: ((event: Event) => void) | null;

  constructor() {
    this.lang = "en-US";
    this.continuous = false;
    this.interimResults = false;
    this.onresult = null;
    this.onerror = null;
  }

  start() {}
  stop() {}

  // Method to simulate recognition results
  simulateResult(event: any) {
    if (this.onresult) {
      this.onresult(event);
    }
  }
}

// Ensure SpeechRecognition is correctly mocked
globalThis.SpeechRecognition = MockSpeechRecognition;
globalThis.webkitSpeechRecognition = MockSpeechRecognition;

describe("VoiceCommandLibrary", () => {
  let mockRecognition: MockSpeechRecognition;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a new instance of MockSpeechRecognition for each test
    mockRecognition = new MockSpeechRecognition();

    // Spy on methods
    jest
      .spyOn(globalThis.speechSynthesis, "speak")
      .mockImplementation(jest.fn());
    jest.spyOn(globalThis.speechSynthesis, "getVoices").mockReturnValue([
      {
        name: "Google US English",
        lang: "en-US",
        default: false,
        localService: true,
        voiceURI: "googleusenglish",
      },
    ]);

    // Replace SpeechRecognition with mock
    globalThis.SpeechRecognition = jest.fn(() => mockRecognition) as any;
  });

  it("should register and recognize commands with custom TTS options", () => {
    const mockAction = jest.fn(() => ({
      text: "Test",
      speak: true,
      options: { volume: 0.5, rate: 1.5 },
    }));
    const commands: Command[] = [
      { phrase: "test command", action: mockAction },
    ];

    const library = new Vocalize({
      ttsOptions: { volume: 1.0, rate: 1.0 },
    });
    library.registerCommands(commands);

    // Simulate speech recognition by invoking the mock directly
    mockRecognition.simulateResult({
      results: [[{ transcript: "test command" }]],
    });

    expect(mockAction).toHaveBeenCalled();
    expect(globalThis.speechSynthesis.speak).toHaveBeenCalledWith(
      expect.objectContaining({
        text: "Test",
        volume: 1.0, // Verify that the default TTS options are applied
        rate: 1.0,
      })
    );
  });

  it("should allow custom speech recognition options", () => {
    const recognitionOptions = {
      lang: "es-ES",
      continuous: true,
    };

    const library = new Vocalize({ recognitionOptions });

    // Use the private property to access the recognizer and check options
    const recognizer = (library as any).speechRecognizer;
    expect(recognizer.recognition.lang).toBe("es-ES");
    expect(recognizer.recognition.continuous).toBe(true);
  });
});
