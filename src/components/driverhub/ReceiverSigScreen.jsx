// src/components/driverhub/ReceiverSigScreen.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";

export default function ReceiverSigScreen({ navigate }) {
  const [hasDamage, setHasDamage] = useState(null); // null | true | false
  const [damageDetails, setDamageDetails] = useState("");
  const [declined, setDeclined] = useState(false);
  const [hasStrokes, setHasStrokes] = useState(false);

  const canvasRef = useRef(null);
  const drawing = useRef(false);

  // Resize canvas to match CSS size so pointer math is correct
  const resizeCanvasToDisplaySize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const nextW = Math.max(1, Math.floor(rect.width * dpr));
    const nextH = Math.max(1, Math.floor(rect.height * dpr));
    if (canvas.width !== nextW || canvas.height !== nextH) {
      // reset = clear; acceptable for this mock flow
      canvas.width = nextW;
      canvas.height = nextH;
      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);
      setHasStrokes(false);
    }
  };

  useEffect(() => {
    resizeCanvasToDisplaySize();
    window.addEventListener("resize", resizeCanvasToDisplaySize);
    return () => window.removeEventListener("resize", resizeCanvasToDisplaySize);
  }, []);

  useEffect(() => {
    // If declined, clear the signature state so it doesn't "carry"
    if (declined) {
      clearCanvas();
      setHasDamage(null);
      setDamageDetails("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [declined]);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return {
      x: src.clientX - rect.left,
      y: src.clientY - rect.top,
    };
  };

  const startDraw = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    resizeCanvasToDisplaySize();
    drawing.current = true;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#059669";
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    if (!hasStrokes) setHasStrokes(true);
  };

  const endDraw = () => {
    drawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasStrokes(false);
  };

  const damageOk = useMemo(() => {
    if (declined) return true;
    if (hasDamage === null) return false;
    if (hasDamage === true) return damageDetails.trim().length > 0;
    return true; // hasDamage === false
  }, [declined, hasDamage, damageDetails]);

  const canSave = useMemo(() => {
    if (declined) return true;
    return damageOk && hasStrokes;
  }, [declined, damageOk, hasStrokes]);

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
        <button onClick={() => navigate("load-detail")} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <ArrowLeft size={22} color="#fff" />
        </button>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>Receiver Signature</div>
        <div
          style={{
            marginLeft: "auto",
            padding: "3px 10px",
            background: "#1E3A5F",
            borderRadius: "99px",
            fontSize: "11px",
            color: "#93C5FD",
            fontWeight: 800,
          }}
        >
          Optional
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "20px" }}>
        {/* Damage Question */}
        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            padding: "16px",
            border: "1.5px solid #E5E7EB",
            marginBottom: "16px",
            opacity: declined ? 0.6 : 1,
          }}
        >
          <div style={{ fontWeight: 800, fontSize: "15px", color: "#0F1923", marginBottom: "14px" }}>
            Were there any damages to the delivery?
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            {[
              {
                val: true,
                label: "Yes – Damaged",
                color: "#EF4444",
                bg: hasDamage === true ? "#FEE2E2" : "#F9FAFB",
                border: hasDamage === true ? "#EF4444" : "#E5E7EB",
              },
              {
                val: false,
                label: "No Damage",
                color: "#10B981",
                bg: hasDamage === false ? "#D1FAE5" : "#F9FAFB",
                border: hasDamage === false ? "#10B981" : "#E5E7EB",
              },
            ].map(({ val, label, color, bg, border }) => (
              <button
                key={String(val)}
                onClick={() => !declined && setHasDamage(val)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "10px",
                  border: `2px solid ${border}`,
                  background: bg,
                  color: color,
                  fontWeight: 800,
                  fontSize: "14px",
                  cursor: declined ? "not-allowed" : "pointer",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {!declined && hasDamage === null ? (
            <div style={{ marginTop: "10px", fontSize: "12px", color: "#6B7280", fontWeight: 600 }}>
              Select Yes or No to proceed.
            </div>
          ) : null}
        </div>

        {/* Damage Details */}
        {!declined && hasDamage === true ? (
          <div
            style={{
              background: "#FFF1F1",
              borderRadius: "14px",
              padding: "16px",
              border: "1.5px solid #FCA5A5",
              marginBottom: "16px",
            }}
          >
            <label style={{ fontSize: "13px", fontWeight: 800, color: "#DC2626", display: "block", marginBottom: "8px" }}>
              ⚠ Damage Description (required) *
            </label>
            <textarea
              value={damageDetails}
              onChange={(e) => setDamageDetails(e.target.value)}
              placeholder="Describe the damage in detail…"
              rows={3}
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: "10px",
                border: "1.5px solid #FCA5A5",
                fontSize: "14px",
                color: "#111827",
                background: "#fff",
                boxSizing: "border-box",
                resize: "none",
                outline: "none",
              }}
            />
          </div>
        ) : null}

        {/* Declined Checkbox */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "14px 16px",
            border: declined ? "2px solid #F59E0B" : "1.5px solid #E5E7EB",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            onClick={() => setDeclined((v) => !v)}
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "6px",
              border: declined ? "none" : "2px solid #CBD5E1",
              background: declined ? "#F59E0B" : "#fff",
              cursor: "pointer",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: "14px",
              color: "#fff",
              userSelect: "none",
            }}
          >
            {declined ? "✓" : ""}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "14px", color: "#0F1923" }}>Receiver declined to sign</div>
            <div style={{ fontSize: "11px", color: "#9CA3AF" }}>Signature will be recorded as declined</div>
          </div>
        </div>

        {/* Signature Pad */}
        {!declined ? (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#374151" }}>Receiver sign below</span>
              <button
                onClick={clearCanvas}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#6B7280",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                <RotateCcw size={13} /> Clear
              </button>
            </div>

            <canvas
              ref={canvasRef}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={endDraw}
              style={{
                width: "100%",
                height: "140px",
                background: "#fff",
                borderRadius: "14px",
                border: "2px dashed #CBD5E1",
                touchAction: "none",
                cursor: "crosshair",
                display: "block",
              }}
            />

            <div style={{ textAlign: "center", fontSize: "11px", color: "#9CA3AF", marginTop: "6px" }}>
              Hand device to receiver to sign
            </div>

            {!damageOk ? (
              <div style={{ marginTop: "10px", fontSize: "12px", color: "#DC2626", fontWeight: 700 }}>
                If damaged, enter the damage description before saving.
              </div>
            ) : null}
          </div>
        ) : null}

        <button
          onClick={() => canSave && navigate("load-detail")}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "12px",
            border: "none",
            background: canSave ? "#059669" : "#D1D5DB",
            color: canSave ? "#fff" : "#9CA3AF",
            fontWeight: 800,
            fontSize: "15px",
            cursor: canSave ? "pointer" : "not-allowed",
            boxShadow: canSave ? "0 4px 14px rgba(5,150,105,0.3)" : "none",
            marginBottom: "16px",
          }}
        >
          Save Receiver Signature
        </button>
      </div>
    </div>
  );
}