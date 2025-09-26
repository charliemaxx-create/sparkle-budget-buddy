import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { useCategories, useUpsertCategory, useDeleteCategory } from '@/hooks/useCategories';
import { AddEditCategoryModal } from './AddEditCategoryModal';
import type { CategoryItem } from '@/services/categories';

export const CategoryManagement = () => {
  const { data: categories = [], isLoading, error } = useCategories();
  const upsertCategory = useUpsertCategory();
  const deleteCategory = useDeleteCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: CategoryItem) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This will also remove any associated subcategories.')) {
      deleteCategory.mutate(id);
    }
  };

  const handleSaveCategory = (category: Omit<CategoryItem, 'user_id' | 'created_at' | 'updated_at'> & { id?: string }) => {
    upsertCategory.mutate(category);
    setIsModalOpen(false);
  };

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const buildCategoryTree = (cats: CategoryItem[]) => {
    const categoryMap = new Map<string, CategoryItem & { children: CategoryItem[] }>();
    cats.forEach(cat => categoryMap.set(cat.id, { ...cat, children: [] }));

    const rootCategories: (CategoryItem & { children: CategoryItem[] })[] = [];
    categoryMap.forEach(cat => {
      if (cat.parent_id && categoryMap.has(cat.parent_id)) {
        categoryMap.get(cat.parent_id)?.children.push(cat);
      } else {
        rootCategories.push(cat);
      }
    });

    // Sort children by name
    categoryMap.forEach(cat => cat.children.sort((a, b) => a.name.localeCompare(b.name)));
    rootCategories.sort((a, b) => a.name.localeCompare(b.name));

    return rootCategories;
  };

  const categoryTree = buildCategoryTree(categories);

  const renderCategory = (category: CategoryItem & { children: CategoryItem[] }, level: number = 0) => (
    <div key={category.id} className={`py-2 ${level > 0 ? 'pl-6 border-l border-border ml-2' : ''}`}>
      <div className="flex items-center justify-between group">
        <div className="flex items-center space-x-2">
          {category.children.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => toggleExpand(category.id)}
            >
              {expandedCategories.has(category.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}
          <span className="text-lg mr-2">{category.icon}</span>
          <span className="font-medium">{category.name}</span>
          <span className="text-sm text-muted-foreground ml-2">({category.type})</span>
        </div>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="outline" onClick={() => handleEditCategory(category)}>
            <Edit className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleDeleteCategory(category.id)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {expandedCategories.has(category.id) && category.children.length > 0 && (
        <div className="mt-2">
          {category.children.map(child => renderCategory(child, level + 1))}
        </div>
      )}
    </div>
  );

  if (isLoading) return <div>Loading categories...</div>;
  if (error) return <div>Error loading categories: {error.message}</div>;

  return (
    <Card className="card-elevated animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Categories</CardTitle>
        <Button className="btn-gradient" onClick={handleAddCategory}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </CardHeader>
      <CardContent>
        {categoryTree.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="mb-2">No custom categories added yet.</p>
            <p>Click "Add Category" to create your first one.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {categoryTree.map(category => renderCategory(category))}
          </div>
        )}
      </CardContent>

      <AddEditCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        initialData={editingCategory}
      />
    </Card>
  );
};