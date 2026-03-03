// src/components/driverhub/BottomNav.jsx
import React from "react";

function Item({ active, label, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 h-14 flex flex-col items-center justify-center gap-1"
    >
      <div className={`text-lg leading-none ${active ? "text-blue-600" : "text-slate-500"}`}>
        {icon}
      </div>
      <div className={`text-[11px] font-bold ${active ? "text-blue-600" : "text-slate-500"}`}>
        {label}
      </div>
    </button>
  );
}

export default function BottomNav(props) {
  const active = props.value ?? props.activeTab ?? "home";
  const change = props.onChange ?? props.goTab ?? (() => {});

  return (
    <div className="sticky bottom-0 z-30 bg-white border-t border-slate-200">
      <div className="max-w-xl mx-auto flex">
        <Item active={active === "home"} label="Home" icon="⌂" onClick={() => change("home")} />
        <Item active={active === "loads"} label="Loads" icon="≡" onClick={() => change("loads")} />
        <Item active={active === "docs"} label="Documents" icon="▦" onClick={() => change("docs")} />
        <Item active={active === "pay"} label="Pay" icon="$" onClick={() => change("pay")} />
      </div>
    </div>
  );
}