// Mock class for SpeechRecognition
class MockSpeechRecognition {
  lang;
  continuous;
  interimResults;
  onresult;
  onerror;

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
  simulateResult(event) {
    if (this.onresult) {
      this.onresult(event);
    }
  }
}

globalThis.SpeechRecognition = MockSpeechRecognition;
globalThis.webkitSpeechRecognition = MockSpeechRecognition;
// Mock class for SpeechSynthesisUtterance
class MockSpeechSynthesisUtterance {
  text;
  constructor(text) {
    this.text = text;
  }
}

// Mock SpeechSynthesis
globalThis.speechSynthesis = {
  speak: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  cancel: jest.fn(),
  getVoices: jest.fn(() => [
    {
      name: "Google US English",
      lang: "en-US",
      default: false,
      localService: true,
      voiceURI: "googleusenglish",
    },
  ]),
};

// Mock SpeechSynthesisUtterance
globalThis.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
