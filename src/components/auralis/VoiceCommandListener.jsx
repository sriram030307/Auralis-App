import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, ShieldAlert } from "lucide-react";
import useVoiceCommand from "@/hooks/useVoiceCommand";
import { triggerFullEmergencyAlert } from "@/lib/notifications";
import { useAuth } from "@/lib/AuthContext";
import { useSafetyEngineContext } from "@/contexts/SafetyEngineContext";

const COOLDOWN_MS = 30_000;

export default function VoiceCommandListener() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { location } = useSafetyEngineContext();
  const [triggered, setTriggered] = useState(false);
  const [showIndicator, setShowIndicator] = useState(true);
  const lastTriggeredRef = useRef(0);

  const handleTrigger = useCallback(async (transcript) => {
    const now = Date.now();
    if (now - lastTriggeredRef.current < COOLDOWN_MS) return;
    lastTriggeredRef.current = now;
    setTriggered(true);

    // Full emergency: push notification + email + audio + DB
    triggerFullEmergencyAlert({
      location,
      trigger: `Voice SOS detected: "${transcript}"`,
      userName: user?.full_name || "Auralis User",
    });

    navigate("/emergency-alert");
    setTimeout(() => setTriggered(false), 3000);
  }, [location, navigate, user?.full_name]);

  useVoiceCommand(handleTrigger, true);

  useEffect(() => {
    const t = setTimeout(() => setShowIndicator(false), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Brief mic-active confirmation on mount */}
      <AnimatePresence>
        {showIndicator && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-xs text-muted-foreground whitespace-nowrap"
          >
            <Mic className="w-3 h-3 text-primary animate-pulse" />
            Voice guard active — say <strong className="text-foreground ml-0.5">"help" or "bachao"</strong>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SOS triggered flash */}
      <AnimatePresence>
        {triggered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-destructive/25 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center gap-3 glass-strong rounded-3xl p-8 border border-destructive/40"
            >
              <ShieldAlert className="w-16 h-16 text-destructive" />
              <p className="font-heading font-bold text-destructive text-xl">SOS Triggered</p>
              <p className="text-xs text-muted-foreground">Notifying emergency contacts...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}