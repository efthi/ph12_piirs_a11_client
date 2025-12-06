import { Link } from 'react-router';
import { MapPin, ThumbsUp, Calendar } from 'lucide-react';

const IssueCard = ({ issue }) => {
  const {
    _id,
    title,
    category,
    status,
    priority,
    location,
    upvotes,
    image,
    createdAt
  } = issue;

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
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
      <figure className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </figure>
      
      <div className="card-body">
        <div className="flex gap-2 mb-2">
          <span className={`badge ${getPriorityColor(priority)}`}>
            {priority}
          </span>
          <span className={`badge ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>
        
        <h2 className="card-title text-lg">
          {title}
        </h2>
        
        <div className="flex items-center gap-2 text-sm opacity-70">
          <MapPin size={16} />
          <span>{location}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm opacity-70">
          <Calendar size={16} />
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
        
        <div className="divider my-2"></div>
        
        <div className="card-actions justify-between items-center">
          <button className="btn btn-sm btn-ghost gap-1">
            <ThumbsUp size={16} />
            <span className="font-bold">{upvotes}</span>
          </button>
          
          <Link to={`/issue/${_id}`} className="btn btn-sm btn-primary">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;