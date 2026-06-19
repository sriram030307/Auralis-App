import { useEffect, useRef, useCallback } from "react";

// Primary SOS phrases (Hindi + English)
const TRIGGER_PHRASES = [
  "help", "help me", "help help",
  "bachao", "bachao mujhe", "bachao bachao",
  "madad", "madad karo",
  "emergency", "sos",
  "save me", "danger",
  "koi hai", "koi bachao",
];

const SENSITIVITY_KEY = "auralis_voice_sensitivity";

function getThreshold() {
  try {
    const level = localStorage.getItem(SENSITIVITY_KEY) || "medium";
    const map = { low: 1, medium: 2, high: 3 };
    return map[level] || 2;
  } catch {
    return 2;
  }
}

/**
 * Continuously listens 24/7 for trigger phrases using the Web Speech API.
 * Auto-restarts on end to keep listening in background.
 *
 * Sensitivity mode (via localStorage 'auralis_voice_sensitivity'):
 *   low (1 hit)  — triggers on first detection
 *   medium (2 hits) — default, needs two quick detections
 *   high (3 hits) — needs three detections for fewer false alarms
 *
 * Calls onTrigger(transcript) when threshold is met.
 */
export default function useVoiceCommand(onTrigger, enabled = true) {
  const recognitionRef = useRef(null);
  const enabledRef = useRef(enabled);
  const onTriggerRef = useRef(onTrigger);
  const restartTimerRef = useRef(null);
  const isRunningRef = useRef(false);
  const hitCountRef = useRef(0);
  const hitTimerRef = useRef(null);

  useEffect(() => { enabledRef.current = enabled; }, [enabled]);
  useEffect(() => { onTriggerRef.current = onTrigger; }, [onTrigger]);

  const start = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    if (!enabledRef.current || isRunningRef.current) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "hi-IN";

      recognition.onstart = () => { isRunningRef.current = true; };

      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript.toLowerCase().trim();
          if (TRIGGER_PHRASES.some(phrase => transcript.includes(phrase))) {
            clearTimeout(hitTimerRef.current);
            hitCountRef.current += 1;

            if (hitCountRef.current >= getThreshold()) {
              hitCountRef.current = 0;
              onTriggerRef.current(transcript);
            } else {
              hitTimerRef.current = setTimeout(() => { hitCountRef.current = 0; }, 3000);
            }
          }
        }
      };

      recognition.onend = () => {
        isRunningRef.current = false;
        if (enabledRef.current) {
          restartTimerRef.current = setTimeout(() => start(), 200);
        }
      };

      recognition.onerror = () => {
        isRunningRef.current = false;
        if (enabledRef.current) {
          restartTimerRef.current = setTimeout(() => start(), 1000);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (_) {
      isRunningRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      start();
    } else {
      clearTimeout(restartTimerRef.current);
      recognitionRef.current?.stop();
      isRunningRef.current = false;
    }
    return () => {
      clearTimeout(restartTimerRef.current);
      clearTimeout(hitTimerRef.current);
      recognitionRef.current?.stop();
      isRunningRef.current = false;
    };
  }, [enabled, start]);
}