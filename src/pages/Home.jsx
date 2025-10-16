import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight,
  Play,
  Star, 
  Clock, 
  Shield, 
  Truck, 
  Heart, 
  ShoppingBag, 
  Sparkles, 
  TrendingUp, 
  MessageCircle 
} from 'lucide-react';
import Shop from './Shop';

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop",
      title: "Minimalism Meets Elegance",
      subtitle: "Discover timeless pieces for the modern lifestyle"
    },
    {
      image: "https://i.pinimg.com/1200x/43/dc/aa/43dcaaece07b90579fa0d5715940f184.jpg",
      title: "Quality in Simplicity",
      subtitle: "Where every detail matters"
    },
    {
      image: "https://i.pinimg.com/1200x/68/b8/95/68b895adf7028a55223cc4c98ea18765.jpg",
      title: "Modern Living",
      subtitle: "Curated collections for contemporary spaces"
    },
    {
      image: "https://i.pinimg.com/1200x/f6/aa/75/f6aa754bdd7b79d436259b329be541e1.jpg",
      title: "core Living",
      subtitle: "Curated collections for 80's and 90's century spaces"
    }
  ];

  const featuredProducts = [
   {
      "id": 1,
      "name": "Chinese Kung Fu Uniform",
      "description": "Traditional Chinese Kung Fu uniform with silk-like finish, imported from Beijing",
      "price": 69.99,
      "category": "uniforms",
      "image": "https://i.pinimg.com/1200x/82/71/cf/8271cfeb310341abffdf325e64c4b6f0.jpg",
      "rating": 4.3,
      "reviews": 45,
      "inStock": true
    },
    {
      "id": 2,
      "name": "Martial Arts Combo Set",
      "description": "Comfortable cotton combo with martial arts inspired design, perfect for casual wear",
      "price": 49.99,
      "category": "clothing",
      "image": "https://i.pinimg.com/736x/2d/ec/75/2dec75c7662a86f165a6fc6ef35d8b78.jpg",
      "rating": 4.6,
      "reviews": 78,
      "inStock": true
    },
    {
      "id": 9,
      "name": "Brazilian Jiu-Jitsu Gi",
      "description": "Competition-ready BJJ gi with reinforced stitching and pearl weave fabric",
      "price": 129.99,
      "category": "uniforms",
      "image": "https://i.pinimg.com/736x/6e/8c/60/6e8c606c3a434d6b346ec252f3238e46.jpg",
      "rating": 4.7,
      "reviews": 112,
      "inStock": true
    },
    {
      "id": 10,
      "name": "Denim Martial Arts Pants",
      "description": "Flexible and comfortable suit pants with moisture-wicking technology",
      "price": 44.99,
      "category": "clothing",
      "image": "https://i.pinimg.com/1200x/3e/29/e9/3e29e91d704ff881863e0f5a547cb615.jpg",
      "rating": 4.5,
      "reviews": 134,
      "inStock": true
    }
  ];

  const collections = [
    {
      name: "Imported Clothes",
      image: "https://i.pinimg.com/736x/a7/15/4d/a7154def3bc944fa78c44823f885db50.jpg",
      items: "28 items",
      startingPrice: 49.99,
      description: "Premium imported martial arts clothing from around the world",
      features: ["Authentic Designs", "Premium Fabrics", "Comfort Fit", "Multiple Styles"],
      rating: 4.5,
      reviews: 234,
      popularity: 85
    },
    {
      name: "Weapons",
      image: "https://i.pinimg.com/736x/a8/8e/ee/a88eee6411ed8787a38c3b256d1c78e3.jpg",
      items: "42 items",
      startingPrice: 89.99,
      description: "Traditional and modern martial arts weapons collection",
      features: ["High Quality", "Authentic", "Durable", "Training Ready"],
      rating: 4.8,
      reviews: 156,
      popularity: 92
    },
    {
      name: "Accessories",
      image: "https://i.pinimg.com/1200x/65/94/8f/65948facca97fefdcdece316a81241ec.jpg",
      items: "15 items",
      startingPrice: 19.99,
      description: "Essential martial arts accessories and gear",
      features: ["Functional", "Stylish", "Durable", "Essential"],
      rating: 4.3,
      reviews: 189,
      popularity: 78
    },
    {
      name: "Gadgets",
      image: "https://i.pinimg.com/736x/a8/69/ea/a869eadee8dd012449c638ad9f86702f.jpg",
      items: "15 items",
      startingPrice: 39.99,
      description: "Modern training gadgets and technology",
      features: ["Innovative", "Tech-Enabled", "Training Focused", "Modern"],
      rating: 4.6,
      reviews: 267,
      popularity: 88
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Slider */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        ))}
        
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl font-light mb-8 text-gray-200">
              {heroSlides[currentSlide].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/shop')}
                className="bg-white text-black hover:bg-gray-100 px-8 py-4 font-medium text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center"
              >
                Shop Collection
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 font-medium text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center">
                <Play className="w-5 h-5 mr-2" />
                Our Story
              </button>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-8">
          <div className="text-white text-sm rotate-90 origin-bottom-right whitespace-nowrap mb-12">
            Scroll to explore
          </div>
        </div>
      </section>

      {/* Minimal Brand Intro */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-8 leading-tight">
              Less is More. Quality is Everything.
            </h2>
            <p className="text-lg text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
              We believe in the power of simplicity. Our carefully curated collections 
              focus on timeless design, exceptional quality, and sustainable practices. 
              Each piece tells a story of craftsmanship and attention to detail.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center text-gray-900">
              <div className="text-center">
                <div className="text-3xl font-light mb-2">2025</div>
                <div className="text-sm text-gray-600">Founded</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light mb-2">500+</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light mb-2">50+</div>
                <div className="text-sm text-gray-600">Artisans</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-gray-100 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 px-6 py-3 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-red-500" />
              <span className="text-red-600 font-semibold text-sm">Premium Collections</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Curated Collections
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our exclusive, handpicked categories featuring the finest martial arts gear and apparel
            </p>
          </div>

          {/* Enhanced 4-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {collections.map((collection, index) => (
              <div 
                key={index} 
                className="group relative cursor-pointer"
              >
                {/* Main Card Container */}
                <div className="relative overflow-hidden bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 group-hover:-translate-y-3">
                  
                  {/* Background Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 aspect-[3/4]">
                    {/* Shine Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-10"></div>
                    
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Premium Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-2xl shadow-red-500/30 backdrop-blur-sm">
                        Premium
                      </span>
                    </div>

                    {/* Items Count */}
                    <div className="absolute top-4 right-4 z-20">
                      <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-2xl text-sm font-semibold">
                        {collection.items}
                      </div>
                    </div>

                    {/* Hover Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
                      <div className="flex items-center justify-between">
                        <div className="text-white">
                          <div className="text-sm text-gray-200 mb-1">Starting from</div>
                          <div className="text-2xl font-bold">${collection.startingPrice}</div>
                        </div>
                        <button onClick={() => navigate('/shop')} className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-2">
                          <span>Explore</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                      </div>
                    </div>

                    {/* Pulse Animation */}
                    <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-padding rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10">
                      <div className="absolute inset-[2px] rounded-3xl bg-white z-0"></div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="relative z-10 p-6 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                        {collection.name}
                      </h3>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {collection.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2 mb-4">
                      {collection.features?.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Rating and Popularity */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${
                              star <= collection.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`} 
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">({collection.reviews})</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span>{collection.popularity}% Popular</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 animate-bounce"></div>
              </div>
            ))}
          </div>

          {/* Enhanced CTA Section */}
          <div className="text-center mt-16">
            <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Can't Find What You're Looking For?
                </h3>
                <p className="text-gray-600">
                  Contact our experts for personalized recommendations
                </p>
              </div>
              <div className="flex space-x-4">
                <button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Contact Expert</span>
                </button>
                <button className="border-2 border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105">
                  View All Categories
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-red-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16 max-w-6xl mx-auto">
            <div>
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
                Featured Pieces
              </h2>
              <p className="text-lg text-gray-600">
                Our current favorites
              </p>
            </div>
            <button 
              onClick={() => navigate('/shop')}
              className="hidden md:flex items-center text-gray-900 hover:text-gray-700 transition-colors font-medium"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group">
                <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white p-2 hover:bg-gray-50 transition-colors">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white px-3 py-1 text-xs font-medium text-gray-900">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-light text-gray-900 text-lg mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-light text-gray-900">${product.price}</span>
                    <button className="bg-gray-900 hover:bg-black text-white px-4 py-2 text-sm font-medium transition-colors duration-300">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 md:hidden">
            <button 
              onClick={() => navigate('/shop')}
              className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-3 font-medium transition-all duration-300"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight">
              Our Philosophy
            </h2>
            <p className="text-lg text-gray-300 mb-12 leading-relaxed">
              We believe that good design is as little design as possible. 
              Our products are created with intention, focusing on functionality, 
              durability, and timeless appeal. We work with skilled artisans who 
              share our commitment to quality and sustainability.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-gray-900" />
                </div>
                <h3 className="text-xl font-light mb-3">Quality Crafted</h3>
                <p className="text-gray-400 text-sm">Every piece is made to last with premium materials</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-gray-900" />
                </div>
                <h3 className="text-xl font-light mb-3">Timeless Design</h3>
                <p className="text-gray-400 text-sm">Classic styles that transcend trends</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-6 h-6 text-gray-900" />
                </div>
                <h3 className="text-xl font-light mb-3">Conscious Delivery</h3>
                <p className="text-gray-400 text-sm">Sustainable packaging and carbon-neutral shipping</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-light text-gray-900 mb-8 leading-tight">
            Ready to Simplify
            <br />
            Your Space?
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Join thousands of customers who have chosen quality over quantity 
            and simplicity over excess.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/shop')}
              className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-12 py-4 font-medium text-lg transition-all duration-300 hover:scale-105">
            
              Start Shopping
            </button>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-gray-200 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-light text-gray-900 mb-4">VEXO ICONIC</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Minimalist design, maximum impact. Curated collections for modern living.
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-600 mb-8">
              <a href="#" className="hover:text-gray-900 transition-colors">Shop</a>
              <a href="#" className="hover:text-gray-900 transition-colors">About</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Journal</a>
            </div>
            <div className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Essence. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;