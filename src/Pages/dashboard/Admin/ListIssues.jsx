import React, { useState } from "react";
import { Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ListIssues = () => {
  const axiosSec = useAxiosSecure();
  const queryClient = useQueryClient();

  // States
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState("");

  // Fetch all issues
  const { data: issues, isLoading, isError } = useQuery({
    queryKey: ["all-issues"],
    queryFn: async () => {
      const res = await axiosSec.get("/api/all-issue");
      return res.data;
    },
  });

  // Fetch staff list
  const { data: staffList } = useQuery({
    queryKey: ['staff-list'],
    queryFn: async () => {
      const res = await axiosSec.get('/api/staff');
      return res.data;
    }
  });

  // Assign staff mutation
  const assignMutation = useMutation({
    mutationFn: async ({ issueId, staffData }) => {
      const res = await axiosSec.put(`/api/issues/${issueId}/assign`, staffData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-issues']);
      toast.success("Staff assigned successfully!");
      closeAssignModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to assign staff");
    }
  });

  // Reject issue mutation
  const rejectMutation = useMutation({
    mutationFn: async (issueId) => {
      const res = await axiosSec.put(`/api/issues/${issueId}/reject`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-issues']);
      toast.success("Issue rejected successfully!");
      setShowRejectModal(false);
      setSelectedIssue(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to reject issue");
    }
  });

  // Sort issues: Boosted first, then by priority
  const sortedIssues = issues?.sort((a, b) => {
    // Boosted issues first
    if (a.isBoosted && !b.isBoosted) return -1;
    if (!a.isBoosted && b.isBoosted) return 1;
    
    // Then by priority
    if (a.priority === 'High' && b.priority !== 'High') return -1;
    if (a.priority !== 'High' && b.priority === 'High') return 1;
    
    return 0;
  });

  // Open assign modal
  const openAssignModal = (issue) => {
    setSelectedIssue(issue);
    setShowAssignModal(true);
  };

  // Close assign modal
  const closeAssignModal = () => {
    setShowAssignModal(false);
    setSelectedIssue(null);
    setSelectedStaff("");
  };

  // Handle assign
  const handleAssign = () => {
    if (!selectedStaff) {
      toast.error("Please select a staff member");
      return;
    }
    
    const staff = staffList?.find(s => s._id === selectedStaff);
    
    if (!staff) {
      toast.error("Staff not found");
      return;
    }
    
    assignMutation.mutate({
      issueId: selectedIssue._id,
      staffData: {
        uid: staff.uid,
        name: staff.name,
        email: staff.email
      }
    });
  };

  // Handle reject
  const handleReject = (issue) => {
    setSelectedIssue(issue);
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    rejectMutation.mutate(selectedIssue._id);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center mt-10">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="alert alert-error">
        <span>Something went wrong! Failed to load issues.</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">All Issues</h2>
        <p className="text-gray-600">Manage all reported issues</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>SL</th>
              <th>Title</th>
              <th>Location</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned Staff</th>
              <th>Upvotes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedIssues?.map((issue, index) => (
              <tr key={issue._id} className={issue.isBoosted ? 'bg-secondary/10' : ''}>
                <th>{index + 1}</th>
                
                {/* Title with boosted badge */}
                <td>
                  <div className="flex items-center gap-2">
                    {issue.title}
                    {issue.isBoosted && (
                      <span className="badge badge-secondary badge-sm">⚡ Boosted</span>
                    )}
                  </div>
                </td>
                
                <td>{issue.location || "Unknown"}</td>
                <td>{issue.category || "N/A"}</td>
                
                {/* Priority */}
                <td>{issue.priority || "Normal"}</td>
                
                {/* Status */}
                <td>{issue.status || "Pending"}</td>
                
                {/* Assigned Staff */}
                <td>
                  {issue.assignedStaff ? (
                    <div className="flex items-center gap-2">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-8">
                          <span className="text-xs">{issue.assignedStaff.name?.charAt(0)}</span>
                        </div>
                      </div>
                      <span className="font-semibold text-sm">{issue.assignedStaff.name}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">Not Assigned</span>
                  )}
                </td>
                
                {/* Upvotes */}
                <td>
                  <span className="font-bold">{issue.upvotes || 0}</span>
                </td>
                
                {/* Actions */}
                <td>
                  <div className="flex gap-2 flex-wrap">
                    {/* View Details */}
                    <Link 
                      to={`/issue/${issue._id}`} 
                      className="btn btn-xs btn-info"
                    >
                      View
                    </Link>
                    
                    {/* Assign Staff Button */}
                    {issue.assignedStaff ? (
                      <button className="btn btn-xs" disabled>
                        Assigned
                      </button>
                    ) : (
                      <button 
                        onClick={() => openAssignModal(issue)}
                        className="btn btn-xs btn-primary"
                      >
                        Assign
                      </button>
                    )}
                    
                    {/* Reject Button - শুধু Pending status এ */}
                    {issue.status === 'Pending' && !issue.assignedStaff && (
                      <button 
                        onClick={() => handleReject(issue)}
                        className="btn btn-xs btn-error"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {sortedIssues?.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No issues found</p>
          </div>
        )}
      </div>

      {/* Assign Staff Modal */}
      {showAssignModal && selectedIssue && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Assign Staff</h3>
            
            <p className="mb-4">
              Assign a staff member to: <strong>{selectedIssue.title}</strong>
            </p>
            
            {/* Staff Dropdown */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Select Staff Member</span>
              </label>
              <select 
                className="select select-bordered w-full"
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
              >
                <option value="">Choose a staff member</option>
                {staffList?.map((staff) => (
                  <option key={staff._id} value={staff._id}>
                    {staff.name} ({staff.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-action">
              <button 
                className="btn btn-ghost" 
                onClick={closeAssignModal}
                disabled={assignMutation.isPending}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleAssign}
                disabled={assignMutation.isPending || !selectedStaff}
              >
                {assignMutation.isPending ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectModal && selectedIssue && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Confirm Reject</h3>
            
            <p className="py-4">
              Are you sure you want to reject this issue?
              <br />
              <strong>"{selectedIssue.title}"</strong>
            </p>

            <div className="modal-action">
              <button 
                className="btn btn-ghost" 
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedIssue(null);
                }}
                disabled={rejectMutation.isPending}
              >
                Cancel
              </button>
              <button 
                className="btn btn-error"
                onClick={confirmReject}
                disabled={rejectMutation.isPending}
              >
                {rejectMutation.isPending ? 'Rejecting...' : 'Reject Issue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListIssues;