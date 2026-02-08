import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSignalSchema, type InsertSignal } from "@shared/schema";
import { useAnalyzeSignal } from "@/hooks/use-crisis";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Send, Satellite, CloudLightning, FileText, Radio } from "lucide-react";
import { motion } from "framer-motion";

export function SignalInput() {
  const { mutate, isPending } = useAnalyzeSignal();
  
  const form = useForm<InsertSignal>({
    resolver: zodResolver(insertSignalSchema),
    defaultValues: {
      type: "Situation Report",
      description: "",
    },
  });

  function onSubmit(data: InsertSignal) {
    mutate(data, {
      onSuccess: () => {
        form.reset({
          type: "Situation Report",
          description: "",
        });
      },
    });
  }

  const signalTypes = [
    { value: "Weather Alert", icon: CloudLightning, label: "Weather Alert" },
    { value: "Satellite Summary", icon: Satellite, label: "Satellite Data" },
    { value: "Situation Report", icon: FileText, label: "Situation Report" },
    { value: "Field Comms", icon: Radio, label: "Field Comms" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="h-full border-white/5 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-20" />
        
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-display tracking-wide flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              INCOMING SIGNAL
            </CardTitle>
            <span className="text-[10px] font-mono text-primary/70 bg-primary/10 px-2 py-1 rounded border border-primary/20">
              SECURE CHANNEL
            </span>
          </div>
          <CardDescription className="text-muted-foreground/80">
            Submit raw intelligence for immediate AI processing and risk assessment.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 h-full flex flex-col">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-mono uppercase text-muted-foreground ml-1">Signal Source</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50 border-white/10 h-12 focus:ring-primary/20 transition-all hover:bg-accent/20 hover:border-white/20">
                          <SelectValue placeholder="Select signal type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card border-white/10 text-foreground">
                        {signalTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="focus:bg-accent focus:text-accent-foreground">
                            <div className="flex items-center gap-2">
                              <type.icon className="w-4 h-4 text-primary/70" />
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex-1 flex flex-col">
                    <FormLabel className="text-xs font-mono uppercase text-muted-foreground ml-1">Raw Intelligence</FormLabel>
                    <FormControl>
                      <div className="relative flex-1 group">
                        <Textarea 
                          placeholder="Paste report contents, sensor readings, or field observations..." 
                          className="min-h-[200px] h-full resize-none font-mono text-sm bg-background/50 border-white/10 focus:ring-primary/20 focus:border-primary/50 transition-all p-4 leading-relaxed group-hover:bg-accent/5 group-hover:border-white/20"
                          {...field} 
                        />
                        {/* Decorative corner markers */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/30" />
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/30" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/30" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/30" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={isPending}
                className="w-full h-12 text-base font-medium tracking-wide shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ANALYZING SIGNAL...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    TRANSMIT SIGNAL
                  </div>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
