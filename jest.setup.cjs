// Mock class for SpeechRecognition
class MockSpeechRecognition {
  constructor() {
    this.lang = "en-US";
    this.continuous = false;
    this.interimResults = false;
    this.onresult = null;
    this.onerror = null;
  }

  start = jest.fn();
  stop = jest.fn();

  // Method to simulate recognition results
  simulateResult(event) {
    if (this.onresult) {
      this.onresult(event);
    }
  }
}

// Mock class for SpeechSynthesisUtterance
class MockSpeechSynthesisUtterance {
  constructor(text) {
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

globalThis.speechSynthesis = {
  speak: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  cancel: jest.fn(),
  getVoices: jest.fn(() => mockVoices),
};

// Mock SpeechSynthesisUtterance
globalThis.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;

// Assign globalThis properties to `global` for Jest environment
globalThis.SpeechRecognition = MockSpeechRecognition;
globalThis.webkitSpeechRecognition = MockSpeechRecognition;
