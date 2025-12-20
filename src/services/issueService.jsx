
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
  const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/issues/${issueId}/upvote`, { userId });
  return response.data;
};

//Boost service function
export const createBoostSession = async ({ axiosSec, issueId }) => {
  const res = await axiosSec.post("/api/boost/create-checkout-session", { issueId });
  return res.data; // { url, id }
};

export const storeIssueBoostPayment = async ({ axiosSec, issueId, paymentSessionID }) => {
  const res = await axiosSec.patch(`/api/issues/${issueId}/boost`, { paymentSessionID });
  return res.data;
};
