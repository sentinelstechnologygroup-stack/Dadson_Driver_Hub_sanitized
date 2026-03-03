// src/components/driverhub/HomeScreen.jsx
import React, { useMemo } from "react";

function Section({ title, children }) {
  return (
    <div className="px-4 mt-4">
      <div className="text-[10px] tracking-[0.18em] font-semibold text-slate-400 mb-2">
        {title}
      </div>
      <div className="rounded-2xl bg-white/95 border border-slate-200 shadow-sm overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function EmptyCard() {
  return (
    <div className="p-4">
      <div className="h-3 w-40 bg-slate-200 rounded mb-3" />
      <div className="h-3 w-64 bg-slate-100 rounded mb-2" />
      <div className="h-3 w-28 bg-slate-100 rounded mb-2" />
      <div className="h-10" />
    </div>
  );
}

function LoadRow({ load, subtitle, badgeText, badgeTone = "default", onClick }) {
  const badgeClass =
    badgeTone === "warn"
      ? "bg-amber-200 text-amber-950"
      : badgeTone === "ok"
      ? "bg-emerald-200 text-emerald-950"
      : "bg-slate-200 text-slate-900";

  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 border-t border-slate-200 hover:bg-slate-50"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="font-semibold text-slate-900 truncate">
            {load?.meta?.loadNumber || load?.id || "Load"}
          </div>
          <div className="text-sm text-slate-600 truncate">{subtitle}</div>
        </div>
        <div className={`shrink-0 px-2 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>
          {badgeText}
        </div>
      </div>
    </button>
  );
}

export default function HomeScreen({
  activeLoad,
  missingPaperworkLoads = [],
  draftLoads = [],
  onOpenLoad,
  onStartNewLoad,
  onGoLoadsTab,
}) {
  const incompleteLoads = useMemo(() => {
    const seen = new Set();
    return (missingPaperworkLoads || [])
      .filter((l) => l?.id && !seen.has(l.id) && seen.add(l.id))
      .slice(0, 3);
  }, [missingPaperworkLoads]);

  const drafts = useMemo(() => {
    const seen = new Set();
    return (draftLoads || [])
      .filter((l) => l?.id && !seen.has(l.id) && seen.add(l.id))
      .slice(0, 3);
  }, [draftLoads]);

  return (
    <div className="pb-24">
      <div className="pt-5 px-4">
        <div className="text-xs text-slate-500">Good morning,</div>

        <div className="flex items-center justify-between mt-1">
          <div className="text-2xl font-extrabold text-slate-900">
            Driver X <span className="text-xl">👋</span>
          </div>

          <button
            onClick={() => onGoLoadsTab?.()}
            className="text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            View all
          </button>
        </div>

        <button
          onClick={() => onStartNewLoad?.()}
          className="mt-4 w-full rounded-2xl bg-blue-600 text-white font-extrabold py-4 shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.99]"
        >
          + New Load
        </button>
      </div>

      <Section title="ACTIVE LOAD">
        {activeLoad ? (
          <div>
            <LoadRow
              load={activeLoad}
              subtitle={`${activeLoad?.meta?.pickupCity || "Pickup"} → ${activeLoad?.meta?.deliveryCity || "Delivery"}`}
              badgeText="ACTIVE"
              badgeTone="ok"
              onClick={() => onOpenLoad?.(activeLoad.id)}
            />
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
              <div className="text-xs text-slate-600">
                Keep this load visible until paperwork and signatures are completed.
              </div>
            </div>
          </div>
        ) : (
          <EmptyCard />
        )}
      </Section>

      <Section title="INCOMPLETE LOADS">
        {incompleteLoads.length > 0 ? (
          <div>
            {incompleteLoads.map((l) => (
              <LoadRow
                key={l.id}
                load={l}
                subtitle={`${l?.meta?.pickupCity || "Pickup"} → ${l?.meta?.deliveryCity || "Delivery"}`}
                badgeText="MISSING"
                badgeTone="warn"
                onClick={() => onOpenLoad?.(l.id)}
              />
            ))}
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
              <button
                className="text-sm font-semibold text-blue-700 hover:text-blue-900"
                onClick={() => onGoLoadsTab?.()}
              >
                Go to Loads →
              </button>
            </div>
          </div>
        ) : (
          <EmptyCard />
        )}
      </Section>

      <Section title="DRAFT LOADS">
        {drafts.length > 0 ? (
          <div>
            {drafts.map((l) => (
              <LoadRow
                key={l.id}
                load={l}
                subtitle="Draft in progress"
                badgeText="DRAFT"
                badgeTone="default"
                onClick={() => onOpenLoad?.(l.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard />
        )}
      </Section>
    </div>
  );
}