import React, { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

function formatMoney(amountCents = 0, currency = "usd") {
  const amount = Number(amountCents || 0) / 100;
  const cur = String(currency || "usd").toUpperCase();
  return `${amount.toFixed(2)} ${cur}`;
}

function formatDate(unixSeconds) {
  if (!unixSeconds) return "-";
  return new Date(unixSeconds * 1000).toLocaleString();
}

export default function PaymentHistory() {
  const axiosSec = useAxiosSecure();

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["payment-history"],
    queryFn: async ({ pageParam }) => {
      // backend: /api/payment-history?limit=20&starting_after=pi_xxx
      const params = { limit: 20 };
      if (pageParam) params.starting_after = pageParam;

      const res = await axiosSec.get("/api/payment-history", { params });
      return res.data;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.has_more ? lastPage?.next_cursor : undefined,
    staleTime: 30 * 1000,
    retry: (failureCount, err) => {
      const s = err?.response?.status;
      // 401/403 এ অযথা retry না
      if (s === 401 || s === 403) return false;
      return failureCount < 2;
    },
  });

  const items = useMemo(() => {
    if (!data?.pages?.length) return [];
    return data.pages.flatMap((p) => p?.data || []);
  }, [data]);

  // Error message pretty print
  const errorText =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong";

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Payment History</h2>

        <button
          onClick={() => refetch()}
          disabled={isLoading || isFetching}
          style={{ padding: "6px 10px", cursor: "pointer" }}
        >
          Refresh
        </button>

        {isFetching && !isFetchingNextPage ? (
          <span style={{ fontSize: 12, opacity: 0.7 }}>Syncing…</span>
        ) : null}
      </div>

      {isLoading ? (
        <div style={{ marginTop: 16 }}>Loading…</div>
      ) : error ? (
        <div style={{ marginTop: 16 }}>
          <div style={{ padding: 12, border: "1px solid #f3b2b2" }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              Failed to load payment history
            </div>
          </div>
        </div>
      ) : (
        <>
          <div style={{ marginTop: 16, fontSize: 14 }}>
            Total loaded: <b>{items.length}</b>
          </div>

          <div style={{ marginTop: 12, overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 14,
              }}
            >
              <thead>
                <tr>
                  <th style={th}>Payment ID</th>
                  <th style={th}>Amount</th>
                  <th style={th}>Status</th>
                  <th style={th}>Currency</th>
                  <th style={th}>Created</th>
                  <th style={th}>Customer</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td style={td} colSpan={6}>
                      No payments found.
                    </td>
                  </tr>
                ) : (
                  items.map((p) => (
                    <tr key={p.id}>
                      <td style={td}>
                        <code style={{ fontSize: 12 }}>{p.id}</code>
                      </td>
                      <td style={td}>{formatMoney(p.amount, p.currency)}</td>
                      <td style={td}>
                        <span
                          style={{
                            padding: "2px 8px",
                            border: "1px solid #ddd",
                            borderRadius: 999,
                            fontSize: 12,
                          }}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td style={td}>
                        {String(p.currency || "-").toUpperCase()}
                      </td>
                      <td style={td}>{formatDate(p.created)}</td>
                      <td style={td}>{p.customer || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
            <button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
              style={{
                padding: "8px 12px",
                cursor:
                  hasNextPage && !isFetchingNextPage
                    ? "pointer"
                    : "not-allowed",
              }}
            >
              {isFetchingNextPage
                ? "Loading…"
                : hasNextPage
                ? "Load more"
                : "No more"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const th = {
  textAlign: "left",
  borderBottom: "1px solid #ddd",
  padding: "10px 8px",
  whiteSpace: "nowrap",
};

const td = {
  borderBottom: "1px solid #eee",
  padding: "10px 8px",
  verticalAlign: "top",
};
