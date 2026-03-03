// src/components/driverhub/DeliveryCompleteScreen.jsx
import React from "react";
import { CheckCircle, FileText, Home } from "lucide-react";

const recipients = [
  "dispatch@dadsontruck.com",
  "billing@dadsontruck.com",
  "records@dadsontruck.com",
];

export default function DeliveryCompleteScreen({ navigate, goTab }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#F0FDF4",
        padding: "32px 24px",
        overflowY: "auto",
      }}
    >
      {/* Success Icon */}
      <div
        style={{
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #10B981, #059669)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
          boxShadow: "0 8px 30px rgba(16,185,129,0.4)",
        }}
      >
        <CheckCircle size={50} color="#fff" strokeWidth={2.5} />
      </div>

      <div style={{ fontWeight: 800, fontSize: "24px", color: "#065F46", letterSpacing: "-0.5px", marginBottom: "6px" }}>
        Delivery Complete!
      </div>
      <div style={{ fontSize: "14px", color: "#6EE7B7", marginBottom: "24px", textAlign: "center" }}>
        Your delivery has been successfully submitted.
      </div>

      {/* Confirmation Card */}
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "20px",
          width: "100%",
          border: "1.5px solid #D1FAE5",
          marginBottom: "16px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ marginBottom: "14px" }}>
          <div style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "4px" }}>
            Confirmation #
          </div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "#0F1923", letterSpacing: "-0.3px" }}>
            CONF-2026-8821
          </div>
        </div>

        <div style={{ height: "1px", background: "#F3F4F6", margin: "12px 0" }} />

        <div style={{ marginBottom: "14px" }}>
          <div style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "4px" }}>
            Load
          </div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#0F1923" }}>
            Acme Industries — BOL #123456
          </div>
          <div style={{ fontSize: "12px", color: "#6B7280" }}>Feb 27, 2026 · 10:30 AM</div>
        </div>

        <div style={{ height: "1px", background: "#F3F4F6", margin: "12px 0" }} />

        <div>
          <div style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "8px" }}>
            Sent To
          </div>
          {recipients.map((r) => (
            <div key={r} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#10B981",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: "13px", color: "#374151", fontWeight: 500 }}>{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "10px", width: "100%", marginBottom: "16px" }}>
        <button
          onClick={() => goTab("documents")}
          style={{
            flex: 1,
            padding: "13px",
            borderRadius: "12px",
            border: "2px solid #10B981",
            background: "#fff",
            color: "#059669",
            fontWeight: 700,
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <FileText size={16} /> View PDF
        </button>
        <button
          onClick={() => goTab("home")}
          style={{
            flex: 1,
            padding: "13px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #10B981, #059669)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            boxShadow: "0 4px 14px rgba(16,185,129,0.3)",
          }}
        >
          <Home size={16} /> Done
        </button>
      </div>

      <div style={{ fontSize: "10px", color: "#A7F3D0", textAlign: "center" }}>
        © 2026 Big Boom Hosting
      </div>
    </div>
  );
}