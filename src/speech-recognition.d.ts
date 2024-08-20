interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognition extends EventTarget {
  readonly grammars: SpeechGrammarList;
  readonly lang: string;
  readonly continuous: boolean;
  readonly interimResults: boolean;
  readonly maxAlternatives: number;

  start(): void;
  stop(): void;
  abort(): void;

  onresult:
    | ((this: SpeechRecognition, event: SpeechRecognitionEvent) => void)
    | null;
  onerror: ((this: SpeechRecognition, event: Event) => void) | null;
  onend: ((this: SpeechRecognition) => void) | null;
  onsoundstart: ((this: SpeechRecognition) => void) | null;
  onsoundend: ((this: SpeechRecognition) => void) | null;
  onsoundunavailable: ((this: SpeechRecognition) => void) | null;
  onnomatch: ((this: SpeechRecognition) => void) | null;
  onstart: ((this: SpeechRecognition) => void) | null;
}

interface SpeechGrammarList {
  readonly length: number;
  item(index: number): SpeechGrammar;
  addFromURI(uri: string, weight?: number): void;
  addFromString(string: string, weight?: number): void;
}

interface SpeechGrammar {
  readonly src: string;
  readonly weight: number;
}

interface Window {
  //@ts-ignore
  SpeechRecognition: typeof SpeechRecognition;
  //@ts-ignore
  webkitSpeechRecognition: typeof SpeechRecognition;
}
