import { SpeechSynthesizer } from "../src/SpeechSynthesizer";

describe("SpeechSynthesizer", () => {
  it("should speak text with default options", () => {
    const synthesizer = new SpeechSynthesizer();
    const spy = jest.spyOn(window.speechSynthesis, "speak");

    synthesizer.speak("Hello World");

    expect(spy).toHaveBeenCalled();
  });

  it("should speak text with custom options", () => {
    const synthesizer = new SpeechSynthesizer();
    const spy = jest.spyOn(window.speechSynthesis, "speak");

    // Mock the voice list
    const mockVoice: SpeechSynthesisVoice = {
      name: "Google US English",
      lang: "en-US",
      default: false,
      localService: true,
      voiceURI: "googleusenglish",
    };
    jest.spyOn(synthesizer, "getVoices").mockReturnValue([mockVoice]);

    const options = {
      volume: 0.8,
      rate: 1.2,
      pitch: 1.5,
      voice: mockVoice,
    };

    synthesizer.speak("Hello World", options);

    // Verify that speak was called with a SpeechSynthesisUtterance object
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
});
