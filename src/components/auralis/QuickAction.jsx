import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
// Icon is passed as a prop (e.g. icon={Phone})

const colorMap = {
  primary:   { bg: "bg-primary/15 border border-primary/25",   icon: "text-primary",    label: "text-primary" },
  secondary: { bg: "bg-accent/15 border border-accent/25",     icon: "text-accent",     label: "text-accent" },
  amber:     { bg: "bg-amber-500/15 border border-amber-500/25", icon: "text-amber-400", label: "text-amber-400" },
  green:     { bg: "bg-green-500/15 border border-green-500/25", icon: "text-green-400", label: "text-green-400" },
  red:       { bg: "bg-red-500/15 border border-red-500/25",    icon: "text-red-400",   label: "text-red-400" },
  blue:      { bg: "bg-blue-500/15 border border-blue-500/25",  icon: "text-blue-400",  label: "text-blue-400" },
  violet:    { bg: "bg-violet-500/15 border border-violet-500/25", icon: "text-violet-400", label: "text-violet-400" },
  orange:    { bg: "bg-orange-500/15 border border-orange-500/25", icon: "text-orange-400", label: "text-orange-400" },
};

export default function QuickAction({ icon: Icon, label, color = "primary", onClick }) {
  const c = colorMap[color] || colorMap.primary;
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2 w-full"
    >
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", c.bg)}>
        <Icon className={cn("w-6 h-6", c.icon)} strokeWidth={2} />
      </div>
      <span className={cn("text-[11px] font-semibold", c.label)}>{label}</span>
    </motion.button>
  );
}