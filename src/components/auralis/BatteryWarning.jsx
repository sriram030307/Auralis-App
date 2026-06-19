import { AnimatePresence, motion } from "framer-motion";
import { Battery } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BatteryWarning({ batteryLevel, isCharging }) {
  const navigate = useNavigate();
  const show = batteryLevel !== null && batteryLevel <= 15 && !isCharging;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          className="fixed bottom-28 left-4 right-4 z-40 glass-strong border border-amber-500/40 rounded-2xl p-3 flex items-center gap-3 max-w-md mx-auto"
        >
          <Battery className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-amber-400">Low Battery — {batteryLevel}%</p>
            <p className="text-[10px] text-muted-foreground">Emergency SOS still active. Charge soon.</p>
          </div>
          <button
            onClick={() => navigate("/emergency-alert")}
            className="text-[10px] font-bold text-destructive glass px-2 py-1 rounded-lg border border-destructive/30"
          >
            SOS
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}