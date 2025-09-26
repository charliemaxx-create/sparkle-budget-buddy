import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteGoal, listGoals, projectGoalCompletionDate, upsertGoal } from "@/services/goals";
import type { SavingsGoalItem } from "@/services/goals";

const queryKeys = {
  all: ["goals"] as const,
};

export function useGoals() {
  return useQuery({
    queryKey: queryKeys.all,
    queryFn: async () => Promise.resolve(listGoals()),
  });
}

export function useUpsertGoal() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: Omit<SavingsGoalItem, "id"> & { id?: string }) => Promise.resolve(upsertGoal(input)),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.all }),
  });
}

export function useDeleteGoal() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => Promise.resolve(deleteGoal(id)),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.all }),
  });
}

export function useProjectGoalCompletion() {
  return (goal: SavingsGoalItem, monthlyContribution: number) => projectGoalCompletionDate(goal, monthlyContribution);
}



