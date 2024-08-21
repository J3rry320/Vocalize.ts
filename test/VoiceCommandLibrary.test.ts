import { Vocalize } from "../src/Vocalize";
import { Command } from "../src/types";

class MockSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: any) => void) | null;
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

  simulateResult(event: any) {
    if (this.onresult) {
      this.onresult(event);
    }
  }
}

class MockSpeechSynthesisUtterance {
  text: string;

  constructor(text: string) {
    this.text = text;
  }
}

// Mock SpeechSynthesis
const mockVoices = [
  {
    name: "Google US English",
    lang: "en-US",
    default: false,
    localService: true,
    voiceURI: "googleusenglish",
  },
];

(globalThis as any).speechSynthesis = {
  speak: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  cancel: jest.fn(),
  getVoices: jest.fn(() => mockVoices),
};

(globalThis as any).SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;

describe("VoiceCommandLibrary", () => {
  let mockRecognition: MockSpeechRecognition;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRecognition = new MockSpeechRecognition();

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

    (globalThis as any).SpeechRecognition = jest.fn(
      () => mockRecognition
    ) as any;
  });

  it("should register and recognize commands with custom TTS options", () => {
    const mockAction = jest.fn(() => ({
      text: "Test",
      speak: true,
      options: { volume: 0.5, rate: 1.5 },
      callback: () => {},
    }));
    const commands: Command[] = [
      { phrase: "test command", action: mockAction },
    ];

    const library = new Vocalize({
      ttsOptions: { volume: 1.0, rate: 1.0 },
    });
    library.registerCommands(commands);

    mockRecognition.simulateResult({
      results: [[{ transcript: "test command" }]],
    });

    expect(mockAction).toHaveBeenCalled();
    expect(globalThis.speechSynthesis.speak).toHaveBeenCalledWith(
      expect.objectContaining({
        text: "Test",
        volume: 0.5,
        rate: 1.5,
      })
    );
  });

  it("should allow custom speech recognition options", () => {
    const recognitionOptions = {
      lang: "es-ES",
      continuous: true,
    };

    const library = new Vocalize({ recognitionOptions });

    const recognizer = (library as any).speechRecognizer;
    expect(recognizer.recognition.lang).toBe("es-ES");
    expect(recognizer.recognition.continuous).toBe(true);
  });

  test("should invoke error callback on speech recognition error", () => {
    const mockRecognition = new MockSpeechRecognition();
    const onErrorMock = jest.fn();
    const library = new Vocalize({ onError: onErrorMock });

    const errorEvent = new Error("Unknown error") as any;

    mockRecognition.onerror?.(errorEvent);

    expect(onErrorMock).toHaveBeenCalledWith(errorEvent);
  });

  it("should stop listening when stopListening is called", () => {
    const stopSpy = jest.spyOn(mockRecognition, "stop");

    const library = new Vocalize();
    library.stopListening();

    expect(stopSpy).toHaveBeenCalled();
  });

  it("should correctly update TTS options", () => {
    const library = new Vocalize();
    const newOptions = { volume: 0.75, rate: 1.2 };

    library.setTTSOptions(newOptions);
    expect((library as any).ttsOptions).toEqual(newOptions);
  });

  it("should handle custom command callback function", () => {
    const mockCallback = jest.fn();
    const mockAction = jest.fn(() => ({
      text: "Test",
      speak: true,
      callback: mockCallback,
    }));
    const commands: Command[] = [
      { phrase: "test command", action: mockAction },
    ];

    const library = new Vocalize();
    library.registerCommands(commands);

    mockRecognition.simulateResult({
      results: [[{ transcript: "test command" }]],
    });

    expect(mockCallback).toHaveBeenCalled();
  });

  it("should handle onCommandRecognized callback function", () => {
    const mockOnCommandRecognized = jest.fn();

    const library = new Vocalize({
      onCommandRecognized: mockOnCommandRecognized,
    });

    const mockAction = jest.fn(() => ({
      text: "Test",
      speak: false,
    }));

    const commands: Command[] = [
      { phrase: "test command", action: mockAction },
    ];

    library.registerCommands(commands);

    mockRecognition.simulateResult({
      results: [[{ transcript: "test command" }]],
    });

    expect(mockOnCommandRecognized).toHaveBeenCalledWith(commands[0]);
  });
});
