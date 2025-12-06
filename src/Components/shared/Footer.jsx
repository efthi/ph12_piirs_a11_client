import { Link } from "react-router";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { AlertCircle } from "lucide-react";

const Footer = () => {
  return (
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
              <li>
                <a href="#" className="hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  All Issues
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Report Issue
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms of Service
                </a>
              </li>
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
        
          <div className="flex justify-center gap-3 mt-2">
            <a href="#" className="btn btn-circle btn-sm btn-ghost">
              <FaFacebook size={20} />
            </a>
            <a href="#" className="btn btn-circle btn-sm btn-ghost">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="btn btn-circle btn-sm btn-ghost">
              <FaLinkedin size={20} />
            </a>
          </div>
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Port City PIIRS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
