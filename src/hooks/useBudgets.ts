import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteBudget, listBudgets, upsertBudget } from "@/services/budgets";
import type { BudgetItem } from "@/services/budgets";

const queryKeys = {
  all: ["budgets"] as const,
};

export function useBudgets() {
  return useQuery({
    queryKey: queryKeys.all,
    queryFn: async () => Promise.resolve(listBudgets()),
  });
}

export function useUpsertBudget() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: Omit<BudgetItem, "id"> & { id?: string }) => Promise.resolve(upsertBudget(input)),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.all }),
  });
}

export function useDeleteBudget() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => Promise.resolve(deleteBudget(id)),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.all }),
  });
}




