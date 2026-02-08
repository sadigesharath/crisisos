import { ShieldAlert, Activity } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_-3px_var(--primary)]">
            <ShieldAlert className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-foreground">
              CRISIS<span className="text-primary">OS</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
              Autonomous Reasoning System
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/50 border border-white/5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-[ping_2s_ease-in-out_infinite]" />
            <span className="text-xs font-mono text-emerald-500 font-medium">SYSTEM ONLINE</span>
          </div>
          <div className="h-8 w-[1px] bg-border" />
          <div className="text-xs text-muted-foreground font-mono">
            V 1.0.4-BETA
          </div>
        </div>
      </div>
    </header>
  );
}
