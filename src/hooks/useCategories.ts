import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listCategories, upsertCategory, deleteCategory } from "@/services/categories";
import type { CategoryItem, CategoryInsert } from "@/services/categories";

const queryKeys = {
  all: ["categories"] as const,
};

export function useCategories() {
  return useQuery<CategoryItem[], Error>({
    queryKey: queryKeys.all,
    queryFn: listCategories,
  });
}

export function useUpsertCategory() {
  const client = useQueryClient();
  return useMutation<CategoryItem, Error, Omit<CategoryInsert, 'user_id'> & { id?: string }>({
    mutationFn: upsertCategory,
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.all }),
  });
}

export function useDeleteCategory() {
  const client = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteCategory,
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.all }),
  });
}