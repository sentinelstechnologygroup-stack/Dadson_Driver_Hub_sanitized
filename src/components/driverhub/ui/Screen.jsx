// src/components/driverhub/ui/Screen.jsx
import React from "react";
import { DH_TOKENS } from "../../ui/tokens";

export default function Screen({ children, padBottom = false }) {
  const bottom = padBottom ? DH_TOKENS.navHeight : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div style={{ flex: 1, paddingBottom: bottom }}>{children}</div>
    </div>
  );
}