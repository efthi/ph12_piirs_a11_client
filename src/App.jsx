import React, { useState } from 'react';
import { Menu, X, ChevronDown, MapPin, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Demo purpose

  // Demo data for latest resolved issues
  const latestIssues = [
    {
      id: 1,
      title: "Broken Streetlight on Station Road",
      category: "Streetlight",
      status: "Resolved",
      priority: "High",
      location: "Station Road, Chattogram",
      upvotes: 45,
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Large Pothole Near GEC Circle",
      category: "Road Damage",
      status: "Resolved",
      priority: "High",
      location: "GEC Circle, Chattogram",
      upvotes: 89,
      image: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Water Leakage in Agrabad Area",
      category: "Water Supply",
      status: "Resolved",
      priority: "Normal",
      location: "Agrabad, Chattogram",
      upvotes: 32,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      title: "Garbage Overflow at Panchlaish",
      category: "Garbage",
      status: "Resolved",
      priority: "High",
      location: "Panchlaish, Chattogram",
      upvotes: 67,
      image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      title: "Damaged Footpath at Kazir Dewri",
      category: "Footpath",
      status: "Resolved",
      priority: "Normal",
      location: "Kazir Dewri, Chattogram",
      upvotes: 28,
      image: "https://images.unsplash.com/photo-1534237886190-ced735ca4b73?w=400&h=300&fit=crop"
    },
    {
      id: 6,
      title: "Blocked Drainage System",
      category: "Drainage",
      status: "Resolved",
      priority: "High",
      location: "Chawkbazar, Chattogram",
      upvotes: 54,
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop"
    }
  ];

  const features = [
    {
      icon: "📱",
      title: "Easy Reporting",
      description: "Report infrastructure issues with just a few taps from your mobile device"
    },
    {
      icon: "⚡",
      title: "Quick Response",
      description: "Get faster resolution with our streamlined issue tracking system"
    },
    {
      icon: "🔍",
      title: "Real-time Tracking",
      description: "Track your reported issues from submission to resolution"
    },
    {
      icon: "👥",
      title: "Community Driven",
      description: "Upvote issues to show public importance and priority"
    },
    {
      icon: "🎯",
      title: "Priority Boost",
      description: "Boost critical issues for faster attention from authorities"
    },
    {
      icon: "💎",
      title: "Premium Support",
      description: "Get unlimited reporting and priority support with premium membership"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">Port City PIIRS</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">All Issues</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">About</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Contact</a>
            </div>

            {/* Profile or Login */}
            <div className="hidden md:flex items-center">
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <img
                      src="https://i.pravatar.cc/150?img=12"
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-blue-600"
                    />
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border">
                      <div className="px-4 py-2 border-b">
                        <p className="font-semibold text-gray-800">John Doe</p>
                        <p className="text-sm text-gray-500">john@example.com</p>
                      </div>
                      <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Dashboard</a>
                      <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <a href="#" className="block py-2 text-gray-700 hover:text-blue-600">Home</a>
              <a href="#" className="block py-2 text-gray-700 hover:text-blue-600">All Issues</a>
              <a href="#" className="block py-2 text-gray-700 hover:text-blue-600">About</a>
              <a href="#" className="block py-2 text-gray-700 hover:text-blue-600">Contact</a>
              {isLoggedIn ? (
                <>
                  <a href="#" className="block py-2 text-gray-700 hover:text-blue-600">Dashboard</a>
                  <button className="block py-2 text-gray-700 hover:text-blue-600">Logout</button>
                </>
              ) : (
                <button className="mt-2 w-full bg-blue-600 text-white px-6 py-2 rounded-lg">Login</button>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Building a Better Chattogram Together
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Report infrastructure issues and track their resolution in real-time
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Report an Issue
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
              View All Issues
            </button>
          </div>
        </div>
      </section>

      {/* Latest Resolved Issues */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Latest Resolved Issues
          </h2>
          <p className="text-gray-600 text-lg">
            See how we're making Port City better, one issue at a time
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestIssues.map((issue) => (
            <div key={issue.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
              <img src={issue.image} alt={issue.title} className="w-full h-48 object-cover" />
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    issue.priority === 'High' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {issue.priority}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    {issue.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{issue.title}</h3>
                <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {issue.location}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      <span className="font-semibold">{issue.upvotes}</span>
                    </button>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Port City PIIRS?
            </h2>
            <p className="text-gray-600 text-lg">
              A modern platform designed for efficient public service delivery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:bg-gray-50 transition">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 text-lg">
            Simple steps to report and track infrastructure issues
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Report Issue</h3>
            <p className="text-gray-600">Submit details with photo and location</p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Admin Reviews</h3>
            <p className="text-gray-600">Admin assigns issue to appropriate staff</p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">3</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Staff Works</h3>
            <p className="text-gray-600">Staff verifies and resolves the issue</p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">4</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Track Progress</h3>
            <p className="text-gray-600">Get updates and track resolution status</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of citizens working together for a better Port City
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition">
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold">Port City PIIRS</span>
              </div>
              <p className="text-gray-400">
                Making Chattogram better, one issue at a time.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="#" className="hover:text-white">All Issues</a></li>
                <li><a href="#" className="hover:text-white">Report Issue</a></li>
                <li><a href="#" className="hover:text-white">Dashboard</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Chattogram, Bangladesh</li>
                <li>info@portcitypiirs.com</li>
                <li>+880 1234-567890</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Port City PIIRS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;