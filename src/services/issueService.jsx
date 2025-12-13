// src/services/issueService.js

import axios from "axios";

// Get single issue
export const getIssueById = async (id) => {
  const response = await axios.get(`/api/issue/${id}`);
  console.log(response.data);
  
  return response.data;
};

// Delete issue
export const deleteIssue = async (id) => {
  const response = await axios.delete(`/api/issues/${id}`);
  return response.data;
};

// Toggle upvote (already have)
export const toggleUpvote = async ({ issueId, userId }) => {
  const response = await axios.put(`/api/issues/${issueId}/upvote`, { userId });
  return response.data;
};