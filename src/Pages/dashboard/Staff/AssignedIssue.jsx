import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AssignedIssuesStaff = () => {
  const axiosSec = useAxiosSecure();
  const queryClient = useQueryClient();

  // UI state
  const [openRowId, setOpenRowId] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [boostedOnly, setBoostedOnly] = useState(false);

  // 1) Fetch assigned issues (server already filters by staff email)
  const {
    data: issues = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["assignedIssues"],
    queryFn: async () => {
      const res = await axiosSec.get("/api/get-assigned-issues");
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // Status normalize (Assigned to Staff => Pending)
  const normalizeStatus = (s) => (s === "Assigned to Staff" ? "Pending" : s);

  const nextStatusOptions = (currentStatus) => {
    const cur = normalizeStatus(currentStatus);
    const map = {
      Pending: ["In-progress"],
      "In-progress": ["Working"],
      Working: ["Resolved"],
      Resolved: ["Closed"],
      Closed: [],
    };
    return map[cur] || [];
  };

  // 2) Sorting + filtering (Boosted issues above normal)
  const viewIssues = useMemo(() => {
    const filtered = issues.filter((it) => {
      const st = normalizeStatus(it?.status);

      const statusOk = statusFilter === "all" ? true : st === statusFilter;
      const priorityOk =
        priorityFilter === "all" ? true : it?.priority === priorityFilter;
      const boostedOk = boostedOnly ? Boolean(it?.isBoosted) : true;

      return statusOk && priorityOk && boostedOk;
    });

    // Boosted first
    filtered.sort((a, b) => Number(Boolean(b?.isBoosted)) - Number(Boolean(a?.isBoosted)));

    return filtered;
  }, [issues, statusFilter, priorityFilter, boostedOnly]);

  // 3) Mutation: change status
  const changeStatusMutation = useMutation({
    mutationFn: async ({ id, nextStatus }) => {
      const res = await axiosSec.patch(`/api/issues/${id}/status`, {
        status: nextStatus,
      });
      return res.data;
    },

    // Optimistic update
    onMutate: async ({ id, nextStatus }) => {
      await queryClient.cancelQueries({ queryKey: ["assignedIssues"] });

      const previous = queryClient.getQueryData(["assignedIssues"]);

      queryClient.setQueryData(["assignedIssues"], (old = []) =>
        old.map((it) =>
          it?._id === id ? { ...it, status: nextStatus } : it
        )
      );

      return { previous };
    },

    onError: (err, _vars, context) => {
      // rollback
      if (context?.previous) {
        queryClient.setQueryData(["assignedIssues"], context.previous);
      }
      toast.error(err?.response?.data?.message || err.message || "Status update failed");
    },

    onSuccess: (_data) => {
      // server updated; optional refetch to sync timeline etc.
      queryClient.invalidateQueries({ queryKey: ["assignedIssues"] });
    },
  });

  const handleOpenDropdown = (id) => {
    setOpenRowId((prev) => (prev === id ? null : id));
  };

  const handleSelectStatus = async (issue, nextStatus) => {
    const id = issue?._id;
    if (!id) return toast.error("Missing issue id");

    const prev = issue?.status || "—";

    const confirm = await Swal.fire({
      title: "Change status?",
      text: `Tracking: ${issue?.tracking || "—"} | ${prev} → ${nextStatus}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Change",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "#f59e0b",
    });

    if (!confirm.isConfirmed) return;

    // Close dropdown
    setOpenRowId(null);

    // Update instantly (optimistic via mutation)
    changeStatusMutation.mutate({ id, nextStatus });

    // Small feedback (optional)
    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: `Status changed to ${nextStatus}`,
      timer: 900,
      showConfirmButton: false,
    });
  };

  // আপনার hyperlink route—এখানে match করে দিন
  const detailsLink = (id) => `/dashboard/issue/${id}`;

  return (
    <div className="max-w-screen-2xl mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      <div className="my-8">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
          <h2 className="text-xl font-semibold">Assigned Issues</h2>

          <div className="flex gap-2">
            <button className="btn" onClick={() => refetch()} disabled={isLoading}>
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <select
            className="select select-bordered"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In-progress">In-progress</option>
            <option value="Working">Working</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            className="select select-bordered"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <label className="label cursor-pointer gap-2">
            <input
              type="checkbox"
              className="checkbox"
              checked={boostedOnly}
              onChange={(e) => setBoostedOnly(e.target.checked)}
            />
            <span className="label-text">Boosted only</span>
          </label>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="loading loading-spinner loading-sm"></span>
                <span>Loading assigned issues...</span>
              </div>
            ) : isError ? (
              <div className="alert alert-error">
                <span>{error?.message || "Failed to load issues"}</span>
              </div>
            ) : viewIssues.length === 0 ? (
              <div className="text-sm opacity-70">No assigned issues found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Boost</th>
                      <th>Tracking</th>
                      <th>Title</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {viewIssues.map((issue, idx) => {
                      const id = issue?._id;
                      const currentStatus = normalizeStatus(issue?.status);
                      const options = nextStatusOptions(issue?.status);
                      const isOpen = openRowId === id;

                      return (
                        <tr key={id || idx}>
                          <td>{idx + 1}</td>

                          <td>
                            {issue?.isBoosted ? (
                              <span className="badge badge-primary">Boosted</span>
                            ) : (
                              <span className="badge badge-ghost">Normal</span>
                            )}
                          </td>

                          <td className="font-mono text-xs">{issue?.tracking || "—"}</td>

                          <td>{issue?.title || issue?.subject || "—"}</td>

                          <td>
                            <span className="badge badge-outline">
                              {issue?.priority || "—"}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`badge ${
                                currentStatus === "Closed"
                                  ? "badge-neutral"
                                  : currentStatus === "Resolved"
                                  ? "badge-success"
                                  : "badge-warning"
                              }`}
                            >
                              {currentStatus || "Pending"}
                            </span>
                          </td>

                          <td className="text-right">
                            <div className="flex justify-end gap-2 items-center">
                              {/* View Details */}
                              <Link to={`/dashboard/view-issue/${id}`} className="btn btn-info btn-sm">
                                View Details
                              </Link>

                              {/* Change Status */}
                              <div className="relative">
                                <button
                                  className="btn btn-sm btn-warning"
                                  onClick={() => handleOpenDropdown(id)}
                                  disabled={options.length === 0 || changeStatusMutation.isPending}
                                  title={
                                    options.length === 0
                                      ? "No further status change allowed"
                                      : "Change status"
                                  }
                                >
                                  {changeStatusMutation.isPending ? "..." : "Change Status"}
                                </button>

                                {isOpen && (
                                  <div className="absolute right-0 mt-2 z-20 bg-base-100 border rounded-lg shadow p-2 w-48">
                                    <div className="text-xs opacity-60 mb-2">
                                      Next status
                                    </div>

                                    {/* Requirement অনুযায়ী: allowed transition অনুযায়ী অপশন */}
                                    <select
                                      className="select select-bordered select-sm w-full"
                                      defaultValue=""
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        if (!val) return;
                                        handleSelectStatus(issue, val);
                                      }}
                                    >
                                      <option value="" disabled>
                                        Select...
                                      </option>
                                      {options.map((st) => (
                                        <option key={st} value={st}>
                                          {st}
                                        </option>
                                      ))}
                                    </select>

                                    <button
                                      className="btn btn-ghost btn-sm w-full mt-2"
                                      onClick={() => setOpenRowId(null)}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedIssuesStaff;
