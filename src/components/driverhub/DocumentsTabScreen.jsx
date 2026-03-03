// src/components/driverhub/DocumentsTabScreen.jsx
import React, { useState } from "react";
import { FileText, Image, Download } from "lucide-react";
import { DUMMY_DOCS } from "./dummyData";

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
    <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>Documents</div>
  </div>
);

const DocRow = ({ doc }) => {
  const isReceipt = doc.type === "receipt";
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "14px",
        padding: "14px 16px",
        marginBottom: "10px",
        border: "1.5px solid #E5E7EB",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "10px",
          background: isReceipt ? "#EFF6FF" : "#F0FDF4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {isReceipt ? <FileText size={20} color="#2563EB" /> : <Image size={20} color="#059669" />}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: "13px", color: "#0F1923", lineHeight: "1.3" }}>
          {doc.name}
        </div>
        <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "3px" }}>
          {doc.date} · {doc.size}
        </div>
      </div>

      <button
        style={{
          background: "none",
          border: "1.5px solid #E5E7EB",
          borderRadius: "8px",
          padding: "7px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Download size={15} color="#6B7280" />
      </button>
    </div>
  );
};

export default function DocumentsTabScreen({ navigate }) {
  // (navigate is passed from DriverHub for future deep-links; not used yet)
  void navigate;

  const [section, setSection] = useState("receipts");
  const receipts = DUMMY_DOCS.filter((d) => d.type === "receipt");
  const bols = DUMMY_DOCS.filter((d) => d.type === "bol");

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <TopBar />

      {/* Section toggle */}
      <div
        style={{
          background: "#fff",
          padding: "12px 16px",
          borderBottom: "1px solid #F3F4F6",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", background: "#F3F4F6", borderRadius: "10px", padding: "3px" }}>
          {[
            { key: "receipts", label: "Delivery Receipts" },
            { key: "bols", label: "BOL Images" },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              style={{
                flex: 1,
                padding: "9px 6px",
                borderRadius: "8px",
                border: "none",
                background: section === s.key ? "#fff" : "transparent",
                color: section === s.key ? "#0F1923" : "#6B7280",
                fontWeight: section === s.key ? 700 : 500,
                fontSize: "12px",
                cursor: "pointer",
                boxShadow: section === s.key ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.15s",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        <div
          style={{
            fontSize: "11px",
            color: "#9CA3AF",
            fontWeight: 600,
            marginBottom: "12px",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          {section === "receipts" ? "Completed Delivery Receipts (PDF)" : "Uploaded BOL Images — History"}
        </div>

        <div
          style={{
            background: "#FFF9C4",
            border: "1px solid #FDE68A",
            borderRadius: "10px",
            padding: "8px 12px",
            marginBottom: "12px",
            fontSize: "11px",
            color: "#92400E",
            fontWeight: 600,
          }}
        >
          🔒 Read-only — contact office for changes
        </div>

        {(section === "receipts" ? receipts : bols).map((doc) => (
          <DocRow key={doc.id} doc={doc} />
        ))}
      </div>
    </div>
  );
}