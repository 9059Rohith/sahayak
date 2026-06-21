import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Web Speech API wrapper: speech-to-text (recognition) + text-to-speech.
 *
 * Designed to degrade gracefully: if the browser doesn't support the APIs, the
 * `supported` flags are false and the UI falls back to typed input only.
 *
 * @param {"en"|"hi"} lang current language
 */
export function useSpeech(lang) {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const recognitionRef = useRef(null);

  const localeFor = (l) => (l === "hi" ? "hi-IN" : "en-IN");

  const sttSupported =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);
  const ttsSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  /** Start listening. Resolves the final transcript via onResult callback. */
  const startListening = useCallback(
    (onResult) => {
      if (!sttSupported) return;
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = localeFor(lang);
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onresult = (event) => {
        let finalText = "";
        let interimText = "";
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalText += t;
          else interimText += t;
        }
        setInterim(interimText);
        if (finalText) {
          setInterim("");
          onResult?.(finalText.trim());
        }
      };
      recognition.onerror = () => setListening(false);
      recognition.onend = () => {
        setListening(false);
        setInterim("");
      };

      recognitionRef.current = recognition;
      setListening(true);
      recognition.start();
    },
    [lang, sttSupported],
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  /** Speak text aloud in the current language. */
  const speak = useCallback(
    (text) => {
      if (!ttsSupported || !text) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = localeFor(lang);
      utterance.rate = 0.98;
      window.speechSynthesis.speak(utterance);
    },
    [lang, ttsSupported],
  );

  const stopSpeaking = useCallback(() => {
    if (ttsSupported) window.speechSynthesis.cancel();
  }, [ttsSupported]);

  // Cleanup on unmount.
  useEffect(() => () => {
    recognitionRef.current?.abort?.();
    if (ttsSupported) window.speechSynthesis.cancel();
  }, [ttsSupported]);

  return {
    listening,
    interim,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    sttSupported: Boolean(sttSupported),
    ttsSupported: Boolean(ttsSupported),
  };
}
