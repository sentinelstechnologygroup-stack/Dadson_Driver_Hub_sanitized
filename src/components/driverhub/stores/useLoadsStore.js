// src/components/driverhub/stores/useLoadsStore.js
import { useEffect, useMemo, useState } from "react";
import { LoadsStore } from "./loadsStore";

export function useLoadsStore() {
  const [snap, setSnap] = useState(() => LoadsStore.getState());

  useEffect(() => {
    const maybeUnsub = LoadsStore.subscribe((next) => setSnap(next));

    // TS in JS files can mis-infer conditional returns.
    // This form is unambiguous: return function OR return nothing.
    if (typeof maybeUnsub === "function") {
      return () => {
        try {
          maybeUnsub();
        } catch {
          // ignore
        }
      };
    }

    return undefined;
  }, []);

  const api = useMemo(() => {
    const loads =
      snap?.order && snap?.loadsById
        ? snap.order.map((id) => snap.loadsById[id]).filter(Boolean)
        : [];

    const activeLoad =
      snap?.activeLoadId && snap?.loadsById ? snap.loadsById[snap.activeLoadId] : null;

    const drafts = loads.filter((l) => l.status === "draft");
    const completed = loads.filter((l) => l.status === "completed");
    const incomplete = loads.filter((l) => LoadsStore.isMissingPaperwork(l));

    return {
      state: snap,
      loads,
      activeLoad,
      drafts,
      completed,
      missingPaperwork: incomplete,

      // actions
      createDraftLoad: LoadsStore.createDraftLoad,
      activateLoad: LoadsStore.activateLoad,
      setActiveLoad: LoadsStore.setActiveLoad,

      patchLoad: LoadsStore.patchLoad,
      saveDeliveryReceiptDraft: LoadsStore.saveDeliveryReceiptDraft,
      markDeliveryReceiptComplete: LoadsStore.markDeliveryReceiptComplete,

      markBOLUploaded: LoadsStore.markBOLUploaded,
      markDriverSigned: LoadsStore.markDriverSigned,
      markReceiverSigned: LoadsStore.markReceiverSigned,

      completeLoad: LoadsStore.completeLoad,
      deleteLoad: LoadsStore.deleteLoad,
      resetAll: LoadsStore.resetAll,

      // derived
      isMissingPaperwork: LoadsStore.isMissingPaperwork,
      isPaperworkComplete: LoadsStore.isPaperworkComplete,
      getLoad: LoadsStore.getLoad,
    };
  }, [snap]);

  return api;
}