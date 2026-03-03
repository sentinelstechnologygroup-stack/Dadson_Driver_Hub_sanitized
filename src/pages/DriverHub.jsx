// src/pages/DriverHub.jsx
import React, { useMemo, useState } from "react";

import DriverHubHeader from "@/components/driverhub/DriverHubHeader";
import HomeScreen from "@/components/driverhub/HomeScreen";
import LoadDetailScreen from "@/components/driverhub/LoadDetailScreen";
import LoadsTabScreen from "@/components/driverhub/LoadsTabScreen";
import DocumentsTabScreen from "@/components/driverhub/DocumentsTabScreen";
import PayTabScreen from "@/components/driverhub/PayTabScreen";
import BOLUploadScreen from "@/components/driverhub/BOLUploadScreen";
import DriverSigScreen from "@/components/driverhub/DriverSigScreen";
import ReceiverSigScreen from "@/components/driverhub/ReceiverSigScreen";
import DeliveryCompleteScreen from "@/components/driverhub/DeliveryCompleteScreen";
import BottomNav from "@/components/driverhub/BottomNav";

import { useLoadsStore } from "@/components/driverhub/stores/useLoadsStore";

const SCREENS = Object.freeze({
  HOME: "home",
  LOAD_DETAIL: "load_detail",
  TAB_LOADS: "tab_loads",
  TAB_DOCS: "tab_docs",
  TAB_PAY: "tab_pay",
  BOL_UPLOAD: "bol_upload",
  DRIVER_SIG: "driver_sig",
  RECEIVER_SIG: "receiver_sig",
  DELIVERY_COMPLETE: "delivery_complete",
});

/**
 * @typedef {{ loadId?: string|null, error?: string|null }} NavParams
 */

function MenuDrawer({ open, onClose, onGo }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close menu"
        onClick={onClose}
      />

      <div className="absolute left-0 top-0 h-full w-[280px] bg-white shadow-2xl">
        <div className="h-14 px-4 flex items-center justify-between border-b">
          <div className="font-semibold">Menu</div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-semibold"
          >
            Close
          </button>
        </div>

        <nav className="p-3 space-y-2">
          <button
            type="button"
            onClick={() => onGo(SCREENS.HOME)}
            className="w-full text-left px-3 py-3 rounded-xl hover:bg-slate-100 font-semibold"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => onGo(SCREENS.TAB_LOADS)}
            className="w-full text-left px-3 py-3 rounded-xl hover:bg-slate-100 font-semibold"
          >
            Loads
          </button>
          <button
            type="button"
            onClick={() => onGo(SCREENS.TAB_DOCS)}
            className="w-full text-left px-3 py-3 rounded-xl hover:bg-slate-100 font-semibold"
          >
            Documents
          </button>
          <button
            type="button"
            onClick={() => onGo(SCREENS.TAB_PAY)}
            className="w-full text-left px-3 py-3 rounded-xl hover:bg-slate-100 font-semibold"
          >
            Pay
          </button>
        </nav>
      </div>
    </div>
  );
}

export default function DriverHub() {
  const loadsApi = useLoadsStore();

  /** @type {[string, (v:string)=>void]} */
  const [screen, setScreen] = useState(SCREENS.HOME);

  /** @type {[NavParams, (v:NavParams)=>void]} */
  const [params, setParams] = useState(/** @type {NavParams} */ ({}));

  const [menuOpen, setMenuOpen] = useState(false);

  /** @param {string} nextScreen @param {NavParams} [nextParams] */
  function go(nextScreen, nextParams = {}) {
    setScreen(nextScreen);
    setParams(nextParams || {});
  }

  const activeLoadId = loadsApi?.state?.activeLoadId || null;
  const activeLoad = loadsApi?.activeLoad || null;

  const currentLoadId = params?.loadId || activeLoadId || null;
  const currentLoad = currentLoadId ? loadsApi.getLoad(currentLoadId) : null;

  // ✅ compatibility navigate() so any screen still calling navigate(...) won’t crash
  // Supports: navigate(-1), navigate("/"), navigate("/loads"), navigate("/documents"), navigate("/pay")
  function navigate(to, opts) {
    // back
    if (to === -1) {
      go(SCREENS.HOME);
      return;
    }

    // some libs call navigate({to:"/x"}) style — normalize best-effort
    const str =
      typeof to === "string"
        ? to
        : (to && typeof to === "object" && typeof to.to === "string" ? to.to : "");

    const lower = String(str || "").toLowerCase();

    if (!lower || lower === "/" || lower.includes("home") || lower.includes("driverhub")) {
      go(SCREENS.HOME);
      return;
    }
    if (lower.includes("load") && (opts?.state?.loadId || opts?.loadId)) {
      go(SCREENS.LOAD_DETAIL, { loadId: opts?.state?.loadId || opts?.loadId });
      return;
    }
    if (lower.includes("doc")) {
      go(SCREENS.TAB_DOCS);
      return;
    }
    if (lower.includes("pay")) {
      go(SCREENS.TAB_PAY);
      return;
    }
    if (lower.includes("load")) {
      go(SCREENS.TAB_LOADS);
      return;
    }

    // default safe landing
    go(SCREENS.HOME);
  }

  function onTabChange(tabKey) {
    if (tabKey === "loads") return go(SCREENS.TAB_LOADS);
    if (tabKey === "docs") return go(SCREENS.TAB_DOCS);
    if (tabKey === "pay") return go(SCREENS.TAB_PAY);
    return go(SCREENS.HOME);
  }

  const bottomNavValue = useMemo(() => {
    if (screen === SCREENS.TAB_LOADS) return "loads";
    if (screen === SCREENS.TAB_DOCS) return "docs";
    if (screen === SCREENS.TAB_PAY) return "pay";
    return "home";
  }, [screen]);

  function openLoad(loadId) {
    go(SCREENS.LOAD_DETAIL, { loadId });
  }

  function startNewLoad() {
    const id = loadsApi.createDraftLoad({
      meta: { loadNumber: `L-${String(Date.now()).slice(-6)}` },
    });
    go(SCREENS.LOAD_DETAIL, { loadId: id });
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      <DriverHubHeader
        title="Dadson Trucking"
        subtitle="DriverHub"
        onMenu={() => setMenuOpen(true)}
        onProfile={() => console.log("[DriverHubHeader] profile")}
      />

      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onGo={(next) => {
          setMenuOpen(false);
          go(next);
        }}
      />

      <main className="flex-1 pb-20">
        {screen === SCREENS.HOME && (
          <HomeScreen
            navigate={navigate}
            activeLoad={activeLoad}
            missingPaperworkLoads={loadsApi.missingPaperwork}
            draftLoads={loadsApi.drafts}
            onOpenLoad={(id) => openLoad(id)}
            onStartNewLoad={startNewLoad}
            onGoLoadsTab={() => go(SCREENS.TAB_LOADS)}
          />
        )}

        {screen === SCREENS.TAB_LOADS && (
          <LoadsTabScreen
            navigate={navigate}
            loads={loadsApi.loads}
            activeLoadId={activeLoadId}
            missingPaperworkLoads={loadsApi.missingPaperwork}
            onOpenLoad={(id) => openLoad(id)}
            onStartNewLoad={startNewLoad}
          />
        )}

        {screen === SCREENS.TAB_DOCS && (
          <DocumentsTabScreen
            navigate={navigate}
            activeLoad={activeLoad}
            onOpenLoad={() =>
              activeLoadId ? openLoad(activeLoadId) : go(SCREENS.TAB_LOADS)
            }
          />
        )}

        {screen === SCREENS.TAB_PAY && <PayTabScreen navigate={navigate} />}

        {screen === SCREENS.LOAD_DETAIL && (
          <LoadDetailScreen
            navigate={navigate}
            load={currentLoad}
            onBack={() => go(SCREENS.HOME)}
            onGoLoadsTab={() => go(SCREENS.TAB_LOADS)}
            onActivateLoad={() => {
              if (!currentLoadId) return;
              loadsApi.activateLoad(currentLoadId);
            }}
            onSaveDeliveryReceipt={(patch) => {
              if (!currentLoadId) return;
              loadsApi.saveDeliveryReceiptDraft(currentLoadId, patch);
            }}
            onMarkDeliveryReceiptComplete={() => {
              if (!currentLoadId) return;
              loadsApi.markDeliveryReceiptComplete(currentLoadId, true);
            }}
            onBOLUpload={() => go(SCREENS.BOL_UPLOAD, { loadId: currentLoadId })}
            onDriverSign={() => go(SCREENS.DRIVER_SIG, { loadId: currentLoadId })}
            onReceiverSign={() => go(SCREENS.RECEIVER_SIG, { loadId: currentLoadId })}
            onCompleteDelivery={() => {
              if (!currentLoadId) return;
              const res = loadsApi.completeLoad(currentLoadId);
              if (res?.ok) go(SCREENS.DELIVERY_COMPLETE, { loadId: currentLoadId });
              else go(SCREENS.LOAD_DETAIL, { loadId: currentLoadId, error: res?.reason || "UNKNOWN" });
            }}
          />
        )}

        {screen === SCREENS.BOL_UPLOAD && (
          <BOLUploadScreen
            navigate={navigate}
            load={currentLoad}
            onBack={() => go(SCREENS.LOAD_DETAIL, { loadId: currentLoadId })}
            onUploaded={() => {
              if (!currentLoadId) return;
              loadsApi.markBOLUploaded(currentLoadId, true);
              go(SCREENS.LOAD_DETAIL, { loadId: currentLoadId });
            }}
          />
        )}

        {screen === SCREENS.DRIVER_SIG && (
          <DriverSigScreen
            navigate={navigate}
            load={currentLoad}
            onBack={() => go(SCREENS.LOAD_DETAIL, { loadId: currentLoadId })}
            onSigned={() => {
              if (!currentLoadId) return;
              loadsApi.markDriverSigned(currentLoadId, true);
              go(SCREENS.LOAD_DETAIL, { loadId: currentLoadId });
            }}
          />
        )}

        {screen === SCREENS.RECEIVER_SIG && (
          <ReceiverSigScreen
            navigate={navigate}
            load={currentLoad}
            onBack={() => go(SCREENS.LOAD_DETAIL, { loadId: currentLoadId })}
            onSigned={() => {
              if (!currentLoadId) return;
              loadsApi.markReceiverSigned(currentLoadId, true);
              go(SCREENS.LOAD_DETAIL, { loadId: currentLoadId });
            }}
          />
        )}

        {screen === SCREENS.DELIVERY_COMPLETE && (
          <DeliveryCompleteScreen
            navigate={navigate}
            load={currentLoad}
            onDone={() => go(SCREENS.HOME)}
            onViewLoads={() => go(SCREENS.TAB_LOADS)}
          />
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNav value={bottomNavValue} onChange={onTabChange} />
      </div>
    </div>
  );
}