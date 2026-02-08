import { Header } from "@/components/Header";
import { SignalInput } from "@/components/SignalInput";
import { StateVisualization } from "@/components/StateVisualization";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8 max-w-[1600px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* Left Panel: Signal Injection */}
          <div className="lg:col-span-4 h-full min-h-[500px] lg:h-auto flex flex-col">
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Signal Feed</h2>
            </div>
            <div className="flex-1">
              <SignalInput />
            </div>
          </div>

          {/* Right Panel: State & Analysis */}
          <div className="lg:col-span-8 space-y-6">
            <div className="mb-4 flex items-center justify-between lg:hidden">
               <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">System State</h2>
            </div>
            <StateVisualization />
          </div>

        </div>
      </main>

      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-20" 
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>
    </div>
  );
}
