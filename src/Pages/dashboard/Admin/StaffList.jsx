import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const StaffList = () => {
  const axiosSec = useAxiosSecure();

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [busyUid, setBusyUid] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return staff;
    return staff.filter((s) => {
      return (
        (s?.name || "").toLowerCase().includes(q) ||
        (s?.email || "").toLowerCase().includes(q) ||
        (s?.uid || "").toLowerCase().includes(q)
      );
    });
  }, [staff, query]);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await axiosSec.get("/api/stafflist");
      setStaff(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmAction = async ({ title, text, confirmText, confirmColor }) => {
    const result = await Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: confirmText,
      confirmButtonColor: confirmColor,
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
    });
    return result.isConfirmed;
  };

  const handleToggleBlock = async (s) => {
    const uid = s?.uid;
    if (!uid) return toast.error("Missing uid");

    const nextBlocked = !Boolean(s?.isBlocked);
    const action = nextBlocked ? "Block" : "Unblock";

    const ok = await confirmAction({
      title: `${action} staff?`,
      text: `${s?.name || "—"} (${s?.email || "—"})`,
      confirmText: action,
      confirmColor: nextBlocked ? "#f59e0b" : "#22c55e",
    });

    if (!ok) return;

    setBusyUid(uid);

    // optimistic UI
    const prev = staff;
    setStaff((p) => p.map((x) => (x.uid === uid ? { ...x, isBlocked: nextBlocked } : x)));

    try {
      await axiosSec.patch(`/api/staff/${uid}/block`, { isBlocked: nextBlocked });

      await Swal.fire({
        title: "Success!",
        text: `Staff ${action.toLowerCase()}ed successfully.`,
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      setStaff(prev); // rollback
      toast.error(err?.response?.data?.message || err.message || `${action} failed`);
    } finally {
      setBusyUid(null);
    }
  };

  const handleDelete = async (s) => {
    const uid = s?.uid;
    if (!uid) return toast.error("Missing uid");

    const ok = await confirmAction({
      title: "Delete staff?",
      text: `${s?.name || "—"} (${s?.email || "—"})`,
      confirmText: "Delete",
      confirmColor: "#ef4444",
    });

    if (!ok) return;

    setBusyUid(uid);

    // optimistic UI
    const prev = staff;
    setStaff((p) => p.filter((x) => x.uid !== uid));

    try {
      await axiosSec.delete(`/api/staff/${uid}`);

      await Swal.fire({
        title: "Deleted!",
        text: "Staff deleted successfully.",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      setStaff(prev); // rollback
      toast.error(err?.response?.data?.message || err.message || "Delete failed");
    } finally {
      setBusyUid(null);
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      <div className="my-8">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
          <h2 className="text-xl font-semibold">Staff List</h2>

          <div className="flex gap-2 w-full md:w-auto">
            <input
              className="input input-bordered w-full md:w-80"
              placeholder="Search by name/email/uid..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn" onClick={fetchStaff} disabled={loading}>
              Refresh
            </button>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="loading loading-spinner loading-sm"></span>
                <span>Loading staff...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-sm opacity-70">No staff found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Staff</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filtered.map((s, idx) => (
                      <tr key={s?.uid || idx}>
                        <td>{idx + 1}</td>

                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="w-10 rounded-full">
                                <img
                                  src={
                                    s?.imgURL ||
                                    "https://i.ibb.co/TDrgpc1p/character-avatar-isolated-729149-194801.jpg"
                                  }
                                  alt="avatar"
                                />
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">{s?.name || "—"}</div>
                              <div className="text-xs opacity-60">{s?.uid || "—"}</div>
                            </div>
                          </div>
                        </td>

                        <td className="text-sm">{s?.email || "—"}</td>

                        <td>
                          {s?.isBlocked ? (
                            <span className="badge badge-error">Blocked</span>
                          ) : (
                            <span className="badge badge-success">Active</span>
                          )}
                        </td>

                        <td className="text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              className={`btn btn-sm ${s?.isBlocked ? "btn-success" : "btn-warning"}`}
                              onClick={() => handleToggleBlock(s)}
                              disabled={busyUid === s?.uid}
                              title={s?.isBlocked ? "Unblock" : "Block"}
                            >
                              {busyUid === s?.uid ? "..." : s?.isBlocked ? "Unblock" : "Block"}
                            </button>

                            <button
                              className="btn btn-error btn-sm"
                              onClick={() => handleDelete(s)}
                              disabled={busyUid === s?.uid}
                            >
                              {busyUid === s?.uid ? "..." : "Delete"}
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
              Note: Delete করলে DB + Firebase Auth দুটো জায়গা থেকেই remove হবে (backend code অনুযায়ী)।
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffList;
