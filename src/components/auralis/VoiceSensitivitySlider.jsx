import { useState, useEffect } from "react";
import { Mic, SlidersHorizontal } from "lucide-react";

const STORAGE_KEY = "auralis_voice_sensitivity";

// sensitivity: "low" (easy trigger) | "medium" (default) | "high" (must be very clear)
// This controls how many times the phrase must be detected in quick succession
// before the SOS is triggered.
const SENSITIVITY_CONFIG = {
  low: { label: "Easy", description: "Detects quickly — may trigger on faint whispers", threshold: 1, color: "bg-amber-500" },
  medium: { label: "Balanced", description: "Standard detection — clear speech needed", threshold: 2, color: "bg-primary" },
  high: { label: "Precise", description: "Must be spoken clearly and loudly — fewer false alarms", threshold: 3, color: "bg-green-500" },
};

export function getVoiceSensitivity() {
  try {
    return localStorage.getItem(STORAGE_KEY) || "medium";
  } catch { return "medium"; }
}

export function setVoiceSensitivity(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {}
}

export function getVoiceThreshold() {
  const level = getVoiceSensitivity();
  return SENSITIVITY_CONFIG[level]?.threshold ?? 2;
}

export default function VoiceSensitivitySlider() {
  const [sensitivity, setSensitivity] = useState("medium");
  const [sliderValue, setSliderValue] = useState(50);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const saved = getVoiceSensitivity();
    setSensitivity(saved);
    // Map sensitivity to slider position
    const map = { low: 0, medium: 50, high: 100 };
    setSliderValue(map[saved] ?? 50);
  }, []);

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value);
    setSliderValue(val);
    if (val < 25) updateSensitivity("low");
    else if (val < 75) updateSensitivity("medium");
    else updateSensitivity("high");
    setShowTooltip(true);
  };

  const updateSensitivity = (level) => {
    setSensitivity(level);
    setVoiceSensitivity(level);
  };

  const handleTap = (level) => {
    updateSensitivity(level);
    const map = { low: 0, medium: 50, high: 100 };
    setSliderValue(map[level]);
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  const config = SENSITIVITY_CONFIG[sensitivity];

  return (
    <div className="relative">
      <div onMouseLeave={() => setShowTooltip(false)} onTouchEnd={() => setTimeout(() => setShowTooltip(false), 1500)}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Voice Sensitivity</p>
              <p className="text-[11px] text-muted-foreground">
                {config.label} — {config.description}
              </p>
            </div>
          </div>
        </div>

        {/* Three tappable zones */}
        <div className="flex gap-1.5 mb-2">
          {Object.entries(SENSITIVITY_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => handleTap(key)}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                sensitivity === key
                  ? `${cfg.color} text-white`
                  : "glass text-muted-foreground"
              }`}
            >
              {cfg.label}
            </button>
          ))}
        </div>

        {/* Visual slider */}
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={handleSliderChange}
            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-muted accent-primary"
            style={{
              background: `linear-gradient(to right, #f59e0b 0%, #3b82f6 50%, #22c55e 100%)`,
            }}
          />
          <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
            <Mic className="w-3 h-3 text-amber-400" />
            <Mic className="w-3 h-3 text-primary" />
            <Mic className="w-3 h-3 text-green-400" />
          </div>
        </div>

        {/* Tooltip */}
        {showTooltip && (
          <div className={`mt-2 px-3 py-1.5 rounded-lg text-[10px] font-medium text-center ${config.color} text-white bg-opacity-90`}>
            {config.label} mode — {config.description}
          </div>
        )}
      </div>
    </div>
  );
}