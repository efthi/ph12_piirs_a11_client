import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  MapPin,
  Calendar,
  User,
  ThumbsUp,
  Edit,
  Trash2,
  Zap,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { deleteIssue, toggleUpvote, createBoostSession } from "../services/issueService";
import IssueTimeline from "../components/issues/IssueTimeline";
import useAxiosSecure from "../hooks/useAxiosSecure";

const IssueDetails = () => {
  const { id } = useParams(); // Get issue ID from URL
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, userData } = useAuth();
  const axiosSec = useAxiosSecure();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // TanStack Query -
  const { data, isLoading, error } = useQuery({
    queryKey: ["view-issue", id], // Unique key for this query
    queryFn: async () => {
      const response = await axiosSec.get(`/api/issue/${id}`);
      return response.data;
    },
    enabled:!!id,
  });

  const issue = data;

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteIssue,
    onSuccess: () => {
      queryClient.invalidateQueries(["allIssues"]);
      queryClient.invalidateQueries(["myIssues"]);
      toast.success("Issue deleted successfully!");
      navigate("/all-issues");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete issue");
    },
  });

  // Upvote mutation
  const upvoteMutation = useMutation({
    mutationFn: toggleUpvote,
    onSuccess: (response) => {
      queryClient.invalidateQueries(["issue", id]);
      queryClient.invalidateQueries(["allIssues"]);

      if (response.action === "added") {
        toast.success("Upvoted!");
      } else {
        toast.info("Upvote removed");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to upvote");
    },
  });

  // Handle upvote
  const handleUpvote = () => {
    if (!user) {
      toast.error("Please login to upvote");
      navigate("/login", { state: `/issue/${id}` });
      return;
    }

    if (issue.reportedBy.uid === user.uid) {
      toast.error("You cannot upvote your own issue");
      return;
    }

    upvoteMutation.mutate({ issueId: id, userId: user.uid });
  };

  // Handle delete
  const handleDelete = () => {
    deleteMutation.mutate(id);
    setShowDeleteConfirm(false);
  };

  //handle boost
  const boostMutation = useMutation({
    mutationFn: ({ issueId }) => createBoostSession({ axiosSec, issueId }),
    onSuccess: (data) => {
      window.location.href = data.url; // Stripe checkout এ যাবে
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to start boost payment"
      );
    },
  });

  // Check if user owns this issue
  const isOwner = user && issue?.reportedBy?.uid === user.uid;
  const canEdit = isOwner && issue?.status === "Pending";
  const canDelete = isOwner;
  const hasUpvoted = issue?.upvotedBy?.includes(user?.uid);

  // Status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "badge-success";
      case "in-progress":
        return "badge-warning";
      case "pending":
        return "badge-info";
      case "closed":
        return "badge-neutral";
      default:
        return "badge-ghost";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="alert alert-error">
          <AlertCircle />
          <span>Issue not found or failed to load</span>
        </div>
        <Link to="/all-issues" className="btn btn-primary mt-4">
          <ArrowLeft size={20} />
          Back to All Issues
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="btn btn-ghost gap-2 mb-6">
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Card */}
          <div className="card bg-base-100 shadow-xl">
            {/* Image */}
            {issue.image && (
              <figure className="max-h-96 overflow-hidden">
                <img
                  src={issue.image}
                  alt={issue.title}
                  className="w-full h-full object-cover"
                />
              </figure>
            )}

            <div className="card-body">
              {/* Badges */}
              <div className="flex gap-2 flex-wrap mb-4">
                <span
                  className={`badge ${
                    issue.priority === "High" ? "badge-error" : "badge-ghost"
                  }`}
                >
                  {issue.priority || "Normal"} Priority
                </span>
                <span className={`badge ${getStatusColor(issue.status)}`}>
                  {issue.status}
                </span>
                <span className="badge badge-outline">{issue.category}</span>
                {issue.isBoosted && (
                  <span className="badge badge-secondary gap-1">
                    <Zap size={14} />
                    Boosted
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="card-title text-3xl mb-4">{issue.title}</h1>
              <h2 className="card-title text-xl mb-4">{issue.tracking}</h2>

              {/* Description */}
              <div className="prose max-w-none">
                <p className="text-base leading-relaxed">{issue.description}</p>
              </div>

              <div className="divider"></div>

              {/* Meta Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="text-primary" size={20} />
                  <div>
                    <p className="text-xs opacity-60">Location</p>
                    <p className="font-semibold">{issue.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="text-primary" size={20} />
                  <div>
                    <p className="text-xs opacity-60">Reported On</p>
                    <p className="font-semibold">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <User className="text-primary" size={20} />
                  <div>
                    <p className="text-xs opacity-60">Reported By</p>
                    <p className="font-semibold">{issue.reportedBy?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ThumbsUp className="text-primary" size={20} />
                  <div>
                    <p className="text-xs opacity-60">Upvotes</p>
                    <p className="font-semibold">{issue.upvotes || 0}</p>
                  </div>
                </div>
              </div>

              <div className="divider"></div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {/* Upvote Button */}
                <button
                  onClick={handleUpvote}
                  className={`btn gap-2 ${
                    hasUpvoted ? "btn-primary" : "btn-outline btn-primary"
                  }`}
                  disabled={upvoteMutation.isPending}
                >
                  <ThumbsUp size={18} />
                  {hasUpvoted ? "Upvoted" : "Upvote"} ({issue.upvotes || 0})
                </button>

                {/* Edit Button */}
                {canEdit && (
                  <Link
                    to={`/dashboard/edit-issue/${id}`}
                    className="btn btn-outline gap-2"
                  >
                    <Edit size={18} />
                    Edit
                  </Link>
                )}

                {/* Delete Button */}
                {canDelete && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="btn btn-outline btn-error gap-2"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                )}

                {/* Boost Button */}
                {!issue.isBoosted && isOwner && (
                  <button
                    className="btn btn-secondary gap-2"
                    onClick={() => boostMutation.mutate({ issueId: id })}
                    disabled={boostMutation.isPending}
                  >
                    <Zap size={18} />
                    {boostMutation.isPending
                      ? "Redirecting..."
                      : "Boost Issue (৳100)"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Issue Timeline</h2>
              <IssueTimeline timeline={issue.timeline || []} />
            </div>
          </div>
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6">
          {/* Assigned Staff */}
          {issue.assignedStaff && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg">Assigned Staff</h3>
                <div className="flex items-center gap-3 mt-2">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-12">
                      <span className="text-xl">
                        {issue.assignedStaff.name?.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold">{issue.assignedStaff.name}</p>
                    <p className="text-sm opacity-60">Staff Member</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Issue Stats */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg">Quick Stats</h3>
              <div className="stats stats-vertical shadow-sm">
                <div className="stat py-3">
                  <div className="stat-title text-xs">Status</div>
                  <div className="stat-value text-lg">{issue.status}</div>
                </div>
                <div className="stat py-3">
                  <div className="stat-title text-xs">Priority</div>
                  <div className="stat-value text-lg">{issue.priority}</div>
                </div>
                <div className="stat py-3">
                  <div className="stat-title text-xs">Category</div>
                  <div className="stat-value text-lg">{issue.category}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Help */}
          <div className="card bg-primary text-primary-content shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg">Need Help?</h3>
              <p className="text-sm">
                If you have questions about this issue, please contact support.
              </p>
              <button className="btn btn-sm btn-accent mt-2">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete this issue? This action cannot be
              undone.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueDetails;
