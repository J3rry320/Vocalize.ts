import { SpeechSynthesizer } from "../src/SpeechSynthesizer";

describe("SpeechSynthesizer", () => {
  let synthesizer: SpeechSynthesizer;
  let mockVoice: SpeechSynthesisVoice;

  beforeEach(() => {
    synthesizer = new SpeechSynthesizer();
    mockVoice = {
      name: "Google US English",
      lang: "en-US",
      default: false,
      localService: true,
      voiceURI: "googleusenglish",
    };

    jest.spyOn(synthesizer, "getVoices").mockResolvedValue([mockVoice]);
  });

  it("should speak text with default options", () => {
    const spy = jest.spyOn(window.speechSynthesis, "speak");

    synthesizer.speak("Hello World");

    expect(spy).toHaveBeenCalled();
  });

  it("should speak text with custom options", () => {
    const spy = jest.spyOn(window.speechSynthesis, "speak");

    const options = {
      volume: 0.8,
      rate: 1.2,
      pitch: 1.5,
      voice: mockVoice,
    };

    synthesizer.speak("Hello World", options);

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        text: "Hello World",
        volume: options.volume,
        rate: options.rate,
        pitch: options.pitch,
        voice: options.voice,
      })
    );
  });

  test("should cancel any ongoing speech before speaking new text", () => {
    const synthesizer = new SpeechSynthesizer();
    const cancelSpy = jest.spyOn(window.speechSynthesis, "cancel");
    const speakSpy = jest.spyOn(window.speechSynthesis, "speak");

    // First speak call
    synthesizer.speak("First Text");
    // Second speak call should cancel the first
    synthesizer.speak("Second Text");

    expect(cancelSpy).toHaveBeenCalled();
    expect(speakSpy).toHaveBeenCalledTimes(2);
  });

  it("should handle errors during speech synthesis", () => {
    const utteranceErrorSpy = jest.fn();
    const errorMessage =
      "Speech synthesis error occurred. Please ensure that the user has interacted with the page.";

    const spy = jest
      .spyOn(window.speechSynthesis, "speak")
      .mockImplementationOnce(() => {
        throw new Error(errorMessage);
      });

    expect(() => synthesizer.speak("Test")).toThrowError(errorMessage);
    expect(spy).toHaveBeenCalled();
  });

  it("should preload voices successfully", async () => {
    await expect(synthesizer.preloadVoices()).resolves.not.toThrow();
  });

  test("should reject if voices did not load in time", async () => {
    jest.spyOn(synthesizer, "getVoices").mockImplementation(() => {
      return new Promise((resolve, reject) => {
        setTimeout(
          () => reject(new Error("Voices did not load in time")),
          6000
        );
      });
    });

    await expect(synthesizer.getVoices()).rejects.toThrow(
      "Voices did not load in time"
    );
  }, 10000); // Adjust the timeout if necessary

  it("should throw an error if SpeechSynthesis API is not supported", () => {
    const originalSpeechSynthesis = window.speechSynthesis;
    (window as any).speechSynthesis = undefined;
    delete (window as any).speechSynthesis;

    expect(() => new SpeechSynthesizer()).toThrow(
      "SpeechSynthesis API is not supported in this browser."
    );

    window.speechSynthesis = originalSpeechSynthesis;
  });

  test("should load voices on 'voiceschanged' event", async () => {
    const voiceChangeHandler = jest.fn();

    const synthesizer = new SpeechSynthesizer();

    Object.defineProperty(window.speechSynthesis, "onvoiceschanged", {
      set: (callback) => {
        callback && setTimeout(callback, 0); // Simulate the event trigger
      },
    });

    await synthesizer.getVoices();
    expect(voiceChangeHandler).toHaveBeenCalled();
  });
});
