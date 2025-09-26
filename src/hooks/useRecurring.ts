import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteRecurring, listRecurring, setRecurringActive, upsertRecurring } from "@/services/recurring";
import type { RecurringItem } from "@/services/recurring";

const queryKeys = {
  all: ["recurring"] as const,
};

export function useRecurring() {
  return useQuery({
    queryKey: queryKeys.all,
    queryFn: async () => Promise.resolve(listRecurring()),
  });
}

export function useUpsertRecurring() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: Omit<RecurringItem, 'id' | 'next_execution_date'> & { id?: string; next_execution_date?: string }) => Promise.resolve(upsertRecurring(input)),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.all }),
  });
}

export function useDeleteRecurring() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => Promise.resolve(deleteRecurring(id)),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.all }),
  });
}

export function useToggleRecurring() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => Promise.resolve(setRecurringActive(id, active)),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.all }),
  });
}




