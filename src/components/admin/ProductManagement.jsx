
import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, X, Save, Star, ShoppingBag, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../LoadingSpinner';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [errors, setErrors] = useState({});
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    rating: 0,
    reviews: 0,
    inStock: true
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch('http://localhost:5001/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setFetchLoading(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!newProduct.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (newProduct.name.length < 3) {
      newErrors.name = 'Product name must be at least 3 characters';
    }

    if (!newProduct.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (newProduct.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!newProduct.price || newProduct.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!newProduct.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!newProduct.image.trim()) {
      newErrors.image = 'Image URL is required';
    } else {
      try {
        new URL(newProduct.image);
      } catch (error) {
        newErrors.image = 'Please enter a valid URL';
      }
    }

    if (newProduct.rating < 0 || newProduct.rating > 5) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }

    if (newProduct.reviews < 0) {
      newErrors.reviews = 'Reviews cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add Product Function
  const addProduct = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const productToAdd = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        rating: parseFloat(newProduct.rating),
        reviews: parseInt(newProduct.reviews),
        inStock: Boolean(newProduct.inStock)
      };

      const response = await axios.post('http://localhost:5001/products', productToAdd);
      setProducts(prev => [...prev, response.data]);
      setShowForm(false);
      resetForm();
      toast.success('🎉 Product added successfully!');
    } catch (err) {
      console.error("Error adding product:", err);
      toast.error('❌ Error adding product');
    } finally {
      setLoading(false);
    }
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name || '',
      description: product.description || '',
      price: product.price || 0,
      category: product.category || '',
      image: product.image || '',
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      inStock: product.inStock !== undefined ? product.inStock : true
    });
    setErrors({});
    setShowForm(true);
  };

  // Update Product Function
  const updateProduct = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const updatedProduct = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        rating: parseFloat(newProduct.rating),
        reviews: parseInt(newProduct.reviews),
        inStock: Boolean(newProduct.inStock)
      };

      const response = await axios.put(`http://localhost:5001/products/${editingProduct.id}`, updatedProduct);
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? response.data : p));
      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      toast.success('✨ Product updated successfully!');
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error('❌ Error updating product');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5001/products/${productId}`);
        setProducts(prev => prev.filter(p => p.id !== productId));
        toast.success('🗑️ Product deleted successfully!');
      } catch (err) {
        console.error("Error deleting product:", err);
        toast.error('❌ Error deleting product');
      }
    }
  };

  // Reset Form
  const resetForm = () => {
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      category: '',
      image: '',
      rating: 0,
      reviews: 0,
      inStock: true
    });
    setErrors({});
  };

  // Handle form close
  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
    resetForm();
  };

  // Handle input change with validation
  const handleInputChange = (field, value) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Predefined categories
  const categories = [
    'Uniforms',
    'Training Equipment',
    'Protective Gear',
    'Weapons',
    'Accessories',
    'Imported Clothes',
    'Gadgets',
  ];

  // Futuristic Product Card Component
  const ProductCard = ({ product }) => (
    <div className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 border border-gray-700">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
        
        {/* Top Selling Badge */}
        {product.rating >= 4.5 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            HOT
          </div>
        )}
        
        {/* Stock Status */}
        <div className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${
          product.inStock 
            ? 'bg-green-500/90 text-white' 
            : 'bg-red-500/90 text-white'
        }`}>
          {product.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <div className="flex justify-between items-start mb-3">
          <span className="text-blue-400 text-xs font-semibold uppercase tracking-wide">
            {product.category}
          </span>
          <div className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded-full">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-bold">{product.rating}</span>
            <span className="text-gray-400 text-xs">({product.reviews})</span>
          </div>
        </div>

        {/* Product Name */}
        <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-white">${product.price}</div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => editProduct(product)}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30"
              title="Edit Product"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button 
              onClick={() => deleteProduct(product.id)}
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-red-500/30"
              title="Delete Product"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading Skeleton Component
  const ProductCardSkeleton = () => (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700 animate-pulse">
      <div className="w-full h-48 bg-gray-700"></div>
      <div className="p-5">
        <div className="flex justify-between mb-3">
          <div className="w-20 h-4 bg-gray-700 rounded"></div>
          <div className="w-16 h-4 bg-gray-700 rounded"></div>
        </div>
        <div className="w-3/4 h-5 bg-gray-700 rounded mb-2"></div>
        <div className="w-full h-3 bg-gray-700 rounded mb-4"></div>
        <div className="w-full h-3 bg-gray-700 rounded mb-2"></div>
        <div className="flex justify-between items-center">
          <div className="w-16 h-6 bg-gray-700 rounded"></div>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-gray-700 rounded-xl"></div>
            <div className="w-8 h-8 bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text">
            Product Management
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your product catalog with ease
          </p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 flex items-center gap-3 font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </button>
      </div>

      {/* Stats Overview with Enhanced Hover Effects */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Products Card */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm group hover:bg-gradient-to-br hover:from-blue-500/20 hover:to-blue-600/20 hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 cursor-pointer relative overflow-hidden">
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 group-hover:scale-110 transition-all duration-300">
              <ShoppingBag className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white group-hover:text-blue-200 transition-colors">{products.length}</div>
              <div className="text-blue-300 text-sm group-hover:text-blue-200 transition-colors">Total Products</div>
            </div>
          </div>
        </div>
        
        {/* Top Rated Card */}
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-2xl p-6 backdrop-blur-sm group hover:bg-gradient-to-br hover:from-green-500/20 hover:to-green-600/20 hover:border-green-400/40 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-105 cursor-pointer relative overflow-hidden">
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 group-hover:scale-110 transition-all duration-300">
              <TrendingUp className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-colors" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white group-hover:text-green-200 transition-colors">
                {products.filter(p => p.rating >= 4).length}
              </div>
              <div className="text-green-500 text-sm group-hover:text-green-300 transition-colors">Top Rated</div>
            </div>
          </div>
        </div>
        
        {/* In Stock Card */}
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-2xl p-6 backdrop-blur-sm group hover:bg-gradient-to-br hover:from-yellow-500/20 hover:to-yellow-600/20 hover:border-yellow-400/40 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 hover:scale-105 cursor-pointer relative overflow-hidden">
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-yellow-500/20 rounded-xl group-hover:bg-yellow-500/30 group-hover:scale-110 transition-all duration-300">
              <Star className="w-6 h-6 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white group-hover:text-yellow-200 transition-colors">
                {products.filter(p => p.inStock).length}
              </div>
              <div className="text-yellow-300 text-sm group-hover:text-yellow-200 transition-colors">In Stock</div>
            </div>
          </div>
        </div>
        
        {/* Filtered Card */}
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-sm group hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-purple-600/20 hover:border-purple-400/40 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105 cursor-pointer relative overflow-hidden">
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 group-hover:scale-110 transition-all duration-300">
              <Search className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white group-hover:text-purple-200 transition-colors">{filteredProducts.length}</div>
              <div className="text-purple-300 text-sm group-hover:text-purple-200 transition-colors">Filtered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search Bar */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 group hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-400 transition-colors duration-300 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products by name, category, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 group-hover:border-blue-500/50 group-hover:bg-gray-600/50"
          />
          {/* Animated search pulse effect */}
          {searchTerm && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button 
                onClick={handleFormClose}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={editingProduct ? updateProduct : addProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Professional Martial Arts Gi"
                  required
                  value={newProduct.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full bg-gray-700 border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-gray-400 ${
                    errors.name ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">Description *</label>
                <textarea
                  placeholder="Describe the product features, benefits, and specifications..."
                  required
                  rows="3"
                  value={newProduct.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full bg-gray-700 border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-gray-400 ${
                    errors.description ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Price ($) *</label>
                <input
                  type="number"
                  placeholder="e.g., 89.99"
                  required
                  min="0"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className={`w-full bg-gray-700 border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-gray-400 ${
                    errors.price ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Category *</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full bg-gray-700 border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white ${
                    errors.category ? 'border-red-500' : 'border-gray-600'
                  }`}
                >
                  <option value="" className="text-gray-400">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="text-white">{category}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
              </div>

              {/* Image URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">Image URL *</label>
                <input
                  type="url"
                  placeholder="https://example.com/product-image.jpg"
                  required
                  value={newProduct.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className={`w-full bg-gray-700 border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-gray-400 ${
                    errors.image ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.image && <p className="text-red-400 text-sm mt-1">{errors.image}</p>}
                {newProduct.image && !errors.image && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-400 mb-2">Image Preview:</p>
                    <img 
                      src={newProduct.image} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-xl border border-gray-600"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Rating (0-5)</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="4.5"
                  value={newProduct.rating}
                  onChange={(e) => handleInputChange('rating', e.target.value)}
                  className={`w-full bg-gray-700 border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-gray-400 ${
                    errors.rating ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.rating && <p className="text-red-400 text-sm mt-1">{errors.rating}</p>}
              </div>

              {/* Reviews */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Reviews Count</label>
                <input
                  type="number"
                  min="0"
                  placeholder="150"
                  value={newProduct.reviews}
                  onChange={(e) => handleInputChange('reviews', e.target.value)}
                  className={`w-full bg-gray-700 border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-gray-400 ${
                    errors.reviews ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.reviews && <p className="text-red-400 text-sm mt-1">{errors.reviews}</p>}
              </div>

              {/* In Stock */}
              <div className="md:col-span-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={newProduct.inStock}
                  onChange={(e) => handleInputChange('inStock', e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label className="text-white text-sm font-medium">Product is in stock</label>
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex justify-end gap-3 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={handleFormClose}
                  className="px-6 py-3 border border-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 font-medium"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">
            Products ({filteredProducts.length})
          </h3>
          {searchTerm && (
            <div className="text-gray-400 text-sm">
              Search results for: "<span className="text-blue-400">{searchTerm}</span>"
            </div>
          )}
        </div>

        {fetchLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* No Products Message */}
        {!fetchLoading && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm ? 'No products found' : 'No products yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms or add a new product.'
                : 'Get started by adding your first product to the catalog.'
              }
            </p>
            {!searchTerm && (
              <button 
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 font-semibold"
              >
                Add Your First Product
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;