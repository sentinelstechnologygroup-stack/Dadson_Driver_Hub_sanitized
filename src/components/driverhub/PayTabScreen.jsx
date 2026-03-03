// src/components/driverhub/PayTabScreen.jsx
import React from "react";
import { DollarSign, Download, Clock, CheckCircle } from "lucide-react";
import { DUMMY_PAYSLIPS } from "./dummyData";

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
    <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>Pay</div>
  </div>
);

export default function PayTabScreen({ navigate }) {
  // (navigate is passed from DriverHub for future deep-links; not used yet)
  void navigate;

  const totalPaid = DUMMY_PAYSLIPS
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + parseFloat(p.amount.replace(/[$,]/g, "")), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <TopBar />

      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {/* YTD Summary */}
        <div
          style={{
            background: "linear-gradient(135deg, #1D4ED8, #1E40AF)",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "20px",
            color: "#fff",
            boxShadow: "0 4px 20px rgba(29,78,216,0.3)",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#93C5FD",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            2026 YTD Paid
          </div>
          <div style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-1px" }}>
            ${totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: "12px", color: "#93C5FD", marginTop: "6px" }}>
            Driver X · CDL Driver
          </div>
        </div>

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
          Payslip History
        </div>

        {DUMMY_PAYSLIPS.map((ps) => {
          const isPending = ps.status === "Pending";
          return (
            <div
              key={ps.id}
              style={{
                background: "#fff",
                borderRadius: "14px",
                padding: "16px",
                marginBottom: "10px",
                border: isPending ? "1.5px solid #FCD34D" : "1.5px solid #E5E7EB",
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
                  background: isPending ? "#FFFBEB" : "#EFF6FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {isPending ? <Clock size={20} color="#D97706" /> : <DollarSign size={20} color="#2563EB" />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "#0F1923" }}>{ps.amount}</div>
                <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px" }}>{ps.label}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                  {isPending ? <Clock size={11} color="#D97706" /> : <CheckCircle size={11} color="#10B981" />}
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: isPending ? "#D97706" : "#10B981",
                    }}
                  >
                    {ps.status}
                  </span>
                  <span style={{ fontSize: "11px", color: "#D1D5DB" }}>·</span>
                  <span style={{ fontSize: "11px", color: "#9CA3AF" }}>{ps.date}</span>
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
        })}
      </div>
    </div>
  );
}