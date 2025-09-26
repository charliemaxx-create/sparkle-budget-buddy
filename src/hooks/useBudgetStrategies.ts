import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type BudgetStrategy = TablesInsert<'budget_strategies'> & { id: string };

const queryKeys = {
  all: ["budget_strategies"] as const,
};

export function useBudgetStrategies() {
  return useQuery({
    queryKey: queryKeys.all,
    queryFn: async () => {
      const { data, error } = await supabase.from("budget_strategies").select("*");
      if (error) throw error;
      return data as BudgetStrategy[];
    },
  });
}

export function useUpsertBudgetStrategy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: TablesInsert<'budget_strategies'> & { id?: string }) => {
      if (input.id) {
        const { data, error } = await supabase
          .from("budget_strategies")
          .update(input as TablesUpdate<'budget_strategies'>)
          .eq("id", input.id)
          .select()
          .single();
        if (error) throw error;
        return data as BudgetStrategy;
      } else {
        const { data, error } = await supabase
          .from("budget_strategies")
          .insert(input)
          .select()
          .single();
        if (error) throw error;
        return data as BudgetStrategy;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

export function useDeleteBudgetStrategy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("budget_strategies").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

export function useSetActiveBudgetStrategy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (strategyId: string) => {
      // Deactivate all other strategies
      const { error: deactivateError } = await supabase
        .from("budget_strategies")
        .update({ is_active: false })
        .neq("id", strategyId);
      if (deactivateError) throw deactivateError;

      // Activate the selected strategy
      const { data, error: activateError } = await supabase
        .from("budget_strategies")
        .update({ is_active: true })
        .eq("id", strategyId)
        .select()
        .single();
      if (activateError) throw activateError;
      return data as BudgetStrategy;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}