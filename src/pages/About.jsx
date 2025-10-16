import React, { useState } from 'react';
import { 
  Target, 
  Award, 
  Shield, 
  Heart, 
  Star,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';

const About = () => {
  const [activeTab, setActiveTab] = useState('mission');
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const features = [
    {
      id: 'mission',
      icon: <Target className="w-8 h-8" />,
      title: "Our Mission",
      description: "To empower individuals through martial arts training, building confidence, discipline, and physical fitness in a supportive community environment.",
      details: "We focus on holistic development - mind, body, and spirit. Our curriculum is designed to challenge students while providing a safe and encouraging learning environment."
    },
    {
      id: 'safety',
      icon: <Shield className="w-8 h-8" />,
      title: "Safety First",
      description: "We prioritize safety in all our training programs with certified instructors and proper protective equipment for every student.",
      details: "All instructors are CPR and first-aid certified. Our facility meets the highest safety standards with regular equipment inspections and emergency protocols."
    },
    {
      id: 'community',
      icon: <Heart className="w-8 h-8" />,
      title: "Community Focus",
      description: "Building strong relationships and supporting each other's growth both inside and outside the dojo.",
      details: "We organize regular community events, workshops, and charity fundraisers. Our students become part of a lifelong network of supportive individuals."
    },
    {
      id: 'excellence',
      icon: <Award className="w-8 h-8" />,
      title: "Excellence",
      description: "Committed to providing world-class training and helping students achieve their personal best in martial arts.",
      details: "Our progressive belt system and personalized coaching ensure every student reaches their full potential regardless of starting level."
    }
  ];

  const instructors = [
    {
      name: " Chen Li",
      role: "Head Instruc",
      discription: "Master Chen began training at age 6 and has competed internationally, winning multiple championships. He founded VEXO ICONIC to share his passion for martial arts.",
      image: "https://i.pinimg.com/736x/3d/ed/c3/3dedc3dbd504eb15f824350babfd388e.jpg"
    },
    {
      name: "Sensei Maria Rodriguez",
      role: "Brazilian Jiu-Jitsu ",
      discription: "Maria started her BJJ journey in Brazil and has trained under world champions. She specializes in women's self-defense and competition preparation.",
      image: "https://i.pinimg.com/1200x/f4/33/68/f43368dd3b4c09c77f56dfb74ff6c4be.jpg"
    },
    {
      name: "resphire",
      role: "rouflers tred",
      discription: "David combines traditional martial arts with modern fitness science. He has trained professional fighters and focuses on functional strength and conditioning.",
      image: "https://i.pinimg.com/736x/a0/83/ca/a083cab104cd13627cf69929bb77356e.jpg"
    }
  ];

  const stats = [
    { number: "15+", label: "Years Experience" },
    { number: "2,000+", label: "Students Trained" },
    { number: "50+", label: "Black Belts" },
    { number: "100%", label: "Satisfaction Rate" }
  ];

  const faqs = [
    {
      question: "What age groups do you train?",
      answer: "We offer programs for all ages: Little Dragons (4-6 years), Juniors (7-12 years), Teens (13-17 years), and Adults (18+ years). Each program is age-appropriate and tailored to developmental stages."
    },
    {
      question: "Do I need prior experience to join?",
      answer: "No prior experience is necessary! Our programs are designed for complete beginners to advanced practitioners. We assess each student individually and place them in appropriate classes."
    },
    {
      question: "What should I wear for my first class?",
      answer: "For your first class, comfortable workout clothes (t-shirt and shorts or athletic pants) are perfect. We provide loaner uniforms for beginners. Just bring water and a positive attitude!"
    },
    {
      question: "How often should I train?",
      answer: "We recommend 2-3 times per week for optimal progress. However, we offer flexible scheduling to accommodate different lifestyles and commitment levels."
    }
  ];

  const facilityFeatures = [
    "Spring-loaded flooring for joint protection",
    "Professional-grade training equipment",
    "Full-size competition mats",
    "Modern locker rooms and showers",
    "Parent viewing area with comfortable seating",
    "Strength and conditioning zone",
    "Pro shop with equipment and apparel",
    "Free WiFi and charging stations"
  ];

  const openInstructorModal = (instructor) => {
    setSelectedInstructor(instructor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInstructor(null);
  };

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const handleContactClick = () => {
    setShowContactForm(true);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to a server
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will contact you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
    setShowContactForm(false);
  };

  const closeContactForm = () => {
    setShowContactForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
        
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-900 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              ABOUT <span className="text-red-600">VEXO ICONIC</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Transforming lives through martial arts since 2025. We are more than a dojo - we are a family dedicated to personal growth and excellence.
            </p>
            
            <button 
              onClick={() => document.getElementById('story').scrollIntoView({ behavior: 'smooth' })}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-bold text-lg transition"
            >
              LEARN OUR STORY
            </button>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p className="text-lg">
                  Founded in 2025 by Master Chen Li, VEXO ICONIC began as a small community dojo with a simple mission: to make high-quality martial arts accessible to everyone.
                </p>
                <p>
                  What started as a single studio with 20 students has grown into a premier martial arts academy training thousands of students across multiple disciplines. Our success is built on the foundation of traditional martial arts values combined with modern training techniques.
                </p>
                <p>
                  We believe that martial arts is not just about learning to fight, but about developing character, building confidence, and creating a supportive community where everyone can thrive.
                </p>
              </div>
            </div>
            <div className="bg-gray-800 h-96 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <span className="text-white text-6xl z-10"></span>
              <img src="https://i.pinimg.com/736x/f4/16/7c/f4167c7ce0e59fccd62a19977fa54b82.jpg" alt="12345" />
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

      {/* Features Section with Tabs */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose VEXO ICONIC?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We stand out from other martial arts schools through our commitment to excellence and student success.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === feature.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {feature.title}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-gray-50 rounded-lg p-8">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`${activeTab === feature.id ? 'block' : 'hidden'}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="text-red-600 mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-gray-600 text-lg mb-4">{feature.description}</p>
                    <p className="text-gray-700">{feature.details}</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="font-bold text-lg mb-4">Key Benefits:</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                        Personalized training programs
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                        Progress tracking and feedback
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                        Community support system
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                        Life skills development
                      </li>
                    </ul>
                  </div>
                </div>
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
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => openInstructorModal(instructor)}
              >
                <img
                  src={instructor.image}
                  alt={instructor.name}
                  className="w-full h-120 object-cover"
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
                  <button className="mt-4 text-red-600 font-semibold text-sm hover:underline">
                    Learn More →
                  </button>
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
            <div className="bg-gray-800 h-96 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <span className="text-white text-6xl z-10"></span>
                <img src="https://i.pinimg.com/736x/86/76/e8/8676e8f67894ffa5203b9317f367c4c0.jpg" alt="12345" />
              <div className="absolute bottom-4 left-4 text-white">
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">State-of-the-Art Facility</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Our 5,000 square foot facility is specifically designed for martial arts training, featuring:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                  {facilityFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get answers to common questions about our programs and training.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="font-semibold text-lg">{faq.question}</span>
                  {activeFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-red-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-red-600" />
                  )}
                </button>
                {activeFAQ === index && (
                  <div className="px-6 pb-4 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
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
          <div className="space-x-4">
            <button 
              onClick={handleContactClick}
              className="border-2 border-white hover:bg-white hover:text-red-600 text-white px-8 py-3 rounded-md font-bold text-lg transition"
            >
              CONTACT US
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-red-600 mb-4">VEXO ICONIC</h3>
              <p className="text-gray-400 mb-4">
                Transforming lives through martial arts since 2025.
              </p>
              <div className="flex space-x-4">
                <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded">
                  <span className="sr-only">Facebook</span>
                  📘
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded">
                  <span className="sr-only">Instagram</span>
                  📷
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded">
                  <span className="sr-only">YouTube</span>
                  ▶️
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Programs</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Kids Martial Arts</a></li>
                <li><a href="#" className="hover:text-white transition">Adult Classes</a></li>
                <li><a href="#" className="hover:text-white transition">Competition Team</a></li>
                <li><a href="#" className="hover:text-white transition">Self-Defense</a></li>
                <li><a href="#" className="hover:text-white transition">Private Lessons</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Contact Info</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  123 Martial Arts Way, City, State 12345
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  (555) 123-4567
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  info@vexoiconic.com
                </li>
                <li className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Mon-Fri: 6AM-10PM, Sat: 8AM-6PM
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} VEXO ICONIC Martial Arts. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Instructor Modal */}
      {isModalOpen && selectedInstructor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedInstructor.image}
                alt={selectedInstructor.name}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{selectedInstructor.name}</h3>
              <p className="text-red-600 font-semibold mb-4">{selectedInstructor.role}</p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">About</h4>
                  <p className="text-gray-600">{selectedInstructor.bio}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Certifications</h4>
                  <ul className="space-y-1">
                    {selectedInstructor.certifications.map((cert, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                        {cert}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{selectedInstructor.experience}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Star className="w-4 h-4 mr-2" />
                  <span>Specializes in: {selectedInstructor.specialty}</span>
                </div>
              </div>
              <button className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-semibold">
                Book Private Lesson
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Contact Us</h3>
                <button
                  onClick={closeContactForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-semibold transition"
                >
                  SEND MESSAGE
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;