import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { storeIssueBoostPayment } from "../../services/issueService";

export default function BoostOk() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const axiosSec = useAxiosSecure();

  const sessionId = params.get("session_id");
  const issueId = params.get("issueId");

  // mutation: store boost payment in DB
  const mutation = useMutation({
    mutationFn: () =>
      storeIssueBoostPayment({
        axiosSec,
        issueId,
        paymentSessionID: sessionId,
      }),
    onSuccess: () => {
      toast.success("Issue boosted successfully!");
      navigate(`/dashboard/view-issue/${issueId}`);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Failed to finalize boost"
      );
      navigate(`/dashboard/view-issue/${issueId}`);
    },
  });

  useEffect(() => {
    // safety check
    if (!sessionId || !issueId) {
      toast.error("Missing payment information");
      return navigate("/all-issues");
    }

    // 5 seconds delay for better UX
    const timer = setTimeout(() => {
      mutation.mutate();
    }, 5000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <span className="loading loading-spinner loading-lg text-success"></span>

      <p className="text-lg font-semibold text-success">
        Payment Successful 🎉
      </p>

      <p className="text-sm opacity-70">
        Applying boost to your issue, please wait...
      </p>
    </div>
  );
}
