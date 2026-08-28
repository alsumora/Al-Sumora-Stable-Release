import React, { useState } from 'react';
import { CategoryItem, Product } from '../../types';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminCategoryManagerProps {
  categories: CategoryItem[];
  products: Product[];
  onCreateCategory: (newCategory: CategoryItem) => void;
  onUpdateCategory: (updatedCategory: CategoryItem) => void;
  onDeleteCategory: (categoryId: string) => void;
}

const PRESET_CATEGORY_IMAGES = [
  { name: 'Jackets & Coats', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800' },
  { name: 'Footwear & Oxfords', url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&q=80&w=800' },
  { name: 'Executive Briefcases', url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800' },
  { name: 'Travel Duffels', url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800' },
  { name: 'Wallets & Cardholders', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800' },
  { name: 'Belts & Accessories', url: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&q=80&w=800' },
  { name: 'Watch Straps & Cases', url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800' },
  { name: 'Desk Sets & Leather Mats', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800' },
];

export const AdminCategoryManager: React.FC<AdminCategoryManagerProps> = ({
  categories,
  products,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategoryKey, setFormCategoryKey] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const resetForm = () => {
    setFormName('');
    setFormCategoryKey('');
    setFormImage(PRESET_CATEGORY_IMAGES[0].url);
    setFormTagline('');
    setFormDescription('');
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormCategoryKey(cat.category || cat.id);
    setFormImage(cat.image);
    setFormTagline(cat.tagline || '');
    setFormDescription(cat.description || '');
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formImage.trim()) return;

    const categoryKey = formCategoryKey.trim() || formName.trim().replace(/\s+/g, '');

    if (editingCategory) {
      onUpdateCategory({
        ...editingCategory,
        name: formName.trim(),
        category: categoryKey,
        image: formImage.trim(),
        tagline: formTagline.trim(),
        description: formDescription.trim(),
      });
      setEditingCategory(null);
    } else {
      const newCat: CategoryItem = {
        id: categoryKey,
        name: formName.trim(),
        category: categoryKey,
        image: formImage.trim(),
        tagline: formTagline.trim() || 'Handcrafted leather collection',
        description: formDescription.trim() || 'Genuine handcrafted leather goods.',
        itemCount: '0 Items',
      };
      onCreateCategory(newCat);
      setIsCreateModalOpen(false);
    }
    resetForm();
  };

  const handleDeleteConfirm = () => {
    if (deletingCategory) {
      onDeleteCategory(deletingCategory.id);
      setDeletingCategory(null);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Category Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create and edit product categories and display images.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Grid Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const associatedProductsCount = products.filter(
            (p) =>
              p.category.toLowerCase() === cat.category.toLowerCase() ||
              p.category.toLowerCase() === cat.name.toLowerCase() ||
              p.category.toLowerCase() === cat.id.toLowerCase()
          ).length;

          return (
            <div
              key={cat.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              {/* Category Hero Image */}
              <div className="h-40 relative bg-slate-100 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase font-semibold text-slate-200 block">
                    ID: {cat.category || cat.id}
                  </span>
                  <h3 className="font-bold text-base text-white line-clamp-1">
                    {cat.name}
                  </h3>
                </div>

                <div className="absolute top-3 right-3 bg-white/90 text-slate-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
                  {associatedProductsCount} Product{associatedProductsCount !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-blue-600">
                    {cat.tagline || 'Collection'}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {cat.description || 'Collection description.'}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    #{cat.id.toLowerCase()}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingCategory(cat)}
                      className="p-1.5 rounded-md bg-red-50 hover:bg-red-600 hover:text-white text-red-600 transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Category Modal */}
      <AnimatePresence>
        {(isCreateModalOpen || editingCategory) && (
          <div className="fixed inset-0 z-[70] overflow-y-auto flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
              onClick={() => {
                setIsCreateModalOpen(false);
                setEditingCategory(null);
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="relative bg-white w-full max-w-xl rounded-xl shadow-xl border border-slate-200 overflow-hidden z-10 text-slate-900"
            >
              {/* Modal Header */}
              <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                    <FolderTree className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      {editingCategory ? 'Edit Category' : 'New Category'}
                    </h3>
                    <span className="text-xs text-slate-500">
                      {editingCategory ? `ID: ${editingCategory.id}` : 'Add a new product category'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingCategory(null);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveCategory} className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Category Display Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={formName}
                      onChange={(e) => {
                        setFormName(e.target.value);
                        if (!editingCategory && !formCategoryKey) {
                          setFormCategoryKey(e.target.value.replace(/\s+/g, ''));
                        }
                      }}
                      placeholder="e.g. Travel Duffels"
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Category Key / Slug *
                    </label>
                    <input
                      required
                      type="text"
                      value={formCategoryKey}
                      onChange={(e) => setFormCategoryKey(e.target.value)}
                      placeholder="e.g. Duffels"
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={formTagline}
                    onChange={(e) => setFormTagline(e.target.value)}
                    placeholder="e.g. Handcrafted leather bags"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Hero Image URL *
                  </label>
                  <input
                    required
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />

                  {/* Preset Image Quick Selector */}
                  <div className="mt-2 space-y-1">
                    <span className="text-[11px] text-slate-500 font-medium">Quick presets:</span>
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {PRESET_CATEGORY_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormImage(preset.url)}
                          className={`h-11 rounded-lg overflow-hidden border relative cursor-pointer group ${
                            formImage === preset.url ? 'border-blue-600 ring-2 ring-blue-500/30' : 'border-slate-200'
                          }`}
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-black/40 text-white text-[8px] font-medium flex items-center justify-center p-1 text-center leading-tight">
                            {preset.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Category description..."
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                {/* Modal Actions */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setEditingCategory(null);
                    }}
                    className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingCategory ? 'Save' : 'Create'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingCategory && (
          <div className="fixed inset-0 z-[70] overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
              onClick={() => setDeletingCategory(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="relative bg-white w-full max-w-md rounded-xl shadow-xl border border-slate-200 p-5 z-10 space-y-4"
            >
              <div className="flex items-center gap-3 text-red-600">
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Delete Category?
                  </h3>
                  <span className="text-xs text-slate-500">
                    "{deletingCategory.name}"
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                Are you sure you want to delete this category? Products in this category will remain available and can be reassigned.
              </p>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => setDeletingCategory(null)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
