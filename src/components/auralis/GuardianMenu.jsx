/**
 * Guardian Hub — bottom sheet that gives quick access to all Guardian features.
 * Rendered inside MobileLayout, triggered from Dashboard.
 */
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X, Users, Navigation, BarChart2, Shield, Globe, BookOpen } from "lucide-react";

const items = [
  { icon: Users, label: "Guardian Network", path: "/guardian", color: "text-primary bg-primary/10" },
  { icon: Navigation, label: "Journey Protection", path: "/journey", color: "text-green-400 bg-green-500/10" },
  { icon: BarChart2, label: "Safety Analytics", path: "/analytics", color: "text-amber-400 bg-amber-500/10" },
  { icon: Shield, label: "Safety Modes", path: "/modes", color: "text-accent bg-accent/10" },
  { icon: Globe, label: "Community Safety", path: "/community", color: "text-blue-400 bg-blue-500/10" },
  { icon: BookOpen, label: "Incident Center", path: "/incidents", color: "text-red-400 bg-red-500/10" },
];

export default function GuardianMenu({ open, onClose }) {
  const navigate = useNavigate();

  const go = (path) => { onClose(); navigate(path); };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto glass-strong rounded-t-3xl px-5 pt-4 pb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-heading font-bold text-lg">Guardian Hub</h2>
                <p className="text-xs text-muted-foreground">AI-powered safety features</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 glass rounded-xl flex items-center justify-center">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => go(item.path)}
                    className="flex flex-col items-center gap-2 glass rounded-2xl p-3"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold text-center leading-tight">{item.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}