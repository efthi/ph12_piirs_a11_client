import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

const ListIssues = () => {
  const axiosSec = useAxiosSecure();
  
  const {
    data: issues,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["all-issues"],
    queryFn: async () => {
      const res = await axiosSec.get("/api/all-issue");
      return res.data;
    },
  });


  if (isLoading) {
    return <div className="text-center mt-10"><span className="loading loading-ring loading-lg bg-red-500"></span></div>;
  }

  if (isError) {
      return <div className="text-red-500">Something went wrong!</div>
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>SL</th>
              <th>Title</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Location</th>
              <th>Upvotes</th>
              <th>Details</th>
              <th>Assign</th>
            </tr>
          </thead>
          <tbody>
            {issues?.map((issue, index) => (
              <tr key={issue._id}>
                <th>{index + 1}</th> 
                <td>{issue.title}</td>
                <td>{issue.category || "N/A"}</td>
                <td>{issue.priority || "Low"}</td>
                <td>{issue.location || "Unknown"}</td>
                <td>{issue.upvotes || 0}</td>
                <td>
                    <Link to={`/dashboard/view-issue/${issue._id}`} className="btn btn-xs">View</Link>
                </td>
                <td>
                    <button className="btn btn-xs btn-primary">Assign</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListIssues;