// src/components/driverhub/stores/loadsStore.js
const STORAGE_KEY = "driverhub.loads.v2";

const listeners = new Set();

let memoryState = {
  activeLoadId: null,
  loadsById: {},
  order: [], // newest first
};

function nowIso() {
  return new Date().toISOString();
}

function makeId() {
  return `load_${Date.now().toString(16)}_${Math.random().toString(16).slice(2)}`;
}

function safeParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function canUseLocalStorage() {
  try {
    const k = "__ls_test__";
    localStorage.setItem(k, "1");
    localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

const hasLS = typeof window !== "undefined" && typeof localStorage !== "undefined" && canUseLocalStorage();

function readState() {
  if (!hasLS) return memoryState;

  const raw = localStorage.getItem(STORAGE_KEY);
  const parsed = safeParse(raw);

  if (!parsed || typeof parsed !== "object") return memoryState;

  const next = {
    activeLoadId: typeof parsed.activeLoadId === "string" ? parsed.activeLoadId : null,
    loadsById: parsed.loadsById && typeof parsed.loadsById === "object" ? parsed.loadsById : {},
    order: Array.isArray(parsed.order) ? parsed.order : [],
  };

  memoryState = next;
  return next;
}

function writeState(next) {
  memoryState = next;
  if (hasLS) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore persist errors; memoryState still updates
    }
  }
}

function emit(next) {
  for (const fn of listeners) {
    try {
      fn(next);
    } catch {
      // ignore
    }
  }
}

function setState(mutator) {
  const prev = readState();
  const next = mutator(prev);

  const hardened = {
    activeLoadId: typeof next.activeLoadId === "string" ? next.activeLoadId : null,
    loadsById: next.loadsById && typeof next.loadsById === "object" ? next.loadsById : {},
    order: Array.isArray(next.order) ? next.order : [],
  };

  writeState(hardened);
  emit(hardened);
  return hardened;
}

// ------------------ Load Model ------------------
// Delivery Receipt required fields (yellow highlights in your photo):
// - bolNumber, billTo, poNumber, deliveryDate, deliveryTime, pieces
// Plus signatures complete and BOL upload for full paperwork completion.

function blankDeliveryReceipt() {
  return {
    bolNumber: "",
    billTo: "",
    consignee: "",
    shipper: "",
    poNumber: "",
    deliveryDate: "",
    deliveryTime: "",
    pieces: "",
    description: "",
    weight: "",
    tractorNumber: "",
    trailerNumber: "",
    printName: "",
    damageReported: false,
    damageNotes: "",
    // explicit completion toggle (can be derived too)
    isComplete: false,
    updatedAt: nowIso(),
  };
}

function ensureLoadShape(load) {
  const docs = load.docs || {};
  return {
    ...load,
    docs: {
      bolUploaded: Boolean(docs.bolUploaded),
      driverSigned: Boolean(docs.driverSigned),
      receiverSigned: Boolean(docs.receiverSigned),
      signaturesComplete: Boolean(docs.signaturesComplete),
      deliveryReceiptComplete: Boolean(docs.deliveryReceiptComplete),
    },
    deliveryReceipt: load.deliveryReceipt ? { ...blankDeliveryReceipt(), ...load.deliveryReceipt } : blankDeliveryReceipt(),
  };
}

// ------------------ Public API ------------------

function getState() {
  return readState();
}

function subscribe(listener) {
  listeners.add(listener);
  listener(readState());
  return () => listeners.delete(listener);
}

function getLoad(id) {
  if (!id) return null;
  const s = readState();
  const raw = s.loadsById[id] || null;
  return raw ? ensureLoadShape(raw) : null;
}

function listLoads() {
  const s = readState();
  return s.order.map((id) => getLoad(id)).filter(Boolean);
}

function isDeliveryReceiptComplete(load) {
  if (!load) return false;
  const dr = load.deliveryReceipt || {};
  const requiredFilled =
    String(dr.bolNumber || "").trim() &&
    String(dr.billTo || "").trim() &&
    String(dr.poNumber || "").trim() &&
    String(dr.deliveryDate || "").trim() &&
    String(dr.deliveryTime || "").trim() &&
    String(dr.pieces || "").trim();

  return Boolean(requiredFilled) && Boolean(dr.isComplete || load.docs?.deliveryReceiptComplete);
}

function isPaperworkComplete(load) {
  if (!load) return false;
  const d = load.docs || {};
  return Boolean(d.bolUploaded && isDeliveryReceiptComplete(load) && d.signaturesComplete);
}

function isMissingPaperwork(load) {
  // drafts are always "incomplete" by definition but we still want them visible separately
  if (!load) return true;
  if (load.status === "draft") return true;
  return !isPaperworkComplete(load);
}

// ---- Actions ----

function createDraftLoad(seed = {}) {
  const id = makeId();
  const ts = nowIso();

  const load = ensureLoadShape({
    id,
    status: "draft",
    createdAt: ts,
    updatedAt: ts,
    meta: {
      loadNumber: seed?.meta?.loadNumber ?? "",
      shipperName: seed?.meta?.shipperName ?? "",
      consigneeName: seed?.meta?.consigneeName ?? "",
      pickupCity: seed?.meta?.pickupCity ?? "",
      deliveryCity: seed?.meta?.deliveryCity ?? "",
    },
    docs: {
      bolUploaded: false,
      driverSigned: false,
      receiverSigned: false,
      signaturesComplete: false,
      deliveryReceiptComplete: false,
    },
    notes: {
      text: seed?.notes?.text ?? "",
      photoUrls: Array.isArray(seed?.notes?.photoUrls) ? seed.notes.photoUrls : [],
    },
    deliveryReceipt: blankDeliveryReceipt(),
  });

  setState((prev) => {
    const loadsById = { ...prev.loadsById, [id]: load };
    const order = [id, ...(prev.order || []).filter((x) => x !== id)];
    return { ...prev, loadsById, order };
  });

  return id;
}

// Alias for old calls if needed
function setActiveLoad(id) {
  return activateLoad(id);
}

function activateLoad(id) {
  const target = getLoad(id);
  if (!target) return;

  setState((prev) => {
    const loadsById = { ...prev.loadsById };

    // archive current active if different
    if (prev.activeLoadId && prev.activeLoadId !== id && loadsById[prev.activeLoadId]) {
      loadsById[prev.activeLoadId] = {
        ...ensureLoadShape(loadsById[prev.activeLoadId]),
        status: "completed",
        updatedAt: nowIso(),
      };
    }

    loadsById[id] = {
      ...ensureLoadShape(target),
      status: "active",
      updatedAt: nowIso(),
    };

    const order = [id, ...(prev.order || []).filter((x) => x !== id)];
    return { ...prev, activeLoadId: id, loadsById, order };
  });
}

function patchLoad(id, patch) {
  const cur = getLoad(id);
  if (!cur) return;

  setState((prev) => {
    const loadsById = { ...prev.loadsById };
    loadsById[id] = ensureLoadShape({
      ...cur,
      ...patch,
      meta: { ...(cur.meta || {}), ...(patch?.meta || {}) },
      docs: { ...(cur.docs || {}), ...(patch?.docs || {}) },
      notes: { ...(cur.notes || {}), ...(patch?.notes || {}) },
      deliveryReceipt: { ...(cur.deliveryReceipt || {}), ...(patch?.deliveryReceipt || {}) },
      updatedAt: nowIso(),
    });
    return { ...prev, loadsById };
  });
}

function saveDeliveryReceiptDraft(id, patch) {
  const cur = getLoad(id);
  if (!cur) return;

  patchLoad(id, {
    deliveryReceipt: {
      ...(patch || {}),
      updatedAt: nowIso(),
    },
  });
}

function markDeliveryReceiptComplete(id, complete = true) {
  const cur = getLoad(id);
  if (!cur) return;

  patchLoad(id, {
    docs: { deliveryReceiptComplete: Boolean(complete) },
    deliveryReceipt: { isComplete: Boolean(complete), updatedAt: nowIso() },
  });
}

function markBOLUploaded(id, v = true) {
  patchLoad(id, { docs: { bolUploaded: Boolean(v) } });
}

function markDriverSigned(id, v = true) {
  const cur = getLoad(id);
  if (!cur) return;
  const receiverSigned = Boolean(cur.docs?.receiverSigned);
  patchLoad(id, {
    docs: {
      driverSigned: Boolean(v),
      signaturesComplete: Boolean(v) && receiverSigned,
    },
  });
}

function markReceiverSigned(id, v = true) {
  const cur = getLoad(id);
  if (!cur) return;
  const driverSigned = Boolean(cur.docs?.driverSigned);
  patchLoad(id, {
    docs: {
      receiverSigned: Boolean(v),
      signaturesComplete: Boolean(v) && driverSigned,
    },
  });
}

function completeLoad(id) {
  const cur = getLoad(id);
  if (!cur) return { ok: false, reason: "NOT_FOUND" };

  // do not allow completing drafts
  if (cur.status === "draft") return { ok: false, reason: "DRAFT_NOT_ACTIVE" };

  if (!isPaperworkComplete(cur)) return { ok: false, reason: "MISSING_PAPERWORK" };

  setState((prev) => {
    const loadsById = { ...prev.loadsById };
    loadsById[id] = { ...ensureLoadShape(cur), status: "completed", updatedAt: nowIso() };
    const activeLoadId = prev.activeLoadId === id ? null : prev.activeLoadId;
    return { ...prev, loadsById, activeLoadId };
  });

  return { ok: true };
}

function deleteLoad(id) {
  if (!id) return;
  setState((prev) => {
    if (!prev.loadsById[id]) return prev;
    const loadsById = { ...prev.loadsById };
    delete loadsById[id];
    const order = (prev.order || []).filter((x) => x !== id);
    const activeLoadId = prev.activeLoadId === id ? null : prev.activeLoadId;
    return { loadsById, order, activeLoadId };
  });
}

function resetAll() {
  setState(() => ({ activeLoadId: null, loadsById: {}, order: [] }));
}

export const LoadsStore = {
  getState,
  subscribe,

  getLoad,
  listLoads,

  // derived
  isDeliveryReceiptComplete,
  isPaperworkComplete,
  isMissingPaperwork,

  // actions
  createDraftLoad,
  activateLoad,
  setActiveLoad, // alias
  patchLoad,

  saveDeliveryReceiptDraft,
  markDeliveryReceiptComplete,

  markBOLUploaded,
  markDriverSigned,
  markReceiverSigned,

  completeLoad,
  deleteLoad,
  resetAll,
};