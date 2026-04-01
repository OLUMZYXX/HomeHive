import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../config/axios";

/**
 * Unobtrusive banner that appears only when the server is unreachable.
 * On Render free tier the server sleeps — this banner warns the user
 * while the first request wakes it up (cold start ~30s).
 */
const ServerStatus = () => {
  const [status, setStatus] = useState("unknown"); // "online" | "offline" | "waking" | "unknown"
  const [retryCount, setRetryCount] = useState(0);

  const ping = useCallback(async () => {
    try {
      await axiosInstance.get("/health", { timeout: 8000 });
      setStatus("online");
    } catch (err) {
      if (err.isNetworkError || !err.response) {
        // Could be a cold start — mark as waking and retry
        setStatus((prev) => (prev === "unknown" ? "waking" : "offline"));
        setRetryCount((c) => c + 1);
      } else {
        // Got a response (4xx/5xx) — server IS up, just returning an error
        setStatus("online");
      }
    }
  }, []);

  useEffect(() => {
    ping();
  }, [ping]);

  // Retry up to 4 times with back-off (5s, 10s, 20s, 30s)
  useEffect(() => {
    if (retryCount === 0 || retryCount > 4 || status === "online") return;
    const delay = Math.min(5000 * retryCount, 30000);
    const t = setTimeout(ping, delay);
    return () => clearTimeout(t);
  }, [retryCount, status, ping]);

  if (status === "online" || status === "unknown") return null;

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 text-sm shadow-strong border max-w-sm w-[calc(100%-2rem)] ${
        status === "waking"
          ? "bg-amber-50 border-amber-200 text-amber-800"
          : "bg-red-50 border-red-200 text-red-800"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full flex-shrink-0 ${
          status === "waking" ? "bg-amber-400 animate-pulse" : "bg-red-400"
        }`}
      />
      <span>
        {status === "waking"
          ? "Server is starting up — this may take ~30 seconds…"
          : "Cannot reach the server. Please check your connection."}
      </span>
      <button
        onClick={() => { setRetryCount(0); ping(); }}
        className="ml-auto text-xs underline opacity-70 hover:opacity-100 flex-shrink-0"
      >
        Retry
      </button>
    </div>
  );
};

export default ServerStatus;
