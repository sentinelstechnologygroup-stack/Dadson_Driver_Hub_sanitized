// src/components/driverhub/LoadsTabScreen.jsx
import React, { useMemo, useState } from "react";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { DUMMY_LOADS } from "./dummyData";

const TopBar = () => (
  <div
    style={{
      background: "#0F1923",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "14px 18px",
      flexShrink: 0,
    }}
  >
    <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>Loads</div>
  </div>
);

/**
 * Normalize dummy data so it works whether each bucket is:
 * - an array of loads
 * - a single load object
 * - null/undefined
 */
function normalizeLoads(bucket) {
  if (!bucket) return [];
  if (Array.isArray(bucket)) return bucket.filter(Boolean);
  return [bucket].filter(Boolean);
}

const LoadRow = ({ load, navigate, tab }) => {
  const isActive = tab === "active";
  const isIncomplete = tab === "incomplete";

  const missingList = Array.isArray(load?.missing) ? load.missing : [];
  const hasMissing = missingList.length > 0;

  return (
    <div
      onClick={() => navigate("load-detail", load)}
      style={{
        background: "#fff",
        borderRadius: "14px",
        padding: "14px 16px",
        marginBottom: "10px",
        border: isIncomplete
          ? "1.5px solid #EF4444"
          : isActive
          ? "1.5px solid #2563EB"
          : "1.5px solid #E5E7EB",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: isActive ? "#2563EB" : isIncomplete ? "#EF4444" : "#9CA3AF",
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: "14px",
            color: "#0F1923",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {load?.billTo || "No Customer"}
        </div>

        <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px" }}>
          {load?.bol ? `BOL #${load.bol}` : "BOL not set"} · {load?.id || "—"}
        </div>

        {(isIncomplete || hasMissing) && missingList.length > 0 ? (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
            <AlertTriangle size={12} color="#EF4444" />
            <span style={{ fontSize: "11px", color: "#EF4444", fontWeight: 700 }}>
              Missing: {missingList.join(", ")}
            </span>
          </div>
        ) : null}

        <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "6px" }}>
          {load?.date || "Date not set"}
        </div>
      </div>

      <ChevronRight size={18} color="#D1D5DB" />
    </div>
  );
};

export default function LoadsTabScreen({ navigate }) {
  const [tab, setTab] = useState("active");

  const tabData = useMemo(
    () => ({
      active: normalizeLoads(DUMMY_LOADS?.active),
      incomplete: normalizeLoads(DUMMY_LOADS?.incomplete),
      draft: normalizeLoads(DUMMY_LOADS?.draft),
    }),
    []
  );

  const tabs = [
    { key: "active", label: "Active" },
    { key: "incomplete", label: "Incomplete" },
    { key: "draft", label: "Draft" },
  ];

  const counts = {
    active: tabData.active.length,
    incomplete: tabData.incomplete.length,
    draft: tabData.draft.length,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <TopBar />

      {/* Segmented control */}
      <div
        style={{
          background: "#fff",
          padding: "12px 16px",
          borderBottom: "1px solid #F3F4F6",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            background: "#F3F4F6",
            borderRadius: "10px",
            padding: "3px",
          }}
        >
          {tabs.map((t) => {
            const isOn = tab === t.key;
            const badgeBg = isOn
              ? t.key === "incomplete"
                ? "#EF4444"
                : "#2563EB"
              : "#E5E7EB";
            const badgeFg = isOn ? "#fff" : "#9CA3AF";

            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  flex: 1,
                  padding: "8px 4px",
                  borderRadius: "8px",
                  border: "none",
                  background: isOn ? "#fff" : "transparent",
                  color: isOn ? "#0F1923" : "#6B7280",
                  fontWeight: isOn ? 700 : 600,
                  fontSize: "13px",
                  cursor: "pointer",
                  boxShadow: isOn ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
                  transition: "all 0.15s",
                }}
              >
                {t.label}
                <span
                  style={{
                    marginLeft: "6px",
                    background: badgeBg,
                    color: badgeFg,
                    borderRadius: "99px",
                    padding: "1px 7px",
                    fontSize: "11px",
                    fontWeight: 800,
                    display: "inline-block",
                    minWidth: "22px",
                    textAlign: "center",
                  }}
                >
                  {counts[t.key]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Small helper note when on Incomplete */}
        {tab === "incomplete" ? (
          <div style={{ marginTop: "10px", fontSize: "12px", color: "#6B7280" }}>
            These loads are missing required paperwork or fields. Tap to open and complete.
          </div>
        ) : null}
      </div>

      {/* List */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "16px" }}>
        {tabData[tab].length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#9CA3AF", fontSize: "14px" }}>
            No {tab} loads
          </div>
        ) : (
          tabData[tab].map((load) => <LoadRow key={load?.id || Math.random()} load={load} navigate={navigate} tab={tab} />)
        )}
      </div>
    </div>
  );
}