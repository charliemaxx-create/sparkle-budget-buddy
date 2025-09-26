import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

const BUDGET_STRATEGIES_TABLE = "budget_strategies";

const queryKeys = {
  all: [BUDGET_STRATEGIES_TABLE] as const,
  active: () => [...queryKeys.all, "active"] as const,
};

export function useBudgetStrategies() {
  return useQuery({
    queryKey: queryKeys.all,
    queryFn: async () => {
      const { data, error } = await supabase
        .from(BUDGET_STRATEGIES_TABLE)
        .select("*");
      if (error) throw error;
      return data;
    },
  });
}

export function useActiveBudgetStrategy(strategyType: string) {
  return useQuery({
    queryKey: queryKeys.active(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from(BUDGET_STRATEGIES_TABLE)
        .select("*")
        .eq("strategy_type", strategyType)
        .eq("is_active", true)
        .single();
      if (error && error.code !== 'PGRST116') throw error; // Ignore "no rows found" error
      return data;
    },
  });
}

export function useUpsertBudgetStrategy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: TablesInsert<typeof BUDGET_STRATEGIES_TABLE> & { id?: string }) => {
      if (input.id) {
        const { data, error } = await supabase
          .from(BUDGET_STRATEGIES_TABLE)
          .update(input as TablesUpdate<typeof BUDGET_STRATEGIES_TABLE>)
          .eq("id", input.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from(BUDGET_STRATEGIES_TABLE)
          .insert(input)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.active() });
    },
  });
}

export function useDeleteBudgetStrategy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(BUDGET_STRATEGIES_TABLE)
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.active() });
    },
  });
}