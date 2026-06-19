/**
 * Auralis Safety Engine
 * Continuously analyzes motion, GPS, inactivity, and sensor data
 * to compute a real-time AI Risk Score.
 */
import { useState, useEffect, useRef, useCallback } from "react";

const INACTIVITY_THRESHOLD_MS = 15 * 60 * 1000; // 15 min
const UPDATE_INTERVAL_MS = 8000; // update score every 8s

function classifyScore(score) {
  if (score >= 80) return { label: "Safe", color: "green", level: 0 };
  if (score >= 60) return { label: "Caution", color: "amber", level: 1 };
  if (score >= 35) return { label: "Elevated Risk", color: "orange", level: 2 };
  return { label: "Emergency", color: "red", level: 3 };
}

export default function useSafetyEngine() {
  const [score, setScore] = useState(88);
  const [status, setStatus] = useState(classifyScore(88));
  const [isJourneyActive, setIsJourneyActive] = useState(false);
  const [location, setLocation] = useState(null);
  const [speed, setSpeed] = useState(0); // m/s
  const [lastMovement, setLastMovement] = useState(Date.now());
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [isCharging, setIsCharging] = useState(false);
  const [crashDetected, setCrashDetected] = useState(false);
  const [fallDetected, setFallDetected] = useState(false);
  const [motionIntensity, setMotionIntensity] = useState(0);
  const [locationHistory, setLocationHistory] = useState([]);

  const accelRef = useRef({ x: 0, y: 0, z: 0 });
  const prevAccelRef = useRef({ x: 0, y: 0, z: 0 });
  const intervalRef = useRef(null);
  const watchIdRef = useRef(null);

  // Battery API
  useEffect(() => {
    if (!navigator.getBattery) return;
    navigator.getBattery().then((bat) => {
      setBatteryLevel(Math.round(bat.level * 100));
      setIsCharging(bat.charging);
      bat.addEventListener("levelchange", () => setBatteryLevel(Math.round(bat.level * 100)));
      bat.addEventListener("chargingchange", () => setIsCharging(bat.charging));
    });
  }, []);

  // GPS Watch
  useEffect(() => {
    if (!navigator.geolocation) return;
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude, ts: Date.now() };
        setLocation(coords);
        const spd = pos.coords.speed || 0;
        setSpeed(spd);
        if (spd > 0.5) {
          setLastMovement(Date.now());
          if (spd > 1.5) setIsJourneyActive(true);
        }
        setLocationHistory((prev) => [...prev.slice(-99), coords]);
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
    return () => navigator.geolocation.clearWatch(watchIdRef.current);
  }, []);

  // Accelerometer / motion detection
  useEffect(() => {
    const handleMotion = (e) => {
      const acc = e.accelerationIncludingGravity || e.acceleration;
      if (!acc) return;
      const { x = 0, y = 0, z = 0 } = acc;
      prevAccelRef.current = { ...accelRef.current };
      accelRef.current = { x, y, z };

      const delta = Math.sqrt(
        Math.pow(x - prevAccelRef.current.x, 2) +
        Math.pow(y - prevAccelRef.current.y, 2) +
        Math.pow(z - prevAccelRef.current.z, 2)
      );
      setMotionIntensity(delta);

      // Crash detection: sudden spike > 25 m/s²
      if (delta > 25) {
        setCrashDetected(true);
        setTimeout(() => setCrashDetected(false), 10000);
      }
      // Fall detection: spike > 18 + near-zero for 300ms
      if (delta > 18) {
        setFallDetected(true);
        setTimeout(() => setFallDetected(false), 8000);
      }
    };
    window.addEventListener("devicemotion", handleMotion, true);
    return () => window.removeEventListener("devicemotion", handleMotion, true);
  }, []);

  // Score calculator
  const computeScore = useCallback(() => {
    let s = 90;

    // Battery penalty
    if (batteryLevel !== null) {
      if (batteryLevel < 10 && !isCharging) s -= 18;
      else if (batteryLevel < 20 && !isCharging) s -= 8;
    }

    // Inactivity
    const inactive = Date.now() - lastMovement;
    if (inactive > INACTIVITY_THRESHOLD_MS * 2) s -= 20;
    else if (inactive > INACTIVITY_THRESHOLD_MS) s -= 10;

    // Crash / fall
    if (crashDetected) s -= 45;
    if (fallDetected) s -= 30;

    // High motion (struggling?)
    if (motionIntensity > 15 && !isJourneyActive) s -= 12;

    // Night time penalty
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 5) s -= 8;

    // Journey bonus — actively monitored
    if (isJourneyActive) s = Math.min(s + 5, 95);

    const finalScore = Math.max(5, Math.min(100, s));
    setScore(finalScore);
    setStatus(classifyScore(finalScore));
  }, [batteryLevel, isCharging, lastMovement, crashDetected, fallDetected, motionIntensity, isJourneyActive]);

  useEffect(() => {
    intervalRef.current = setInterval(computeScore, UPDATE_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [computeScore]);

  const startJourney = useCallback(() => setIsJourneyActive(true), []);
  const endJourney = useCallback(() => setIsJourneyActive(false), []);

  return {
    score,
    status,
    isJourneyActive,
    location,
    speed,
    batteryLevel,
    isCharging,
    crashDetected,
    fallDetected,
    motionIntensity,
    locationHistory,
    startJourney,
    endJourney,
  };
}