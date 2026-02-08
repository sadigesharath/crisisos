import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertSignal, type AnalyzeResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useCrisisState() {
  return useQuery({
    queryKey: [api.crisis.getState.path],
    queryFn: async () => {
      const res = await fetch(api.crisis.getState.path);
      if (!res.ok) throw new Error("Failed to fetch crisis state");
      return api.crisis.getState.responses[200].parse(await res.json());
    },
    // Poll every 10 seconds to keep dashboard alive, though mutations trigger updates
    refetchInterval: 10000, 
  });
}

export function useAnalyzeSignal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertSignal) => {
      const res = await fetch(api.crisis.analyze.path, {
        method: api.crisis.analyze.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Analysis failed");
      }
      
      return api.crisis.analyze.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      // Update the state cache immediately with the response
      queryClient.setQueryData([api.crisis.getState.path], data.crisisState);
      
      toast({
        title: "Signal Processed",
        description: "Crisis state has been updated based on new intelligence.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
