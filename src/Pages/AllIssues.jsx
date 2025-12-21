import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import IssueCard from "../components/issues/IssueCard";
import useAxiosPub from "../hooks/useAxiosPub";

const AllIssues = () => {
  const axiosPub = useAxiosPub();

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 9;

  // TanStack Query - fetch all issues
  const { data, isLoading, error } = useQuery({
    queryKey: ["allIssues"],
    queryFn: async () => {
      const response = await axiosPub.get("/api/all-issue");
      return response.data;
    },
  });

  const issues = data || [];

  // Filter issues based on search
  const filteredIssues = useMemo(() => {
    const searchLower = searchTerm.toLowerCase().trim();

    if (!searchLower) return issues;

    return issues.filter((issue) => {
      return (
        issue.title?.toLowerCase().includes(searchLower) ||
        issue.location?.toLowerCase().includes(searchLower) ||
        issue.category?.toLowerCase().includes(searchLower) ||
        issue.description?.toLowerCase().includes(searchLower)
      );
    });
  }, [issues, searchTerm]);

  // Sort: boosted -> priority(high>normal>low) -> newest
  const sorted = useMemo(() => {
    const priorityRank = (p) => (p === "high" ? 2 : p === "normal" ? 1 : 0);

    return [...filteredIssues].sort((a, b) => {
      // boosted first
      if (!!b.isBoosted !== !!a.isBoosted) {
        return (b.isBoosted ? 1 : 0) - (a.isBoosted ? 1 : 0);
      }

      // then priority
      const pr = priorityRank(b.priority) - priorityRank(a.priority);
      if (pr !== 0) return pr;

      // then newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredIssues]);

  // Reset page when searchTerm changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  // Pagination calculations
  const totalItems = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // If page goes out of range (e.g., after search), clamp it
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedIssues = sorted.slice(startIndex, endIndex);

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

  // showing info
  const showingFrom = totalItems === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(endIndex, totalItems);

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
                  type="button"
                >
                  <X size={20} />
                </button>
              )}
              <button className="btn btn-square btn-primary" type="button">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Search results info */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm opacity-70">
              Showing {showingFrom}-{showingTo} of {filteredIssues.length}{" "}
              issues
              {searchTerm ? ` (from ${issues.length} total)` : ""}
            </span>

            {searchTerm && (
              <div className="badge badge-primary gap-2">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm("")} type="button">
                  ✕
                </button>
              </div>
            )}
          </div>
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
          <div className="stat-title">In Progress</div>
          <div className="stat-value text-info">
            {filteredIssues.filter((i) => i.status === "In-progress").length}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Assign</div>
          <div className="stat-value text-success">
            {filteredIssues.filter((i) => i.status === "Assigned to Staff").length}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Resolved</div>
          <div className="stat-value text-success">
            {filteredIssues.filter((i) => i.status === "Resolved").length}
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
              : "No issues have been reported yet."}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="btn btn-primary"
              type="button"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {paginatedIssues.map((issue) => (
              <IssueCard key={issue._id} issue={issue} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-8">
            <div className="join">
              <button
                className="btn join-item"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                type="button"
              >
                Prev
              </button>

              <button
                className="btn join-item btn-ghost"
                disabled
                type="button"
              >
                Page {page} / {totalPages}
              </button>

              <button
                className="btn join-item"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                type="button"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AllIssues;
