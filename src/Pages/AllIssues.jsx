import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import IssueCard from "../components/issues/IssueCard";
import useAxiosPub from "../hooks/useAxiosPub";

const AllIssues = () => {
  const axiosPub = useAxiosPub();
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // TanStack Query - fetch all issues
  const { data, isLoading, error } = useQuery({
    queryKey: ['allIssues'],
    queryFn: async () => {
      const response = await axiosPub.get('/api/all-issue');
      return response.data;
    },
  });

  const issues = data || [];

  // Filter issues based on search
  const filteredIssues = issues.filter((issue) => {
    const searchLower = searchTerm.toLowerCase();
    
    return (
      issue.title?.toLowerCase().includes(searchLower) ||
      issue.location?.toLowerCase().includes(searchLower) ||
      issue.category?.toLowerCase().includes(searchLower) ||
      issue.description?.toLowerCase().includes(searchLower)
    );
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="alert alert-error max-w-md mx-auto">
          <span>Failed to load issues: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">All Issues</h1>
        <p className="text-base-content/70">
          Browse and upvote infrastructure issues in Port City
        </p>
      </div>

      {/* Search Bar */}
      <div className="card bg-base-100 shadow-md mb-6">
        <div className="card-body">
          <div className="form-control">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search by title, location, category..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="btn btn-square"
                  title="Clear search"
                >
                  <X size={20} />
                </button>
              )}
              <button className="btn btn-square btn-primary">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Search results info */}
          {searchTerm && (
            <div className="mt-3">
              <span className="text-sm opacity-70">
                Showing {filteredIssues.length} of {issues.length} issues
              </span>
              {searchTerm && (
                <div className="badge badge-primary gap-2 ml-2">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm("")}>✕</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="stats shadow mb-6 w-full">
        <div className="stat">
          <div className="stat-title">Total Issues</div>
          <div className="stat-value text-primary">{filteredIssues.length}</div>
          <div className="stat-desc">
            {searchTerm && `${issues.length} total issues`}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Pending</div>
          <div className="stat-value text-info">
            {filteredIssues.filter(i => i.status === 'Pending').length}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Resolved</div>
          <div className="stat-value text-success">
            {filteredIssues.filter(i => i.status === 'Resolved').length}
          </div>
        </div>
      </div>

      {/* Issues Grid */}
      {filteredIssues.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold mb-2">No Issues Found</h3>
          <p className="text-base-content/70 mb-6">
            {searchTerm 
              ? `No results for "${searchTerm}". Try different keywords.`
              : "No issues have been reported yet."
            }
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="btn btn-primary"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <IssueCard key={issue._id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllIssues;