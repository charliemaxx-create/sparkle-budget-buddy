import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserPreferences, upsertUserPreferences } from "@/services/preferences";
import type { UserPreferences } from "@/types";

const queryKeys = {
  preferences: ["userPreferences"] as const,
};

export function useUserPreferences() {
  const query = useQuery({
    queryKey: queryKeys.preferences,
    queryFn: async () => Promise.resolve(getUserPreferences()),
  });

  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (input: Partial<UserPreferences>) => Promise.resolve(upsertUserPreferences(input)),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.preferences }),
  });

  return {
    preferences: query.data,
    isLoading: query.isLoading,
    updatePreferences: mutation.mutate,
  };
}