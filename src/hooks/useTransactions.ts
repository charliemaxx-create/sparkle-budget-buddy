import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockDb } from "@/services/mockDb";
import type { Transaction } from "@/types";

const queryKeys = {
  base: (accountId?: string) => ["transactions", accountId ?? "all"] as const,
};

export function useTransactions(accountId?: string, page = 1, pageSize = 50) {
  const query = useQuery({
    queryKey: [...queryKeys.base(accountId), page, pageSize],
    queryFn: async () => {
      return Promise.resolve(
        mockDb.listTransactions({ accountId, page, pageSize })
      );
    },
    keepPreviousData: true,
  });
  return query;
}

export function useUpsertTransaction() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: Omit<Transaction, "id"> & { id?: string }) => {
      return Promise.resolve(mockDb.upsertTransaction(input));
    },
    onSuccess: (_data, variables) => {
      // invalidate relevant lists
      const accountId = variables.accountId;
      client.invalidateQueries({ queryKey: queryKeys.base(accountId) });
      client.invalidateQueries({ queryKey: queryKeys.base(undefined) });
    },
  });
}

export function useDeleteTransaction(accountId?: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      mockDb.deleteTransaction(id);
      return Promise.resolve();
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: queryKeys.base(accountId) });
      client.invalidateQueries({ queryKey: queryKeys.base(undefined) });
    },
  });
}




