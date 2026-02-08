import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, CheckCircle, Flame } from "lucide-react";
import type { SeverityLevel } from "@shared/schema";

interface SeverityBadgeProps {
  level: SeverityLevel;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function SeverityBadge({ level, className, size = "md" }: SeverityBadgeProps) {
  const styles = {
    Low: "bg-[hsl(var(--severity-low))]/15 text-[hsl(var(--severity-low))] border-[hsl(var(--severity-low))]/30 shadow-[0_0_10px_-4px_hsl(var(--severity-low))]",
    Moderate: "bg-[hsl(var(--severity-moderate))]/15 text-[hsl(var(--severity-moderate))] border-[hsl(var(--severity-moderate))]/30 shadow-[0_0_10px_-4px_hsl(var(--severity-moderate))]",
    High: "bg-[hsl(var(--severity-high))]/15 text-[hsl(var(--severity-high))] border-[hsl(var(--severity-high))]/30 shadow-[0_0_10px_-4px_hsl(var(--severity-high))]",
    Critical: "bg-[hsl(var(--severity-critical))]/15 text-[hsl(var(--severity-critical))] border-[hsl(var(--severity-critical))]/30 shadow-[0_0_20px_-4px_hsl(var(--severity-critical))]",
  };

  const icons = {
    Low: CheckCircle,
    Moderate: AlertCircle,
    High: AlertTriangle,
    Critical: Flame,
  };

  const Icon = icons[level];

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1.5",
    md: "px-3 py-1 text-sm gap-2",
    lg: "px-4 py-2 text-base gap-2.5",
  };

  return (
    <div className={cn(
      "inline-flex items-center font-mono font-bold uppercase tracking-wider rounded-lg border backdrop-blur-sm transition-all duration-300",
      styles[level],
      sizeClasses[size],
      className
    )}>
      <Icon className={cn(
        "shrink-0", 
        size === "sm" ? "w-3.5 h-3.5" : size === "md" ? "w-4 h-4" : "w-5 h-5",
        level === "Critical" && "animate-pulse"
      )} />
      {level}
    </div>
  );
}
