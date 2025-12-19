import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const UserManage = () => {
  const axiosSec = useAxiosSecure();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyUid, setBusyUid] = useState(null);

  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all"); // all | citizen | staff | admin ...

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      const roleOk = role === "all" ? true : u?.role === role;
      if (!roleOk) return false;
      if (!q) return true;

      return (
        (u?.name || "").toLowerCase().includes(q) ||
        (u?.email || "").toLowerCase().includes(q) ||
        (u?.uid || "").toLowerCase().includes(q)
      );
    });
  }, [users, query, role]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // চাইলে backend query params দিয়েও আনতে পারেন:
      // const res = await axiosSec.get(`/api/users?role=${role}&q=${encodeURIComponent(query)}`);
      const res = await axiosSec.get("/api/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleBlock = async (u) => {
    const uid = u?.uid;
    if (!uid) return toast.error("Missing uid");

    // Optional safety: admin block না করতে চাইলে
    if (u?.role === "admin") {
      return toast.info("Admin user block/unblock is disabled.");
    }

    const nextBlocked = !Boolean(u?.isBlocked);
    const action = nextBlocked ? "Block" : "Unblock";

    const confirmed = await Swal.fire({
      title: `${action} user?`,
      text: `${u?.name || "—"} (${u?.email || "—"})`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: action,
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: nextBlocked ? "#f59e0b" : "#22c55e",
    });

    if (!confirmed.isConfirmed) return;

    setBusyUid(uid);

    // optimistic
    const prev = users;
    setUsers((p) => p.map((x) => (x.uid === uid ? { ...x, isBlocked: nextBlocked } : x)));

    try {
      await axiosSec.patch(`/api/users/${uid}/block`, { isBlocked: nextBlocked });
      await Swal.fire({
        icon: "success",
        title: "Done!",
        text: `User ${action.toLowerCase()}ed successfully.`,
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      setUsers(prev);
      toast.error(err?.response?.data?.message || err.message || `${action} failed`);
    } finally {
      setBusyUid(null);
    }
  };

  const handleDelete = async (u) => {
    const uid = u?.uid;
    if (!uid) return toast.error("Missing uid");

    // Optional safety: admin delete prevent
    if (u?.role === "admin") {
      return toast.info("Admin user delete is disabled.");
    }

    const confirmed = await Swal.fire({
      title: "Delete user?",
      text: `${u?.name || "—"} (${u?.email || "—"})`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "#ef4444",
    });

    if (!confirmed.isConfirmed) return;

    setBusyUid(uid);

    // optimistic
    const prev = users;
    setUsers((p) => p.filter((x) => x.uid !== uid));

    try {
      await axiosSec.delete(`/api/users/${uid}`);
      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "User deleted successfully.",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      setUsers(prev);
      toast.error(err?.response?.data?.message || err.message || "Delete failed");
    } finally {
      setBusyUid(null);
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      <div className="my-8">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
          <h2 className="text-xl font-semibold">User Management</h2>

          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <select
              className="select select-bordered"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="all">All roles</option>
              <option value="citizen">Citizen</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>

            <input
              className="input input-bordered w-full md:w-80"
              placeholder="Search by name/email/uid..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <button className="btn" onClick={fetchUsers} disabled={loading}>
              Refresh
            </button>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="loading loading-spinner loading-sm"></span>
                <span>Loading users...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-sm opacity-70">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filtered.map((u, idx) => (
                      <tr key={u?.uid || idx}>
                        <td>{idx + 1}</td>

                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="w-10 rounded-full">
                                <img
                                  src={
                                    u?.imgURL ||
                                    "https://i.ibb.co/TDrgpc1p/character-avatar-isolated-729149-194801.jpg"
                                  }
                                  alt="avatar"
                                />
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">{u?.name || "—"}</div>
                              <div className="text-xs opacity-60">{u?.uid || "—"}</div>
                            </div>
                          </div>
                        </td>

                        <td className="text-sm">{u?.email || "—"}</td>

                        <td>
                          <span className="badge badge-outline">{u?.role || "—"}</span>
                        </td>

                        <td>
                          {u?.isBlocked ? (
                            <span className="badge badge-error">Blocked</span>
                          ) : (
                            <span className="badge badge-success">Active</span>
                          )}
                        </td>

                        <td className="text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              className={`btn btn-sm ${u?.isBlocked ? "btn-success" : "btn-warning"}`}
                              onClick={() => handleToggleBlock(u)}
                              disabled={busyUid === u?.uid}
                            >
                              {busyUid === u?.uid ? "..." : u?.isBlocked ? "Unblock" : "Block"}
                            </button>

                            <button
                              className="btn btn-error btn-sm"
                              onClick={() => handleDelete(u)}
                              disabled={busyUid === u?.uid}
                            >
                              {busyUid === u?.uid ? "..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-3 text-xs opacity-60">
              Tip: Admin delete/block disable রাখা হয়েছে (optional)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManage;
