import { Link, useNavigate } from 'react-router';
import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Error Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-error/20 rounded-full animate-ping"></div>
            <div className="relative bg-error/10 p-6 rounded-full">
              <AlertTriangle size={80} className="text-error" />
            </div>
          </div>
        </div>

        {/* 404 Number */}
        <h1 className="text-9xl font-bold mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            404
          </span>
        </h1>

        {/* Title */}
        <h2 className="text-4xl font-bold mb-4">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-lg opacity-70 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or the URL might be incorrect.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link to="/" className="btn btn-primary btn-lg gap-2">
            <Home size={20} />
            Back to Home
          </Link>
          
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-outline btn-lg gap-2"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
        {/* Helpful Links */}
        <div className="divider">Popular Pages</div>
        <div className="flex flex-wrap gap-2 justify-center">
          <Link to="/all-issues" className="btn btn-sm btn-ghost">
            All Issues
          </Link>
          <Link to="/about" className="btn btn-sm btn-ghost">
            About Us
          </Link>
          <Link to="/contact" className="btn btn-sm btn-ghost">
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;