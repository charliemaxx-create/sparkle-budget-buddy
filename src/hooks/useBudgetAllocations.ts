import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

const BUDGET_ALLOCATIONS_TABLE = "budget_allocations";

const queryKeys = {
  all: [BUDGET_ALLOCATIONS_TABLE] as const,
  byStrategy: (strategyId: string) => [...queryKeys.all, strategyId] as const,
};

export function useBudgetAllocations(strategyId: string) {
  return useQuery({
    queryKey: queryKeys.byStrategy(strategyId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from(BUDGET_ALLOCATIONS_TABLE)
        .select("*")
        .eq("strategy_id", strategyId);
      if (error) throw error;
      return data;
    },
    enabled: !!strategyId,
  });
}

export function useUpsertBudgetAllocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: TablesInsert<typeof BUDGET_ALLOCATIONS_TABLE> & { id?: string }) => {
      if (input.id) {
        const { data, error } = await supabase
          .from(BUDGET_ALLOCATIONS_TABLE)
          .update(input as TablesUpdate<typeof BUDGET_ALLOCATIONS_TABLE>)
          .eq("id", input.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from(BUDGET_ALLOCATIONS_TABLE)
          .insert(input)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_data, variables) => {
      if (variables.strategy_id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.byStrategy(variables.strategy_id) });
      }
    },
  });
}

export function useDeleteBudgetAllocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(BUDGET_ALLOCATIONS_TABLE)
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all }); // Invalidate all to be safe
    },
  });
}