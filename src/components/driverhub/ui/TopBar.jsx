// src/components/driverhub/ui/TopBar.jsx
import React from "react";
import { DH_TOKENS } from "./tokens";

export default function TopBar({ title, right = null, left = null, subtitle = null }) {
  return (
    <div
      style={{
        background: DH_TOKENS.colors.ink,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "14px 18px",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {left && <div style={{ position: "absolute", left: 14 }}>{left}</div>}
      {right && <div style={{ position: "absolute", right: 14 }}>{right}</div>}

      <div style={{ textAlign: "center" }}>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, lineHeight: 1.1 }}>
          {title}
        </div>
        {subtitle ? (
          <div style={{ color: "#93C5FD", fontWeight: 600, fontSize: 11, marginTop: 2 }}>
            {subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
}