import { useCrisisState } from "@/hooks/use-crisis";
import { SeverityBadge } from "./SeverityBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertOctagon, BrainCircuit, Target, Shield, MapPin, Activity, FileWarning, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

export function StateVisualization() {
  const { data: state, isLoading, isError } = useCrisisState();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError || !state) {
    return (
      <div className="h-full flex items-center justify-center p-8 border border-dashed border-white/10 rounded-xl bg-card/20">
        <div className="text-center space-y-3 opacity-50">
          <AlertOctagon className="w-12 h-12 mx-auto" />
          <p>System offline or unreachable</p>
        </div>
      </div>
    );
  }

  const confidenceColor = 
    state.confidence > 80 ? "bg-emerald-500" :
    state.confidence > 50 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Top Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div layoutId="status-card">
          <Card className="bg-card/50 border-white/10 backdrop-blur-md overflow-hidden relative">
            <div className={`absolute top-0 left-0 w-1 h-full ${confidenceColor}`} />
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h3 className="text-xs font-mono uppercase text-muted-foreground tracking-wider">Crisis Classification</h3>
                  <div className="text-xl font-display font-bold text-foreground truncate max-w-[200px]" title={state.crisisType}>
                    {state.crisisType}
                  </div>
                </div>
                <SeverityBadge level={state.severityLevel} />
              </div>
              
              <div className="flex items-center gap-4 text-sm font-mono text-muted-foreground/80 pt-4 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[120px]">{state.location}</span>
                </div>
                <div className="h-3 w-[1px] bg-white/10" />
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Conf: {state.confidence}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Card className="bg-card/50 border-white/10 backdrop-blur-md flex flex-col">
          <CardContent className="p-5 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <BrainCircuit className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-mono uppercase text-muted-foreground tracking-wider">AI Reasoning Engine</h3>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[100px] pr-2 scrollbar-thin">
              <p className="text-sm leading-relaxed text-foreground/90 font-mono">
                {state.reasoning}
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-muted-foreground font-mono">
               <span>MODEL: GEMINI-PRO-VISION</span>
               <span>UPDATED: {state.lastUpdated ? formatDistanceToNow(new Date(state.lastUpdated), { addSuffix: true }) : 'Just now'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recommended Actions - Span 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Target className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-display font-semibold tracking-wide">RECOMMENDED ACTIONS</h3>
          </div>
          
          <div className="grid gap-3">
            <AnimatePresence>
              {state.recommendedActions.length > 0 ? (
                state.recommendedActions.map((action, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative overflow-hidden rounded-lg bg-card/30 border border-white/5 hover:border-primary/30 transition-all hover:bg-card/50"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/40 group-hover:bg-primary transition-colors" />
                    <div className="p-4 pl-6 flex items-start gap-3">
                      <div className="mt-0.5 flex items-center justify-center w-5 h-5 rounded border border-primary/20 text-[10px] font-mono font-bold text-primary">
                        {i + 1}
                      </div>
                      <p className="text-sm text-foreground/90">{action}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground italic px-4">No actions generated yet.</div>
              )}
            </AnimatePresence>
          </div>

          {/* Risks Section */}
          <div className="mt-8 pt-6 border-t border-white/5">
             <div className="flex items-center gap-2 px-1 mb-4">
              <FileWarning className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-display font-semibold tracking-wide text-foreground/80">RISKS & UNCERTAINTIES</h3>
            </div>
            <div className="rounded-lg bg-amber-500/5 border border-amber-500/10 p-4 text-sm text-amber-200/80 leading-relaxed font-mono">
              {state.risksAndUncertainties}
            </div>
          </div>
        </div>

        {/* Evidence Log - Right Col */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Layers className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-display font-semibold tracking-wide text-muted-foreground">EVIDENCE LOG</h3>
          </div>
          
          <div className="rounded-xl bg-black/20 border border-white/5 p-1 h-[400px] overflow-hidden">
             <div className="h-full overflow-y-auto p-3 space-y-3 custom-scrollbar">
               {state.evidence.length > 0 ? (
                 state.evidence.map((item, idx) => (
                   <div key={idx} className="text-xs font-mono p-3 rounded bg-white/5 border border-white/5 text-muted-foreground hover:text-foreground transition-colors hover:bg-white/10 hover:border-white/10">
                     <span className="opacity-50 mr-2">[{String(idx + 1).padStart(2, '0')}]</span>
                     {item}
                   </div>
                 ))
               ) : (
                 <div className="text-xs font-mono text-muted-foreground/50 text-center py-10">
                   Waiting for signals...
                 </div>
               )}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-32 w-full rounded-xl bg-white/5" />
        <Skeleton className="h-32 w-full rounded-xl bg-white/5" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <Skeleton className="h-8 w-48 bg-white/5 mb-4" />
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-20 w-full rounded-lg bg-white/5" />
          ))}
        </div>
        <div className="space-y-3">
          <Skeleton className="h-8 w-32 bg-white/5 mb-4" />
          <Skeleton className="h-[400px] w-full rounded-xl bg-white/5" />
        </div>
      </div>
    </div>
  );
}
