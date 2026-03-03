// src/components/driverhub/HomeScreen.jsx
import React, { useMemo } from "react";

function getTimeGreeting(now = new Date()) {
  const h = now.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getLoadTitle(load) {
  return (
    load?.meta?.loadNumber ||
    load?.meta?.bolNumber ||
    load?.meta?.id ||
    load?.id ||
    "Load"
  );
}

function getLoadSubtitle(load) {
  const pickup = load?.meta?.pickup || "Pickup";
  const delivery = load?.meta?.delivery || "Delivery";
  return `${pickup} → ${delivery}`;
}

function Badge({ tone = "slate", children }) {
  const toneMap = {
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    blue: "bg-blue-100 text-blue-700",
    slate: "bg-slate-100 text-slate-700",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${
        toneMap[tone] || toneMap.slate
      }`}
    >
      {children}
    </span>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-6">
      <div className="px-4 text-[11px] tracking-widest font-semibold text-slate-400">
        {title}
      </div>
      <div className="mt-2 px-4">{children}</div>
    </section>
  );
}

function EmptyCard() {
  return (
    <div className="h-28 rounded-2xl bg-white border border-slate-200 shadow-sm" />
  );
}

function LoadCard({ load, right = null, onClick, footer = null }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 active:scale-[0.99] transition"
    >
      <div className="p-4 flex items-start justify-between gap-3">
        <div>
          <div className="font-bold text-slate-900">{getLoadTitle(load)}</div>
          <div className="text-sm text-slate-600 mt-0.5">
            {getLoadSubtitle(load)}
          </div>
        </div>
        <div className="shrink-0">{right}</div>
      </div>

      {footer ? (
        <div className="px-4 pb-4 text-sm text-slate-600">{footer}</div>
      ) : null}
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
  const greeting = useMemo(() => getTimeGreeting(new Date()), []);

  const hasActive = !!activeLoad;
  const hasIncomplete = (missingPaperworkLoads?.length || 0) > 0;
  const hasDrafts = (draftLoads?.length || 0) > 0;

  return (
    <div className="pb-6">
      {/* top greeting block */}
      <div className="px-4 pt-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-slate-500 text-sm">{greeting},</div>
            <div className="text-3xl font-extrabold tracking-tight">
              Driver X <span className="align-middle">👋</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onGoLoadsTab}
            className="text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            View all
          </button>
        </div>

        <button
          type="button"
          onClick={onStartNewLoad}
          className="mt-4 w-full rounded-2xl bg-blue-600 text-white font-semibold py-4 shadow-lg shadow-blue-600/25 hover:bg-blue-700 active:bg-blue-800"
        >
          + New Load
        </button>
      </div>

      {/* ACTIVE LOAD */}
      <Section title="ACTIVE LOAD">
        {hasActive ? (
          <LoadCard
            load={activeLoad}
            onClick={() => onOpenLoad?.(activeLoad?.id)}
            right={<Badge tone="green">ACTIVE</Badge>}
            footer="Keep this load visible until paperwork and signatures are completed."
          />
        ) : (
          <EmptyCard />
        )}
      </Section>

      {/* INCOMPLETE LOADS */}
      <Section title="INCOMPLETE LOADS">
        {hasIncomplete ? (
          <div className="space-y-2">
            {missingPaperworkLoads.slice(0, 2).map((l) => (
              <LoadCard
                key={l.id}
                load={l}
                onClick={() => onOpenLoad?.(l.id)}
                right={<Badge tone="amber">MISSING</Badge>}
                footer={
                  <span className="text-blue-600 font-semibold">
                    Go to Loads →
                  </span>
                }
              />
            ))}
          </div>
        ) : (
          <EmptyCard />
        )}
      </Section>

      {/* DRAFT LOADS */}
      <Section title="DRAFT LOADS">
        {hasDrafts ? (
          <div className="space-y-2">
            {draftLoads.slice(0, 2).map((l) => (
              <LoadCard
                key={l.id}
                load={l}
                onClick={() => onOpenLoad?.(l.id)}
                right={<Badge tone="blue">DRAFT</Badge>}
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