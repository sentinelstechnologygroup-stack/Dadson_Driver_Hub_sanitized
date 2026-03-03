// src/components/driverhub/DriverHubHeader.jsx
import React from "react";

export default function DriverHubHeader({
  title = "Dadson Trucking",
  subtitle = "DriverHub",
  onMenu,
  onProfile,
}) {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900 text-white">
      <div className="h-14 px-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onMenu?.()}
          aria-label="Open menu"
          className="h-10 w-10 rounded-lg flex items-center justify-center hover:bg-white/10 active:bg-white/15"
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1">
            <span className="block h-0.5 w-5 bg-white" />
            <span className="block h-0.5 w-5 bg-white" />
            <span className="block h-0.5 w-5 bg-white" />
          </div>
        </button>

        <div className="text-center leading-tight">
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-[11px] text-white/70">{subtitle}</div>
        </div>

        <button
          type="button"
          onClick={() => onProfile?.()}
          aria-label="Profile"
          className="h-10 w-10 rounded-lg flex items-center justify-center hover:bg-white/10 active:bg-white/15"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M20 22a8 8 0 0 0-16 0"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}