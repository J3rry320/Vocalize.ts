import { SpeechRecognizer } from "../src/SpeechRecogniser";
import { RecognitionOptions } from "../src/types";

type SpeechRecognitionType = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: any) => void) | null;
  onerror: ((event: Event) => void) | null;
  onaudiostart?: ((event: Event) => void) | null;
  onsoundstart?: ((event: Event) => void) | null;
  onspeechstart?: ((event: Event) => void) | null;
  onspeechend?: ((event: Event) => void) | null;
  onsoundend?: ((event: Event) => void) | null;
  onaudioend?: ((event: Event) => void) | null;
  onend?: ((event: Event) => void) | null;
  onnomatch?: ((event: Event) => void) | null;
  onstart?: ((event: Event) => void) | null;

  start(): void;
  stop(): void;
  abort(): void;
};

// Define the mock interface extending from the alias
interface MockSpeechRecognition extends Partial<SpeechRecognitionType> {
  simulateResult(event: SpeechRecognitionResult): void;
  onerror: ((event: Event) => void) | null;
  start: jest.Mock;
  stop: jest.Mock;
}

// MockSpeechRecognitionConstructor does not need to reference SpeechRecognition
interface MockSpeechRecognitionConstructor {
  new (): MockSpeechRecognition;
}

describe("SpeechRecognizer", () => {
  let mockSpeechRecognition: MockSpeechRecognition;
  let MockSpeechRecognitionConstructor: MockSpeechRecognitionConstructor;

  beforeEach(() => {
    // Define the mock class
    class MockSpeechRecognitionImpl implements MockSpeechRecognition {
      lang: string = "en-US";
      continuous: boolean = false;
      interimResults: boolean = false;

      onresult: ((event: any) => void) | null = null;
      onerror: ((event: Event) => void) | null = null;

      start = jest.fn(); // Mock start function
      stop = jest.fn(); // Mock stop function

      simulateResult(event: any) {
        if (this.onresult) {
          this.onresult(event);
        }
      }
    }

    MockSpeechRecognitionConstructor =
      MockSpeechRecognitionImpl as unknown as MockSpeechRecognitionConstructor;

    // Mock SpeechRecognition API
    (globalThis as any).SpeechRecognition = MockSpeechRecognitionConstructor;
    (globalThis as any).webkitSpeechRecognition =
      MockSpeechRecognitionConstructor;

    mockSpeechRecognition = new (globalThis as any).SpeechRecognition();
  });

  afterEach(() => {
    // Clean up any global mocks
    delete (globalThis as any).SpeechRecognition;
    delete (globalThis as any).webkitSpeechRecognition;
  });

  it("should throw an error if SpeechRecognition is not supported", () => {
    // Clean up the global mock for SpeechRecognition
    delete (globalThis as any).SpeechRecognition;
    delete (globalThis as any).webkitSpeechRecognition;

    expect(() => new SpeechRecognizer()).toThrow(
      "SpeechRecognition is not supported in this browser."
    );
  });

  it("should initialize with default options", () => {
    const recognizer = new SpeechRecognizer();

    expect(recognizer["recognition"].lang).toBe("en-US");
    expect(recognizer["recognition"].continuous).toBe(false);
    expect(recognizer["recognition"].interimResults).toBe(false);
  });

  it("should initialize with custom options", () => {
    const options: RecognitionOptions = {
      lang: "fr-FR",
      continuous: true,
      interimResults: true,
    };
    const recognizer = new SpeechRecognizer(options);

    expect(recognizer["recognition"].lang).toBe("fr-FR");
    expect(recognizer["recognition"].continuous).toBe(true);
    expect(recognizer["recognition"].interimResults).toBe(true);
  });

  it("should call start on recognition when startListening is called", () => {
    const recognizer = new SpeechRecognizer();
    recognizer.startListening();

    expect(mockSpeechRecognition.start).toHaveBeenCalledTimes(1);
  });

  it("should call stop on recognition when stopListening is called", () => {
    const recognizer = new SpeechRecognizer();
    recognizer.stopListening();

    expect(mockSpeechRecognition.stop).toHaveBeenCalledTimes(1);
  });

  it("should trigger the onSpeechRecognized callback when speech is recognized", () => {
    const recognizer = new SpeechRecognizer();
    const callback = jest.fn();
    recognizer.onSpeechRecognized(callback);

    const mockEvent = {
      results: [[{ transcript: "hello world" }]],
    };

    mockSpeechRecognition.simulateResult(mockEvent as any);

    expect(callback).toHaveBeenCalledWith("hello world");
  });

  it("should trigger the onError callback when an error occurs", () => {
    const recognizer = new SpeechRecognizer();
    const callback = jest.fn();
    recognizer.onError(callback);

    const mockErrorEvent: Partial<any> = { error: "Network error" };
    if (mockSpeechRecognition.onerror) {
      mockSpeechRecognition.onerror(mockErrorEvent as Event);
    }

    expect(callback).toHaveBeenCalledWith(new Error("Network error"));
  });
  it("should throw an error if recognition fails to start", () => {
    const recognizer = new SpeechRecognizer();

    mockSpeechRecognition.start = jest.fn(() => {
      throw new Error("Failed to start recognition");
    });

    expect(() => recognizer.startListening()).toThrow(
      "Failed to start recognition"
    );
  });

  it("should handle recognition results correctly", () => {
    const recognizer = new SpeechRecognizer();
    const callback = jest.fn();
    recognizer.onSpeechRecognized(callback);

    const mockEvent = {
      results: [[{ transcript: "test speech" }]],
    };

    mockSpeechRecognition.simulateResult(mockEvent as any);

    expect(callback).toHaveBeenCalledWith("test speech");
  });

  it("should handle recognition errors correctly", () => {
    const recognizer = new SpeechRecognizer();
    const callback = jest.fn();
    recognizer.onError(callback);

    const mockErrorEvent: Partial<any> = { error: "Microphone not accessible" };

    if (mockSpeechRecognition.onerror) {
      mockSpeechRecognition.onerror(mockErrorEvent as Event);
    }

    expect(callback).toHaveBeenCalledWith(
      new Error("Microphone not accessible")
    );
  });
});
