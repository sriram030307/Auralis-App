import { createContext, useContext, useEffect, useRef } from "react";
import useSafetyEngine from "@/hooks/useSafetyEngine";
import { useAuth } from "@/lib/AuthContext";
import {
  triggerFullEmergencyAlert,
  triggerRiskAlert,
  registerServiceWorker,
  requestNotificationPermission,
} from "@/lib/notifications";

const SafetyEngineContext = createContext(null);

function SafetyEngineProviderInner({ children, engine }) {
  const { user } = useAuth();
  const prevLevelRef = useRef(null);
  const emergencyFiredRef = useRef(false);
  const riskAlertCooldownRef = useRef(0);

  // Register SW + request permissions on mount (once)
  useEffect(() => {
    registerServiceWorker();
    requestNotificationPermission();
  }, []);

  // Watch risk level changes and fire appropriate alerts
  useEffect(() => {
    const currentLevel = engine.status?.level;
    const prevLevel = prevLevelRef.current;

    if (prevLevel === null) {
      prevLevelRef.current = currentLevel;
      return;
    }

    const userName = user?.full_name || "Auralis User";

    // EMERGENCY (level 3) — full alert: push + email + audio recording
    if (currentLevel === 3 && prevLevel !== 3 && !emergencyFiredRef.current) {
      emergencyFiredRef.current = true;
      triggerFullEmergencyAlert({
        location: engine.location,
        trigger: "AI Risk Score reached EMERGENCY level",
        userName,
      });
    }

    // Elevated Risk (level 2) — lighter alert, cooldown 10 min
    if (currentLevel === 2 && prevLevel < 2) {
      const now = Date.now();
      if (now - riskAlertCooldownRef.current > 10 * 60 * 1000) {
        riskAlertCooldownRef.current = now;
        triggerRiskAlert({ level: "Elevated Risk", location: engine.location, userName });
      }
    }

    // Reset emergency flag when score recovers
    if (currentLevel < 3) {
      emergencyFiredRef.current = false;
    }

    prevLevelRef.current = currentLevel;
  }, [engine.status?.level, engine.location, user?.full_name]);

  // Crash detected — immediate emergency
  useEffect(() => {
    if (!engine.crashDetected) return;
    const userName = user?.full_name || "Auralis User";
    triggerFullEmergencyAlert({
      location: engine.location,
      trigger: "Crash / High-impact collision detected",
      userName,
    });
  }, [engine.crashDetected]);

  // Fall detected — emergency
  useEffect(() => {
    if (!engine.fallDetected) return;
    const userName = user?.full_name || "Auralis User";
    triggerFullEmergencyAlert({
      location: engine.location,
      trigger: "Fall / sudden impact detected",
      userName,
    });
  }, [engine.fallDetected]);

  return (
    <SafetyEngineContext.Provider value={engine}>
      {children}
    </SafetyEngineContext.Provider>
  );
}

export function SafetyEngineProvider({ children }) {
  const engine = useSafetyEngine();
  return <SafetyEngineProviderInner engine={engine}>{children}</SafetyEngineProviderInner>;
}

export function useSafetyEngineContext() {
  const ctx = useContext(SafetyEngineContext);
  if (!ctx) throw new Error("useSafetyEngineContext must be used within SafetyEngineProvider");
  return ctx;
}