import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, X } from "lucide-react";

export default function CrashAlert({ crashDetected, fallDetected }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [type, setType] = useState("");

  useEffect(() => {
    if (crashDetected) { setType("Vehicle Crash Detected"); setVisible(true); setCountdown(10); }
  }, [crashDetected]);

  useEffect(() => {
    if (fallDetected) { setType("Severe Fall Detected"); setVisible(true); setCountdown(10); }
  }, [fallDetected]);

  useEffect(() => {
    if (!visible) return;
    if (countdown <= 0) { navigate("/emergency-alert"); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [visible, countdown, navigate]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -80 }}
          className="fixed top-4 left-4 right-4 z-[9999] glass-strong border border-destructive/50 rounded-2xl p-4 shadow-2xl shadow-destructive/20"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-5 h-5 text-destructive animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="font-heading font-bold text-destructive text-sm">{type}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Emergency SOS activating in <span className="text-destructive font-bold">{countdown}s</span>. Tap to cancel.
              </p>
            </div>
            <button onClick={() => setVisible(false)} className="w-7 h-7 rounded-lg glass flex items-center justify-center">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
          <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 10, ease: "linear" }}
              className="h-full bg-destructive rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}