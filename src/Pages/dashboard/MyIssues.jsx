import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Plus,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router";
import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MyIssues = () => {

  const {user} = useAuth();
  const axiosSec = useAxiosSecure();
  
  const {data, isLoading, error} = useQuery({
    queryKey:['my-issues', user?.email],
    queryFn: async () => {
      const res = await axiosSec.get(`/api/issues-by-user/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const issues = data || [];

  // Demo data - পরে API থেকে আসবে
  const demoIssues = [
    {
      _id: "1",
      title: "Broken Streetlight on Station Road",
      category: "Streetlight",
      status: "Pending",
      priority: "High",
      location: "Station Road, Chattogram",
      upvotes: 45,
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400",
      createdAt: new Date().toISOString(),
      isBoosted: true
    },
    {
      _id: "2",
      title: "Large Pothole Near GEC Circle",
      category: "Road Damage",
      status: "In-Progress",
      priority: "Normal",
      location: "GEC Circle, Chattogram",
      upvotes: 23,
      image: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400",
      createdAt: new Date().toISOString(),
      isBoosted: false
    },
    {
      _id: "3",
      title: "Water Leakage in Agrabad Area",
      category: "Water Supply",
      status: "Resolved",
      priority: "Normal",
      location: "Agrabad, Chattogram",
      upvotes: 12,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
      createdAt: new Date().toISOString(),
      isBoosted: false
    },
  ];

  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Status badge color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'resolved': return 'badge-success';
      case 'in-progress': return 'badge-warning';
      case 'pending': return 'badge-info';
      case 'closed': return 'badge-neutral';
      default: return 'badge-ghost';
    }
  };

  // Priority badge color
  const getPriorityColor = (priority) => {
    return priority === 'High' ? 'badge-error' : 'badge-ghost';
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Issues</h1>
          <p className="text-base-content/70">
            Manage and track all your reported issues
          </p>
        </div>
        <Link to="/dashboard/report-issue" className="btn btn-primary gap-2">
          <Plus size={20} />
          Report New Issue
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Issues</div>
            <div className="stat-value text-primary">{issues.length}</div>
          </div>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Pending</div>
            <div className="stat-value text-info">1</div>
          </div>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">In Progress</div>
            <div className="stat-value text-warning">1</div>
          </div>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Resolved</div>
            <div className="stat-value text-success">1</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow-md mb-6">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="form-control flex-1">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search by title or location..."
                  className="input input-bordered w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-square btn-primary">
                  <Search size={20} />
                </button>
              </div>
            </div>

            {/* Status Filter */}
            <div className="form-control w-full lg:w-48">
              <select
                className="select select-bordered w-full"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="form-control w-full lg:w-48">
              <select
                className="select select-bordered w-full"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Streetlight">Streetlight</option>
                <option value="Road Damage">Road Damage</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Drainage">Drainage</option>
                <option value="Garbage">Garbage</option>
                <option value="Footpath">Footpath</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedStatus || selectedCategory) && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {searchTerm && (
                <div className="badge badge-primary gap-2">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm("")}>✕</button>
                </div>
              )}
              {selectedStatus && (
                <div className="badge badge-secondary gap-2">
                  {selectedStatus}
                  <button onClick={() => setSelectedStatus("")}>✕</button>
                </div>
              )}
              {selectedCategory && (
                <div className="badge badge-accent gap-2">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory("")}>✕</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {issues.length === 0 ? (
          /* Empty State */
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center py-16">
              <AlertCircle size={64} className="text-base-content/30 mb-4" />
              <h3 className="text-2xl font-bold mb-2">No Issues Found</h3>
              <p className="text-base-content/70 mb-6">
                You haven't reported any issues yet. Start by reporting one!
              </p>
              <Link to="/dashboard/report-issue" className="btn btn-primary gap-2">
                <Plus size={20} />
                Report Your First Issue
              </Link>
            </div>
          </div>
        ) : (
          /* Issues Cards */
          issues.map((issue) => (
            <div key={issue._id} className="card bg-base-100 shadow-md hover:shadow-xl transition-all">
              <div className="card-body">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    <div className="w-full lg:w-48 h-32 rounded-lg overflow-hidden relative">
                      <img
                        src={issue.image || "/images/default-issue.jpg"}
                        alt={issue.title}
                        className="w-full h-full object-cover"
                      />
                      {issue.isBoosted && (
                        <div className="absolute top-2 right-2 badge badge-secondary gap-1">
                          ⚡ Boosted
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {/* Badges */}
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <span className={`badge ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                      <span className={`badge ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </span>
                      <span className="badge badge-outline">
                        {issue.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2">{issue.title}</h3>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 text-sm opacity-70 mb-4">
                      <span>📍 {issue.location}</span>
                      <span>📅 {new Date(issue.createdAt).toLocaleDateString()}</span>
                      <span>👍 {issue.upvotes} upvotes</span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/dashboard/view-issue/${issue._id}`}
                        className="btn btn-sm btn-primary gap-2"
                      >
                        <Eye size={16} />
                        View Details
                      </Link>

                      {/* Edit - শুধু Pending status এ */}
                      {issue.status === 'Pending' && (
                        <button
                          onClick={() => setShowEditModal(true)}
                          className="btn btn-sm btn-outline gap-2"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="btn btn-sm btn-outline btn-error gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Edit Issue</h3>
            
            {/* Edit Form - Skeleton */}
            <form>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  defaultValue="Broken Streetlight on Station Road"
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  defaultValue="The streetlight is not working..."
                ></textarea>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <select className="select select-bordered">
                  <option>Streetlight</option>
                  <option>Road Damage</option>
                  <option>Water Supply</option>
                </select>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  defaultValue="Station Road, Chattogram"
                />
              </div>

              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete this issue? This action cannot be undone.
            </p>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn btn-error">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyIssues;