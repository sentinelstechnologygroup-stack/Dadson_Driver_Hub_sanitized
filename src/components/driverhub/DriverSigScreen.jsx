// src/components/driverhub/DriverSigScreen.jsx
import React, { useMemo, useState } from "react";

export default function DriverSigScreen({ load, onBack, onSigned }) {
  const [mode, setMode] = useState("saved"); // "saved" | "new"
  const hasSaved = true; // placeholder for later: driver profile saved signature

  const loadLabel = useMemo(() => {
    const ln = load?.meta?.loadNumber || load?.meta?.loadId || "";
    return ln ? ` • ${ln}` : "";
  }, [load]);

  function handleSave() {
    // Later: actually save signature data (image/strokes).
    // For now, we just mark "driver signed" via DriverHub callback.
    if (typeof onSigned === "function") onSigned();
  }

  return (
    <div className="pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-slate-900 text-white px-4 py-3 flex items-center gap-3">
        <button type="button" onClick={() => onBack?.()} className="font-bold">
          ←
        </button>
        <div className="font-extrabold">
          Driver Signature{loadLabel}
        </div>
      </div>

      {/* Warning */}
      <div className="px-4 pt-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 text-sm font-semibold">
          ⚠️ Driver signature is mandatory to complete this delivery.
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-2 flex">
          <button
            type="button"
            onClick={() => setMode("saved")}
            className={`flex-1 rounded-xl py-3 text-sm font-extrabold ${
              mode === "saved" ? "bg-slate-100 text-slate-900" : "text-slate-500"
            }`}
          >
            Use Saved Signature
          </button>
          <button
            type="button"
            onClick={() => setMode("new")}
            className={`flex-1 rounded-xl py-3 text-sm font-extrabold ${
              mode === "new" ? "bg-slate-100 text-slate-900" : "text-slate-500"
            }`}
          >
            Sign New
          </button>
        </div>
      </div>

      {/* Canvas / Preview */}
      <div className="px-4 pt-4">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
          {mode === "saved" ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
              <div className="text-3xl font-extrabold text-blue-700 italic">
                Saved Signature
              </div>
              <div className="mt-3 text-sm text-slate-600">
                This uses the saved signature for this load.
              </div>
              {!hasSaved ? (
                <div className="mt-3 text-sm font-bold text-rose-600">
                  No saved signature found. Use “Sign New”.
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-600 font-semibold">
              Signature pad coming next (Phase: capture strokes → save).
            </div>
          )}
        </div>
      </div>

      {/* Save */}
      <div className="px-4 pt-4">
        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-2xl bg-blue-600 text-white py-4 font-extrabold shadow-lg"
        >
          Save Signature
        </button>
      </div>
    </div>
  );
}