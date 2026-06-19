import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, MapPin, Brain, Phone, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    icon: Shield,
    title: "Your Safety Shield",
    description: "Auralis provides 24/7 AI-powered protection with instant SOS alerts and real-time emergency response.",
    gradient: "from-primary to-blue-400",
    glow: "bg-primary/20",
  },
  {
    icon: MapPin,
    title: "Live Location Sharing",
    description: "Share your real-time location with trusted contacts. AI monitors your routes and alerts you about unsafe areas.",
    gradient: "from-green-400 to-emerald-500",
    glow: "bg-green-400/20",
  },
  {
    icon: Brain,
    title: "AI Safety Assistant",
    description: "Chat with our AI assistant for safety tips, emergency guidance, and situational awareness in real-time.",
    gradient: "from-accent to-purple-400",
    glow: "bg-accent/20",
  },
  {
    icon: Phone,
    title: "Fake Call Rescue",
    description: "Escape uncomfortable situations with a realistic fake incoming call. Customizable caller and timing.",
    gradient: "from-amber-400 to-orange-500",
    glow: "bg-amber-400/20",
  },
];

export default function Onboarding() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const slide = slides[current];

  const next = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden px-6 pt-12 pb-8">
      {/* Background */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 ${slide.glow} rounded-full blur-[120px] transition-colors duration-700`} />

      {/* Skip */}
      <div className="flex justify-end mb-8 relative z-10">
        <button onClick={() => navigate("/login")} className="text-muted-foreground text-sm font-medium flex items-center gap-1">
          Skip <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${slide.gradient} flex items-center justify-center mb-10 glow-blue`}>
              <slide.icon className="w-12 h-12 text-white" />
            </div>
            <h2 className="font-heading text-3xl font-bold mb-4">{slide.title}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots & Button */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              animate={{ width: i === current ? 24 : 8 }}
              className={`h-2 rounded-full transition-colors ${
                i === current ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <Button
          onClick={next}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-base gap-2"
        >
          {current === slides.length - 1 ? "Get Started" : "Next"}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}