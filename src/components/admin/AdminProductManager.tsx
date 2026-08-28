import React, { useState } from 'react';
import { Product, CategoryItem, ProductColor } from '../../types';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Search,
  Check,
  X,
  Sparkles,
  AlertTriangle,
  Image as ImageIcon,
  Palette,
  CheckCircle2,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminProductManagerProps {
  products: Product[];
  categories: CategoryItem[];
  onCreateProduct: (newProduct: Product) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onSelectProductPreview?: (product: Product) => void;
}

const DEFAULT_SAMPLE_COLORS: ProductColor[] = [
  { name: 'Midnight Black', hex: '#1b1c19', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800' },
  { name: 'Tobacco Tan', hex: '#825425', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800' },
  { name: 'Dark Mahogany', hex: '#422419', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800' },
];

export const AdminProductManager: React.FC<AdminProductManagerProps> = ({
  products,
  categories,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  onSelectProductPreview,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0]?.category || 'Jackets');
  const [formPrice, setFormPrice] = useState<number>(14999);
  const [formDescription, setFormDescription] = useState('');
  const [formDetails, setFormDetails] = useState<string[]>([
    '100% genuine full-grain artisanal leather hide',
    'Solid antiqued brass hardware with anti-tarnish coating',
    'Hand-burnished edges with organic beeswax seal',
    'Complimentary bespoke monogramming available',
  ]);
  const [newDetailInput, setNewDetailInput] = useState('');
  const [formImages, setFormImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
  ]);
  const [newImageInput, setNewImageInput] = useState('');
  const [formColors, setFormColors] = useState<ProductColor[]>(DEFAULT_SAMPLE_COLORS);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#825425');
  const [formBoutiques, setFormBoutiques] = useState<string[]>(['mumbai', 'newdelhi', 'bengaluru']);
  const [formIsFeatured, setFormIsFeatured] = useState(true);
  const [formCustomizable, setFormCustomizable] = useState(true);
  const [formStock, setFormStock] = useState(15);

  const resetForm = () => {
    setFormName('');
    setFormCategory(categories[0]?.category || 'Jackets');
    setFormPrice(14999);
    setFormDescription('Handcrafted with generational leathercraft techniques using the finest full-grain hides.');
    setFormDetails([
      '100% genuine full-grain artisanal leather hide',
      'Solid antiqued brass hardware with anti-tarnish coating',
      'Hand-burnished edges with organic beeswax seal',
      'Complimentary bespoke monogramming available',
    ]);
    setFormImages(['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800']);
    setFormColors(DEFAULT_SAMPLE_COLORS);
    setFormBoutiques(['mumbai', 'newdelhi', 'bengaluru']);
    setFormIsFeatured(true);
    setFormCustomizable(true);
    setFormStock(15);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormPrice(p.price);
    setFormDescription(p.description);
    setFormDetails(p.details && p.details.length > 0 ? p.details : ['100% full-grain leather']);
    setFormImages(p.images && p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800']);
    setFormColors(p.colors && p.colors.length > 0 ? p.colors : DEFAULT_SAMPLE_COLORS);
    setFormBoutiques(p.boutiques && p.boutiques.length > 0 ? p.boutiques : ['mumbai', 'newdelhi']);
    setFormIsFeatured(Boolean(p.isFeatured));
    setFormCustomizable(Boolean(p.customizable));
    setFormStock(p.stock || 12);
  };

  const handleDuplicate = (p: Product) => {
    const cloned: Product = {
      ...p,
      id: `${p.id}-copy-${Date.now().toString().slice(-4)}`,
      name: `${p.name} (Copy)`,
    };
    onCreateProduct(cloned);
  };

  const handleAddDetail = () => {
    if (newDetailInput.trim()) {
      setFormDetails([...formDetails, newDetailInput.trim()]);
      setNewDetailInput('');
    }
  };

  const handleRemoveDetail = (idx: number) => {
    setFormDetails(formDetails.filter((_, i) => i !== idx));
  };

  const handleAddImage = () => {
    if (newImageInput.trim()) {
      setFormImages([...formImages, newImageInput.trim()]);
      setNewImageInput('');
    }
  };

  const handleRemoveImage = (idx: number) => {
    if (formImages.length > 1) {
      setFormImages(formImages.filter((_, i) => i !== idx));
    }
  };

  const handleAddColor = () => {
    if (newColorName.trim()) {
      setFormColors([
        ...formColors,
        {
          name: newColorName.trim(),
          hex: newColorHex,
          image: formImages[0] || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
        },
      ]);
      setNewColorName('');
    }
  };

  const handleRemoveColor = (idx: number) => {
    if (formColors.length > 1) {
      setFormColors(formColors.filter((_, i) => i !== idx));
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formImages.length === 0) return;

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: formName.trim(),
        category: formCategory,
        price: Number(formPrice) || 0,
        description: formDescription.trim(),
        details: formDetails,
        images: formImages,
        colors: formColors,
        boutiques: formBoutiques,
        isFeatured: formIsFeatured,
        customizable: formCustomizable,
        stock: Number(formStock) || 0,
      };
      onUpdateProduct(updated);
      setEditingProduct(null);
    } else {
      const slug = formName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const newProd: Product = {
        id: `${slug}-${Date.now().toString().slice(-4)}`,
        name: formName.trim(),
        category: formCategory,
        price: Number(formPrice) || 0,
        description: formDescription.trim(),
        details: formDetails,
        images: formImages,
        colors: formColors,
        boutiques: formBoutiques,
        isFeatured: formIsFeatured,
        customizable: formCustomizable,
        stock: Number(formStock) || 0,
      };
      onCreateProduct(newProd);
      setIsCreateModalOpen(false);
    }
    resetForm();
  };

  const handleDeleteConfirm = () => {
    if (deletingProduct) {
      onDeleteProduct(deletingProduct.id);
      setDeletingProduct(null);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategoryFilter === 'All' ||
      p.category.toLowerCase() === selectedCategoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
            Inventory & Catalog
          </span>
          <h2 className="font-bold text-xl sm:text-2xl text-slate-900 mt-0.5">
            Product Catalog ({products.length})
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, price, and maintain leather goods and collections.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer self-start md:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3 justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product title, ID, or keywords..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 hide-scrollbar">
          <button
            onClick={() => setSelectedCategoryFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
              selectedCategoryFilter === 'All'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            All Categories ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.category || cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategoryFilter.toLowerCase() === (cat.category || cat.id).toLowerCase()
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold uppercase text-[11px] border-b border-slate-200">
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Price (INR)</th>
                <th className="py-3 px-3">Colors</th>
                <th className="py-3 px-3">Options</th>
                <th className="py-3 px-3">Stock</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No products found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  return (
                    <tr key={product.id} className="hover:bg-blue-50/30 transition-colors">
                      {/* Product Thumbnail & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                            <img
                              src={product.images[0] || product.colors[0]?.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                              {product.name}
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              ID: {product.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3">
                        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-3 font-bold text-slate-900 text-sm">
                        ₹{product.price.toLocaleString('en-IN')}
                      </td>

                      {/* Colors */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          {product.colors.slice(0, 3).map((col, idx) => (
                            <span
                              key={idx}
                              className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs"
                              style={{ backgroundColor: col.hex }}
                              title={col.name}
                            />
                          ))}
                          {product.colors.length > 3 && (
                            <span className="text-[10px] text-slate-500 font-semibold">
                              +{product.colors.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Options (Customizable / Featured) */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col gap-1">
                          {product.customizable && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded w-fit">
                              <Sparkles className="w-2.5 h-2.5 text-amber-600" /> Monogram
                            </span>
                          )}
                          {product.isFeatured && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded w-fit">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Featured
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-3">
                        <span className="text-xs font-semibold text-slate-800">
                          {product.stock || 12} units
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onSelectProductPreview && (
                            <button
                              onClick={() => onSelectProductPreview(product)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 transition-colors cursor-pointer border border-slate-200"
                              title="Live Customer Preview"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDuplicate(product)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
                            title="Duplicate Product"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 transition-colors cursor-pointer border border-slate-200"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingProduct(product)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-600 transition-colors cursor-pointer border border-red-200"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Product Full Modal */}
      <AnimatePresence>
        {(isCreateModalOpen || editingProduct) && (
          <div className="fixed inset-0 z-[70] overflow-y-auto flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => {
                setIsCreateModalOpen(false);
                setEditingProduct(null);
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-10 text-slate-900 max-h-[90vh] flex flex-col font-sans"
            >
              {/* Modal Header */}
              <div className="bg-slate-50 p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {editingProduct ? 'Edit Product Item' : 'Create New Product'}
                    </h3>
                    <span className="text-xs text-slate-500">
                      {editingProduct ? `Updating SKU: ${editingProduct.id}` : 'Add a product to the catalog'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-5 flex-1">
                {/* Title & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Product Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Sovereign Executive Briefcase"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Category *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.category || cat.id}>
                          {cat.name} ({cat.category || cat.id})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price & Stock & Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Price in INR (₹) *
                    </label>
                    <input
                      required
                      type="number"
                      min={0}
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formStock}
                      onChange={(e) => setFormStock(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div className="flex flex-col justify-center space-y-2 pt-2">
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formCustomizable}
                        onChange={(e) => setFormCustomizable(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Enable Monogramming</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsFeatured}
                        onChange={(e) => setFormIsFeatured(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Feature on Homepage</span>
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Product details, leather type, and crafting specifications..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                {/* Craftsmanship Details (Bullet points) */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Key Specifications & Details
                  </label>
                  <div className="space-y-1.5 mb-2">
                    {formDetails.map((det, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800">
                        <span>• {det}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDetail(idx)}
                          className="text-red-500 hover:text-red-700 cursor-pointer p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newDetailInput}
                      onChange={(e) => setNewDetailInput(e.target.value)}
                      placeholder="Add specification bullet point..."
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                    <button
                      type="button"
                      onClick={handleAddDetail}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Product Images */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    High-Res Gallery Images *
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {formImages.map((img, idx) => (
                      <div key={idx} className="relative h-20 rounded-lg overflow-hidden border border-slate-300 group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-slate-900/70 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newImageInput}
                      onChange={(e) => setNewImageInput(e.target.value)}
                      placeholder="Paste image URL (https://...)"
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Add Image
                    </button>
                  </div>
                </div>

                {/* Color Variants */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Color Variants ({formColors.length})
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formColors.map((col, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-1.5 pl-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                        <span className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: col.hex }} />
                        <span className="font-semibold text-slate-900">{col.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(idx)}
                          className="text-red-500 hover:text-red-700 cursor-pointer p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      placeholder="Color name (e.g. Classic Brown)"
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="w-10 h-8 rounded border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={handleAddColor}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Add Color
                    </button>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setEditingProduct(null);
                    }}
                    className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Check className="w-4 h-4 text-white" />
                    <span>{editingProduct ? 'Save Changes' : 'Publish Product'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingProduct && (
          <div className="fixed inset-0 z-[70] overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setDeletingProduct(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 p-6 z-10 space-y-4 font-sans"
            >
              <div className="flex items-center gap-3 text-red-600">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    Delete Product?
                  </h3>
                  <span className="text-xs text-slate-500">
                    Remove "{deletingProduct.name}" from catalog
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                Are you sure you want to permanently remove this product from the catalog? This action will update all customer views immediately.
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setDeletingProduct(null)}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-xs"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
