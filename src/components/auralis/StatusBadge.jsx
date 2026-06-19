import { cn } from "@/lib/utils";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

const statusConfig = {
  safe: { icon: ShieldCheck, label: "Safe", color: "text-green-400", bg: "bg-green-400/10" },
  alert: { icon: ShieldAlert, label: "Alert", color: "text-amber-400", bg: "bg-amber-400/10" },
  danger: { icon: Shield, label: "Danger", color: "text-destructive", bg: "bg-destructive/10" },
};

export default function StatusBadge({ status = "safe" }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold", config.bg, config.color)}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </div>
  );
}