import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Bell, Shield, MapPin, Phone, Moon, Fingerprint,
  Globe, HelpCircle, ChevronRight, Volume2, Vibrate, Clock, Trash2
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import GlassCard from "@/components/auralis/GlassCard";
import VoiceSensitivitySlider from "@/components/auralis/VoiceSensitivitySlider";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const settingSections = [
  {
    title: "Safety",
    items: [
      { icon: Shield, label: "Auto SOS Timer", description: "3 seconds hold", toggle: false },
      { icon: MapPin, label: "Background Location", description: "Always active", toggle: true, defaultOn: true },
      { icon: Clock, label: "Auto Check-in", description: "Every 2 hours", toggle: true, defaultOn: true },
      { icon: Phone, label: "Fake Call Settings", description: "Customize caller", toggle: false },
    ],
  },
  {
    title: "Notifications",
    items: [
      { icon: Bell, label: "Push Notifications", description: "All alerts enabled", toggle: true, defaultOn: true },
      { icon: Volume2, label: "Sound Alerts", description: "High priority only", toggle: true, defaultOn: true },
      { icon: Vibrate, label: "Vibration", description: "Enabled", toggle: true, defaultOn: false },
    ],
  },
  {
    title: "Privacy",
    items: [
      { icon: Fingerprint, label: "Biometric Lock", description: "Face ID / Fingerprint", toggle: true, defaultOn: false },
      { icon: Globe, label: "Location Privacy", description: "Contacts only", toggle: false },
    ],
  },
  {
    title: "General",
    items: [
      { icon: Moon, label: "Dark Mode", description: "Always on", toggle: false },
      { icon: HelpCircle, label: "Help & Support", description: "FAQ, Contact us", toggle: false },
    ],
  },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  // Optimistic toggles: pre-populate with defaults
  const initialToggles = {};
  settingSections.forEach(s => s.items.forEach(item => {
    if (item.toggle) initialToggles[item.label] = item.defaultOn ?? false;
  }));
  const [toggles, setToggles] = useState(initialToggles);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteAccount = () => {
    // Placeholder: log out and redirect after account deletion
    setDeleteDialogOpen(false);
    navigate("/login");
  };

  const handleToggle = (label) => {
    setToggles((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="px-5 pt-12 pb-4 space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <button onClick={() => navigate(-1)} className="w-9 h-9 glass rounded-xl flex items-center justify-center">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="font-heading text-2xl font-bold">Settings</h1>
      </motion.div>

      {/* Settings Sections */}
      {settingSections.map((section, si) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: si * 0.1 }}
        >
          <h3 className="font-heading font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2 px-1">
            {section.title}
          </h3>
          <GlassCard animate={false} className="!p-0 divide-y divide-border/50">
            {section.items.map((item) => {
              const Icon = item.icon;
              const isOn = toggles[item.label] ?? item.defaultOn ?? false;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 px-4 py-3.5 cursor-pointer"
                  onClick={() => item.toggle && handleToggle(item.label)}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground">{item.description}</p>
                  </div>
                  {item.toggle ? (
                    <Switch checked={isOn} onCheckedChange={() => handleToggle(item.label)} />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              );
            })}
          </GlassCard>
        </motion.div>
      ))}

      {/* Voice Sensitivity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: settingSections.length * 0.1 }}
      >
        <h3 className="font-heading font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2 px-1">
          Voice Monitoring
        </h3>
        <GlassCard animate={false} className="!p-4">
          <VoiceSensitivitySlider />
        </GlassCard>
      </motion.div>

      {/* Account Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: (settingSections.length + 1) * 0.1 }}
      >
        <h3 className="font-heading font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2 px-1">
          Account
        </h3>
        <GlassCard animate={false} className="!p-0">
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-destructive">Delete Account</p>
                  <p className="text-[11px] text-muted-foreground">Permanently remove your data</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your account and all associated data including emergency contacts, safety alerts, and chat history. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </GlassCard>
      </motion.div>

      <p className="text-center text-xs text-muted-foreground/50 pt-4">Auralis v2.0.1 · AI Safety Platform</p>
    </div>
  );
}