import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw,
  Check,
  Plus,
  Minus
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, addToCart, addToWishlist, isInWishlist, isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/db.json');
        const data = await response.json();
        const foundProduct = data.products.find(p => p.id === parseInt(id));
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          toast.error('Product not found!');
          navigate('/shop');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details!');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.warning('Please login to add items to cart!');
      return;
    }

    try {
      // Add the product multiple times based on quantity
      for (let i = 0; i < quantity; i++) {
        await addToCart(product);
      }
      toast.success(`${quantity} ${product.name} added to cart! 🛒`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to add item to cart!');
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      toast.warning('Please login to add items to wishlist!');
      return;
    }

    try {
      await addToWishlist(product);
      if (isInWishlist(product.id)) {
        toast.info(`💔 ${product.name} removed from wishlist!`);
      } else {
        toast.success(`❤️ ${product.name} added to wishlist!`);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to update wishlist!');
    }
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <button
          onClick={() => navigate('/shop')}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Products
          </button>
        </div>
      </div>

      {/* Product Details - Simplified Layout */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              
              {/* Single Product Image - Centered and Enhanced */}
              <div className="flex justify-center items-center">
                <div className="w-full max-w-lg">
                  <div className="relative group">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-96 object-cover rounded-2xl shadow-xl transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Premium Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        PREMIUM
                      </span>
                    </div>
                    {/* Stock Status */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-2 rounded-full text-sm font-semibold backdrop-blur-sm ${
                        product.inStock 
                          ? 'bg-green-500/90 text-white' 
                          : 'bg-red-500/90 text-white'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Product Header */}
                <div>
                  <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium mb-3">
                    {product.category}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(product.rating) ? 'fill-current' : ''
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-gray-600">{product.rating}</span>
                    </div>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">{product.reviews} reviews</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline space-x-2 mb-4">
                    <span className="text-3xl font-bold text-red-600">${product.price}</span>
                    <span className="text-lg text-gray-500 line-through">${(product.price * 1.2).toFixed(2)}</span>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                      20% OFF
                    </span>
                  </div>
                </div>

                {/* Description Preview */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {product.description}
                  </p>
                </div>

                {/* Quantity Selector */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-16 text-center text-lg font-semibold border border-gray-300 rounded-lg py-2">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center shadow-lg"
                  >
                    <ShoppingCart className="w-6 h-6 mr-3" />
                    Add to Cart
                  </button>
                  
                  <button
                    onClick={handleAddToWishlist}
                    className="w-16 h-16 border-2 border-gray-300 rounded-xl flex items-center justify-center hover:border-red-600 hover:text-red-600 transition-all duration-300 transform hover:scale-105"
                  >
                    <Heart 
                      className={`w-7 h-7 ${
                        isInWishlist(product.id) ? 'fill-current text-red-600' : ''
                      }`} 
                    />
                  </button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-t border-gray-200">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Truck className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-semibold">Free Shipping</p>
                      <p className="text-sm text-gray-600">On orders over $75</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <RotateCcw className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-semibold">30-Day Returns</p>
                      <p className="text-sm text-gray-600">Money back guarantee</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Shield className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="font-semibold">2-Year Warranty</p>
                      <p className="text-sm text-gray-600">Full protection</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Tabs */}
            <div className="border-t border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-8">
                  {['description', 'specifications', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                        activeTab === tab
                          ? 'border-red-600 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8">
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">Key Features:</h4>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <Check className="w-4 h-4 text-green-600 mr-2" />
                            Premium quality materials
                          </li>
                          <li className="flex items-center">
                            <Check className="w-4 h-4 text-green-600 mr-2" />
                            Imported craftsmanship
                          </li>
                          <li className="flex items-center">
                            <Check className="w-4 h-4 text-green-600 mr-2" />
                            Durable and long-lasting
                          </li>
                          <li className="flex items-center">
                            <Check className="w-4 h-4 text-green-600 mr-2" />
                            Professional grade
                          </li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">Perfect For:</h4>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <Check className="w-4 h-4 text-green-600 mr-2" />
                            Martial Arts Training
                          </li>
                          <li className="flex items-center">
                            <Check className="w-4 h-4 text-green-600 mr-2" />
                            Competitions
                          </li>
                          <li className="flex items-center">
                            <Check className="w-4 h-4 text-green-600 mr-2" />
                            Daily Practice
                          </li>
                          <li className="flex items-center">
                            <Check className="w-4 h-4 text-green-600 mr-2" />
                            Professional Use
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Product Details</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Category</span>
                            <span className="font-medium capitalize">{product.category}</span>
                          </div>
                          <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Material</span>
                            <span className="font-medium">Premium Cotton Blend</span>
                          </div>
                          <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Weight</span>
                            <span className="font-medium">450 GSM</span>
                          </div>
                          <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Origin</span>
                            <span className="font-medium">Imported</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Shipping & Returns</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Delivery Time</span>
                            <span className="font-medium">3-5 Business Days</span>
                          </div>
                          <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Return Policy</span>
                            <span className="font-medium">30 Days</span>
                          </div>
                          <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Warranty</span>
                            <span className="font-medium">2 Years</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-center bg-gray-50 p-4 rounded-lg">
                        <div className="text-3xl font-bold text-gray-900">{product.rating}</div>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating) ? 'fill-current' : ''
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{product.reviews} reviews</div>
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-gray-700">
                          Customers love the quality and durability of this product. Perfect for serious martial artists.
                        </p>
                      </div>
                    </div>

                    {/* Sample Reviews */}
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                          <span className="font-semibold">Excellent Quality!</span>
                        </div>
                        <p className="text-gray-700">
                          "This is exactly what I needed for my training. The material is top-notch and it fits perfectly."
                        </p>
                        <div className="text-sm text-gray-500 mt-2">- John D.</div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(4)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                          <span className="font-semibold">Great Product</span>
                        </div>
                        <p className="text-gray-700">
                          "Very comfortable and durable. Would definitely recommend to other martial artists."
                        </p>
                        <div className="text-sm text-gray-500 mt-2">- Sarah M.</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;