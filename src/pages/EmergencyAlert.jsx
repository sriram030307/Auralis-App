import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Phone, MapPin, X, Check, Loader2, Radio, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  { label: "Activating emergency protocol...", icon: ShieldAlert, duration: 1500 },
  { label: "Capturing location data...", icon: MapPin, duration: 1200 },
  { label: "Notifying emergency contacts...", icon: Users, duration: 1800 },
  { label: "Broadcasting alert signal...", icon: Radio, duration: 1000 },
];

const emergencyNumbers = [
  { label: "Police", number: "100", emoji: "🚔" },
  { label: "Ambulance", number: "108", emoji: "🚑" },
  { label: "Women Helpline", number: "1091", emoji: "🆘" },
];

export default function EmergencyAlert() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (cancelled) return;
    if (currentStep >= steps.length) { setCompleted(true); return; }
    const timer = setTimeout(() => setCurrentStep((s) => s + 1), steps[currentStep].duration);
    return () => clearTimeout(timer);
  }, [currentStep, cancelled]);

  const handleCancel = () => { setCancelled(true); setTimeout(() => navigate("/"), 500); };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-destructive/10 via-background to-background" />
      <motion.div animate={{ opacity: [0.05, 0.15, 0.05] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-destructive/10" />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-24 h-24 rounded-full bg-destructive/20 flex items-center justify-center mb-8 glow-red">
          <ShieldAlert className="w-12 h-12 text-destructive" />
        </motion.div>

        {!completed ? (
          <>
            <h1 className="font-heading text-2xl font-bold text-destructive mb-2">EMERGENCY SOS</h1>
            <p className="text-sm text-muted-foreground mb-8 text-center">Alert is being sent to your emergency contacts</p>

            <div className="w-full space-y-3 mb-10">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const isDone = i < currentStep;
                const isActive = i === currentStep;
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }}
                    className={`flex items-center gap-3 glass rounded-xl px-4 py-3 ${isDone ? "border-green-500/30" : isActive ? "border-destructive/30" : ""}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDone ? "bg-green-500/20" : isActive ? "bg-destructive/20" : "bg-muted"}`}>
                      {isDone ? <Check className="w-4 h-4 text-green-400" /> : isActive ? <Loader2 className="w-4 h-4 text-destructive animate-spin" /> : <Icon className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <span className={`text-sm ${isDone ? "text-green-400" : isActive ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</span>
                  </motion.div>
                );
              })}
            </div>

            <Button onClick={handleCancel} variant="outline" className="w-full h-12 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 gap-2">
              <X className="w-4 h-4" /> Cancel Alert
            </Button>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center w-full">
            <h1 className="font-heading text-2xl font-bold text-green-400 mb-2">Alert Sent!</h1>
            <p className="text-sm text-muted-foreground mb-6">3 emergency contacts have been notified with your location.</p>

            <div className="glass rounded-2xl p-5 mb-4 space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">Your Location</p>
                  <p className="text-sm font-medium">Tracked via GPS</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">Emergency Services</p>
                  <p className="text-sm font-medium">Ready to connect</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {emergencyNumbers.map((e) => (
                <motion.a key={e.number} href={`tel:${e.number}`} whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-destructive/10 border border-destructive/20">
                  <span className="text-xl">{e.emoji}</span>
                  <span className="text-[10px] text-muted-foreground">{e.label}</span>
                  <span className="text-sm font-bold text-destructive">{e.number}</span>
                </motion.a>
              ))}
            </div>

            <Button variant="outline" onClick={() => navigate("/")} className="w-full h-12 rounded-xl gap-2">
              Return to Dashboard
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}