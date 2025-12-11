import React from "react";
import { useQuery } from "@tanstack/react-query";
import IssueCard from "../components/issues/IssueCard";
import useAxiosPub from "../hooks/useAxiosPub";

const AllIssues = () => {
  
const axiosPub = useAxiosPub();  
// TanStack Query - replaces useEffect + useState
  const { data, isLoading, error, } = useQuery({
    queryKey: ['allIssues'], // Unique key for this query
    queryFn: async () =>{
        const response = await axiosPub.get('/api/all-issue');
      return response.data;
    },
  });

  const issues = data || [];
console.log(issues);

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="alert alert-error max-w-md mx-auto">
          <span>Failed to load issues: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">All Issues</h1>

      {issues.length === 0 ? (
        <p className="text-center opacity-70">No issues found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <IssueCard key={issue._id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllIssues;