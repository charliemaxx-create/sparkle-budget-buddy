import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockDb } from "@/services/mockDb";
import type { Account } from "@/types";

const queryKeys = {
  all: ["accounts"] as const,
};

export function useAccounts() {
  const query = useQuery({
    queryKey: queryKeys.all,
    queryFn: async () => {
      return Promise.resolve(mockDb.listAccounts());
    },
  });
  return query;
}

export function useUpsertAccount() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: Omit<Account, "id"> & { id?: string }) => {
      return Promise.resolve(mockDb.upsertAccount(input));
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

export function useDeleteAccount() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      mockDb.deleteAccount(id);
      return Promise.resolve();
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}




