import { supabase } from '@/integrations/supabase/client';
import type { TablesInsert, TablesUpdate, Tables } from '@/integrations/supabase/types';

export type CategoryItem = Tables<'categories'>;
export type CategoryInsert = TablesInsert<'categories'>;
export type CategoryUpdate = TablesUpdate<'categories'>;

export async function listCategories(): Promise<CategoryItem[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

export async function upsertCategory(input: Omit<CategoryInsert, 'user_id'> & { id?: string }): Promise<CategoryItem> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const payload: CategoryInsert = {
    ...input,
    user_id: user.id,
  };

  let query;
  if (input.id) {
    query = supabase.from('categories').update(payload as CategoryUpdate).eq('id', input.id).select().single();
  } else {
    query = supabase.from('categories').insert(payload).select().single();
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
}