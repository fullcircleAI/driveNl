let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speak(text: string, lang: 'en' | 'nl' = 'en') {
  stop();
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();
  // Prefer native female voice for the language (by name)
  const preferredVoice = voices.find(v => v.lang.startsWith(lang) && v.name.toLowerCase().includes('female'))
    || voices.find(v => v.lang.startsWith(lang));
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang === 'nl' ? 'nl-NL' : 'en-US';
  if (preferredVoice) utter.voice = preferredVoice;
  utter.rate = 1;
  utter.pitch = 1;
  currentUtterance = utter;
  synth.speak(utter);
}

export function stop() {
  window.speechSynthesis.cancel();
  currentUtterance = null;
} 