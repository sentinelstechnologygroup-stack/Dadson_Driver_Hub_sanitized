// src/pages/DriverHub.jsx
// @ts-nocheck
import React, { useMemo, useState } from "react";

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

export default function DriverHub() {
  const loadsApi = useLoadsStore();

  const [screen, setScreen] = useState(SCREENS.HOME);
  const [params, setParams] = useState({});

  function go(nextScreen, nextParams = {}) {
    setScreen(nextScreen);
    setParams(nextParams);
  }

  const activeLoadId = loadsApi?.state?.activeLoadId || null;
  const activeLoad = loadsApi?.activeLoad || null;

  const currentLoadId = params?.loadId || activeLoadId || null;
  const currentLoad = currentLoadId ? loadsApi.getLoad(currentLoadId) : null;

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
      <div className="flex-1">
        {screen === SCREENS.HOME && (
          <HomeScreen
            activeLoad={activeLoad}
            missingPaperworkLoads={loadsApi.missingPaperwork}
            draftLoads={loadsApi.drafts}
            onOpenLoad={openLoad}
            onStartNewLoad={startNewLoad}
            onGoLoadsTab={() => go(SCREENS.TAB_LOADS)}
          />
        )}

        {screen === SCREENS.TAB_LOADS && (
          <LoadsTabScreen
            loads={loadsApi.loads}
            activeLoadId={activeLoadId}
            missingPaperworkLoads={loadsApi.missingPaperwork}
            onOpenLoad={openLoad}
            onStartNewLoad={startNewLoad}
          />
        )}

        {screen === SCREENS.TAB_DOCS && (
          <DocumentsTabScreen
            activeLoad={activeLoad}
            onOpenLoad={() => (activeLoadId ? openLoad(activeLoadId) : go(SCREENS.TAB_LOADS))}
          />
        )}

        {screen === SCREENS.TAB_PAY && <PayTabScreen />}

        {screen === SCREENS.LOAD_DETAIL && (
          <LoadDetailScreen
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
            load={currentLoad}
            onDone={() => go(SCREENS.HOME)}
            onViewLoads={() => go(SCREENS.TAB_LOADS)}
          />
        )}
      </div>

      {/* Provide BOTH prop styles so BottomNav (old/new) works */}
      <BottomNav
        value={bottomNavValue}
        onChange={onTabChange}
        activeTab={bottomNavValue}
        goTab={onTabChange}
      />
    </div>
  );
}