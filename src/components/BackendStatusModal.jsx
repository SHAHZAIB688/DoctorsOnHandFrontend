import { useEffect, useState } from "react";

const BackendStatusModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onStatus = (event) => {
      const online = event?.detail?.online;
      if (online === true) setOpen(false);
      if (online === false) setOpen(true);
    };

    window.addEventListener("backend-status", onStatus);
    return () => window.removeEventListener("backend-status", onStatus);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-6 shadow-xl">
        <h3 className="text-xl font-bold text-slate-900">Server Connection Issue</h3>
        <p className="mt-2 text-sm text-slate-600">
          Backend is not responding right now. Please make sure the backend server is running, then try again.
        </p>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackendStatusModal;
