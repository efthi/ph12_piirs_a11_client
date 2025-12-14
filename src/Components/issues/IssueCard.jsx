import { Link, useNavigate } from 'react-router';
import { MapPin, ThumbsUp, Calendar } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { toggleUpvote } from '../../services/issueService';

const IssueCard = ({ issue }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    _id,
    title,
    category,
    status,
    priority,
    location,
    upvotes,
    upvotedBy,
    image,
    createdAt,
    reportedBy,
    isBoosted
  } = issue;

  // Upvote mutation
  const upvoteMutation = useMutation({
    mutationFn: toggleUpvote,
    onSuccess: (response) => {
      queryClient.invalidateQueries(['allIssues']);
      queryClient.invalidateQueries(['my-issues']);
      
      if (response.action === 'added') {
        toast.success("Upvoted!");
      } else {
        toast.info("Upvote removed");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to upvote");
    },
  });

  // Handle upvote click
  const handleUpvote = (e) => {
    e.preventDefault(); // Card এর link click হবে না
    e.stopPropagation();

    // Check if user logged in
    if (!user) {
      toast.error("Please login to upvote");
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    // Check if user trying to upvote own issue
    if (reportedBy?.uid === user.uid) {
      toast.error("You cannot upvote your own issue");
      return;
    }

    // Toggle upvote
    upvoteMutation.mutate({ issueId: _id, userId: user.uid });
  };

  // Check if current user has upvoted
  const hasUpvoted = upvotedBy?.includes(user?.uid);

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'resolved': return 'badge-success';
      case 'in-progress': return 'badge-warning';
      case 'pending': return 'badge-info';
      case 'closed': return 'badge-neutral';
      default: return 'badge-ghost';
    }
  };

  const getPriorityColor = (priority) => {
    return priority === 'High' ? 'badge-error' : 'badge-ghost';
  };

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
      <figure className="h-48 overflow-hidden relative">
        <img 
          src={image || '/images/default-issue.jpg'} 
          alt={title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        {/* Boosted Badge */}
        {isBoosted && (
          <div className="absolute top-2 right-2 badge badge-secondary gap-1">
            ⚡ Boosted
          </div>
        )}
      </figure>
      
      <div className="card-body">
        <div className="flex gap-2 mb-2 flex-wrap">
          <span className={`badge ${getPriorityColor(priority)}`}>
            {priority || 'Normal'}
          </span>
          <span className={`badge ${getStatusColor(status)}`}>
            {status}
          </span>
          <span className="badge badge-outline">
            {category}
          </span>
        </div>
        
        <h2 className="card-title text-lg line-clamp-2">
          {title}
        </h2>
        
        <div className="flex items-center gap-2 text-sm opacity-70">
          <MapPin size={16} />
          <span className="line-clamp-1">{location}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm opacity-70">
          <Calendar size={16} />
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
        
        <div className="divider my-2"></div>
        
        <div className="card-actions justify-between items-center">
          {/* Upvote Button with Functionality */}
          <button 
            onClick={handleUpvote}
            className={`btn btn-sm gap-1 ${
              hasUpvoted 
                ? 'btn-primary' 
                : 'btn-ghost hover:btn-primary'
            }`}
            disabled={upvoteMutation.isPending}
            title={!user ? 'Login to upvote' : hasUpvoted ? 'Remove upvote' : 'Upvote this issue'}
          >
            <ThumbsUp 
              size={16} 
              className={hasUpvoted ? 'fill-current' : ''}
            />
            <span className="font-bold">{upvotes || 0}</span>
          </button>
          
          <Link 
            to={`/dashboard/view-issue/${_id}`} 
            className="btn btn-sm btn-primary"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;