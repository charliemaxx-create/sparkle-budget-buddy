import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteDebt, listDebts, upsertDebt } from "@/services/debts";
import type { DebtItem } from "@/services/debts";

const queryKeys = {
  all: ["debts"] as const,
};

export function useDebts() {
  return useQuery({
    queryKey: queryKeys.all,
    queryFn: async () => Promise.resolve(listDebts()),
  });
}

export function useUpsertDebt() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: Omit<DebtItem, "id"> & { id?: string }) => Promise.resolve(upsertDebt(input)),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.all }),
  });
}

export function useDeleteDebt() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => Promise.resolve(deleteDebt(id)),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.all }),
  });
}



