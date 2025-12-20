import { Link } from 'react-router';
import { AlertCircle, Search } from 'lucide-react';

const Banner = () => {
  return (
    <div className="hero min-h-[600px] bg-gradient-to-r from-primary to-secondary">
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-4xl">
          <div className="flex justify-center mb-6">
            <AlertCircle size={80} className="text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Building a Better Chattogram Together
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-base-100">
            Report infrastructure issues and track their resolution in real-time
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard/report-issue" className="btn btn-lg btn-accent">
              <AlertCircle size={20} />
              Report an Issue
            </Link>
            <Link to="/all-issues" className="btn btn-lg btn-outline btn-accent">
              <Search size={20} />
              View All Issues
            </Link>
          </div>
          
          {/* Stats */}
          <div className="stats stats-vertical lg:stats-horizontal shadow-xl mt-12 bg-base-100 text-base-content">
            <div className="stat">
              <div className="stat-title">Total Issues</div>
              <div className="stat-value text-primary">1,247</div>
              
            </div>
            <div className="stat">
              <div className="stat-title">Resolved</div>
              <div className="stat-value text-success">892</div>
              
            </div>
            <div className="stat">
              <div className="stat-title">Active Users</div>
              <div className="stat-value text-secondary">5,420</div>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;