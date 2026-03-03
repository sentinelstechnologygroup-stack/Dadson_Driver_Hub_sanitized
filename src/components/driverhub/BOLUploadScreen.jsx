// src/components/driverhub/BOLUploadScreen.jsx
import React, { useMemo, useState } from "react";
import { ArrowLeft, Camera, RotateCcw, CheckCircle, Plus } from "lucide-react";

const initialPages = [{ id: 1, label: "Page 1", confirmed: true }];

export default function BOLUploadScreen({ navigate }) {
  const [pages, setPages] = useState(initialPages);
  const [uploading, setUploading] = useState(false);

  const canAdd = pages.length < 2 && !uploading;

  const progressPct = useMemo(() => {
    const pct = (Math.min(pages.length, 2) / 2) * 100;
    return `${pct}%`;
  }, [pages.length]);

  const allConfirmed = useMemo(() => pages.length > 0 && pages.every((p) => p.confirmed), [pages]);

  const simulateAdd = () => {
    if (!canAdd) return;
    setUploading(true);
    setTimeout(() => {
      setPages((p) => [
        ...p,
        { id: p.length + 1, label: `Page ${p.length + 1}`, confirmed: false },
      ]);
      setUploading(false);
    }, 650);
  };

  const confirm = (id) => {
    setPages((p) => p.map((pg) => (pg.id === id ? { ...pg, confirmed: true } : pg)));
  };

  const retake = (id) => {
    // Retake should invalidate confirmation (so user must re-confirm)
    setPages((p) => p.map((pg) => (pg.id === id ? { ...pg, confirmed: false } : pg)));
  };

  const handleBack = () => {
    navigate("load-detail");
  };

  const handleConfirmUpload = () => {
    if (!allConfirmed) return;
    // In future: persist pages to load (bolImages) then return.
    navigate("load-detail");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      {/* Header */}
      <div
        style={{
          background: "#0F1923",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexShrink: 0,
        }}
      >
        <button onClick={handleBack} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <ArrowLeft size={22} color="#fff" />
        </button>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>Upload BOL Images</div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "20px" }}>
        {/* Progress */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#374151" }}>
              {pages.length} / 2 images
            </span>
            <span style={{ fontSize: "13px", color: pages.length === 2 ? "#10B981" : "#6B7280", fontWeight: 600 }}>
              {pages.length === 2 ? "Max reached" : "Max 2"}
            </span>
          </div>

          <div style={{ background: "#E5E7EB", borderRadius: "99px", height: "6px" }}>
            <div
              style={{
                background: "#2563EB",
                borderRadius: "99px",
                height: "6px",
                width: progressPct,
                transition: "width 0.25s",
              }}
            />
          </div>

          <div style={{ marginTop: "10px", fontSize: "12px", color: "#6B7280" }}>
            Add up to 2 clear photos of the signed BOL.
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          {pages.map((pg) => (
            <div
              key={pg.id}
              style={{
                background: "#fff",
                borderRadius: "14px",
                border: pg.confirmed ? "2px solid #10B981" : "2px solid #E5E7EB",
                overflow: "hidden",
              }}
            >
              {/* Mock image area */}
              <div
                style={{
                  height: "110px",
                  background: "linear-gradient(135deg, #E0E7FF, #DBEAFE)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Camera size={36} color="#6366F1" />
                {pg.confirmed ? (
                  <div
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      background: "#10B981",
                      borderRadius: "99px",
                      width: "22px",
                      height: "22px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckCircle size={14} color="#fff" />
                  </div>
                ) : null}
              </div>

              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "#0F1923", marginBottom: "6px" }}>
                  {pg.label}
                </div>

                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => retake(pg.id)}
                    style={{
                      flex: 1,
                      padding: "6px",
                      borderRadius: "7px",
                      border: "1.5px solid #E5E7EB",
                      background: "#F9FAFB",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                      fontSize: "11px",
                      color: "#6B7280",
                      fontWeight: 700,
                    }}
                    title="Retake will require re-confirming the page."
                  >
                    <RotateCcw size={11} /> Retake
                  </button>

                  {!pg.confirmed ? (
                    <button
                      onClick={() => confirm(pg.id)}
                      style={{
                        flex: 1,
                        padding: "6px",
                        borderRadius: "7px",
                        border: "none",
                        background: "#2563EB",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        fontSize: "11px",
                        color: "#fff",
                        fontWeight: 800,
                      }}
                    >
                      <CheckCircle size={11} /> Confirm
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}

          {pages.length < 2 ? (
            <button
              onClick={simulateAdd}
              disabled={!canAdd}
              style={{
                height: "160px",
                borderRadius: "14px",
                border: "2px dashed #CBD5E1",
                background: "#F8FAFC",
                cursor: canAdd ? "pointer" : "not-allowed",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                opacity: canAdd ? 1 : 0.75,
              }}
            >
              {uploading ? (
                <div style={{ fontSize: "13px", color: "#6B7280", fontWeight: 700 }}>Uploading…</div>
              ) : (
                <>
                  <Plus size={28} color="#94A3B8" />
                  <span style={{ fontSize: "12px", color: "#94A3B8", fontWeight: 700 }}>Add Page</span>
                </>
              )}
            </button>
          ) : null}
        </div>

        <button
          onClick={handleConfirmUpload}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "12px",
            border: "none",
            background: allConfirmed ? "#2563EB" : "#D1D5DB",
            color: allConfirmed ? "#fff" : "#9CA3AF",
            fontWeight: 800,
            fontSize: "15px",
            cursor: allConfirmed ? "pointer" : "not-allowed",
            boxShadow: allConfirmed ? "0 4px 14px rgba(37,99,235,0.3)" : "none",
          }}
        >
          {allConfirmed ? "✓ Confirm Upload" : "Confirm all pages first"}
        </button>
      </div>
    </div>
  );
}