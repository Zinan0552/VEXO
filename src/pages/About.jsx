import React from 'react';
import { 
  Users, 
  Target, 
  Award, 
  Shield, 
  Heart, 
  Star,
  Calendar,
  MapPin
} from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Our Mission",
      description: "To empower individuals through martial arts training, building confidence, discipline, and physical fitness in a supportive community environment."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safety First",
      description: "We prioritize safety in all our training programs with certified instructors and proper protective equipment for every student."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Community Focus",
      description: "Building strong relationships and supporting each other's growth both inside and outside the dojo."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Excellence",
      description: "Committed to providing world-class training and helping students achieve their personal best in martial arts."
    }
  ];

  const instructors = [
    {
      name: "Master Chen Li",
      role: "Head Instructor - 5th Dan Black Belt",
      experience: "25+ years experience",
      specialty: "Karate & Self-Defense",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Sensei Maria Rodriguez",
      role: "Brazilian Jiu-Jitsu Coach - Black Belt",
      experience: "15+ years experience",
      specialty: "BJJ & Grappling",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Coach David Kim",
      role: "MMA & Fitness Coach",
      experience: "12+ years experience",
      specialty: "MMA & Conditioning",
      image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300&h=300&fit=crop&crop=face"
    }
  ];

  const stats = [
    { number: "15+", label: "Years Experience" },
    { number: "2,000+", label: "Students Trained" },
    { number: "50+", label: "Black Belts" },
    { number: "100%", label: "Satisfaction Rate" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-900 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              ABOUT <span className="text-red-600">XTREME X</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Transforming lives through martial arts since 2008. We are more than a dojo - we are a family dedicated to personal growth and excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p className="text-lg">
                  Founded in 2008 by Master Chen Li, Xtreme X Martial Arts began as a small community dojo with a simple mission: to make high-quality martial arts training accessible to everyone.
                </p>
                <p>
                  What started as a single studio with 20 students has grown into a premier martial arts academy training thousands of students across multiple disciplines. Our success is built on the foundation of traditional martial arts values combined with modern training techniques.
                </p>
                <p>
                  We believe that martial arts is not just about learning to fight, but about developing character, building confidence, and creating a supportive community where everyone can thrive.
                </p>
              </div>
            </div>
            <div className="bg-gray-800 h-96 rounded-lg flex items-center justify-center">
              <span className="text-white text-6xl">🥋</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold">{stat.number}</div>
                <div className="text-gray-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Xtreme X?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We stand out from other martial arts schools through our commitment to excellence and student success.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
                <div className="text-red-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Instructors</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Learn from the best in the industry. Our certified instructors bring decades of combined experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {instructors.map((instructor, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={instructor.image}
                  alt={instructor.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{instructor.name}</h3>
                  <p className="text-red-600 font-semibold mb-2">{instructor.role}</p>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">{instructor.experience}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Star className="w-4 h-4 mr-2" />
                    <span className="text-sm">{instructor.specialty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facility Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-800 h-96 rounded-lg flex items-center justify-center">
              <span className="text-white text-6xl">🏢</span>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">State-of-the-Art Facility</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Our 5,000 square foot facility is specifically designed for martial arts training, featuring:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                    Spring-loaded flooring for joint protection
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                    Professional-grade training equipment
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                    Full-size competition mats
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                    Modern locker rooms and showers
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                    Parent viewing area with comfortable seating
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            READY TO START YOUR JOURNEY?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community and discover how martial arts can transform your life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 rounded-md font-bold text-lg transition">
              FREE TRIAL CLASS
            </button>
            <button className="border-2 border-white hover:bg-white hover:text-red-600 text-white px-8 py-3 rounded-md font-bold text-lg transition">
              CONTACT US
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-red-600 mb-4">XTREME X</h3>
              <p className="text-gray-400">
                Transforming lives through martial arts since 2008.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-white transition">Home</a></li>
                <li><a href="/about" className="hover:text-white transition">About</a></li>
                <li><a href="/shop" className="hover:text-white transition">Shop</a></li>
                <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Programs</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Kids Programs</a></li>
                <li><a href="#" className="hover:text-white transition">Adult Training</a></li>
                <li><a href="#" className="hover:text-white transition">Competition Team</a></li>
                <li><a href="#" className="hover:text-white transition">Private Lessons</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  123 Martial Arts Way, City, State 12345
                </li>
                <li>(555) 123-4567</li>
                <li>info@xtremexmartialarts.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Xtreme X Martial Arts. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;