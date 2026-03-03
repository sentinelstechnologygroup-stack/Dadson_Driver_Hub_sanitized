// src/components/driverhub/LoadDetailScreen.jsx
import React, { useEffect, useMemo, useState } from "react";

function isFilled(v) {
  return String(v ?? "").trim().length > 0;
}

function Btn({ children, className = "", ...props }) {
  return (
    <button
      type="button"
      {...props}
      className={`rounded-xl px-4 py-3 font-extrabold ${className}`}
    >
      {children}
    </button>
  );
}

function Field({ label, required, children }) {
  return (
    <div className="mb-4">
      <div className="text-sm font-semibold text-slate-800 mb-2">
        {label} {required ? <span className="text-rose-600">*</span> : null}
      </div>
      {children}
    </div>
  );
}

function TextInput({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200 ${className}`}
    />
  );
}

function TextArea({ className = "", ...props }) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200 ${className}`}
    />
  );
}

function Chip({ ok, label }) {
  return (
    <div
      className={`px-3 py-2 rounded-xl text-xs font-bold ${
        ok ? "bg-emerald-100 text-emerald-900" : "bg-slate-100 text-slate-500"
      }`}
    >
      {label}
    </div>
  );
}

export default function LoadDetailScreen({
  load,
  onBack,
  onGoLoadsTab,

  onActivateLoad,
  onSaveDeliveryReceipt,
  onMarkDeliveryReceiptComplete,

  onBOLUpload,
  onDriverSign,
  onReceiverSign,
  onCompleteDelivery,
}) {
  // Guard: if no load, show safe fallback
  if (!load) {
    return (
      <div className="p-6">
        <div className="text-lg font-extrabold">Load Detail</div>
        <div className="mt-2 text-slate-600">No load selected.</div>
        <div className="mt-4 flex gap-2">
          <Btn className="bg-slate-900 text-white" onClick={() => onBack?.()}>
            Back
          </Btn>
          <Btn className="bg-slate-100 text-slate-900" onClick={() => onGoLoadsTab?.()}>
            Loads
          </Btn>
        </div>
      </div>
    );
  }

  const status = load.status || "draft";
  const isDraft = status === "draft";

  // Pull current persisted values (always string-safe)
  const persisted = useMemo(() => {
    const dr = load.deliveryReceipt || {};
    return {
      billTo: String(dr.billTo ?? ""),
      bolNumber: String(dr.bolNumber ?? ""),
      poNumber: String(dr.poNumber ?? ""),
      deliveryDate: String(dr.deliveryDate ?? ""),
      deliveryTime: String(dr.deliveryTime ?? ""),
      pieces: String(dr.pieces ?? ""),
      notesText: String(load?.notes?.text ?? ""), // keep notes as plain string
    };
  }, [load]);

  // Local editable state (must resync when switching loads)
  const [billTo, setBillTo] = useState(persisted.billTo);
  const [bolNumber, setBolNumber] = useState(persisted.bolNumber);
  const [poNumber, setPoNumber] = useState(persisted.poNumber);
  const [deliveryDate, setDeliveryDate] = useState(persisted.deliveryDate);
  const [deliveryTime, setDeliveryTime] = useState(persisted.deliveryTime);
  const [pieces, setPieces] = useState(persisted.pieces);
  const [notesText, setNotesText] = useState(persisted.notesText);

  useEffect(() => {
    // CRITICAL: when opening a different load, refresh the form
    setBillTo(persisted.billTo);
    setBolNumber(persisted.bolNumber);
    setPoNumber(persisted.poNumber);
    setDeliveryDate(persisted.deliveryDate);
    setDeliveryTime(persisted.deliveryTime);
    setPieces(persisted.pieces);
    setNotesText(persisted.notesText);
  }, [persisted]);

  const checklist = useMemo(() => {
    const billToOk = isFilled(billTo);
    const bolOk = isFilled(bolNumber);
    const poOk = isFilled(poNumber);
    const dateOk = isFilled(deliveryDate);
    const timeOk = isFilled(deliveryTime);
    const piecesOk = isFilled(pieces);

    const bolImgOk = Boolean(load?.docs?.bolUploaded);
    const driverSigOk = Boolean(load?.docs?.driverSigned);
    const receiverSigOk = Boolean(load?.docs?.receiverSigned);

    return {
      billToOk,
      bolOk,
      poOk,
      dateOk,
      timeOk,
      piecesOk,
      bolImgOk,
      driverSigOk,
      receiverSigOk,
    };
  }, [billTo, bolNumber, poNumber, deliveryDate, deliveryTime, pieces, load]);

  const deliveryReceiptRequiredOk =
    checklist.billToOk &&
    checklist.bolOk &&
    checklist.poOk &&
    checklist.dateOk &&
    checklist.timeOk &&
    checklist.piecesOk;

  function saveDraftNow() {
    // Save Delivery Receipt draft
    onSaveDeliveryReceipt?.({
      billTo,
      bolNumber,
      poNumber,
      deliveryDate,
      deliveryTime,
      pieces,
    });

    // Notes patch is a store responsibility; we’ll wire it next pass via patchLoad.
    // For now: keep the UI stable and never shove objects into inputs.
  }

  function markDeliveryReceiptComplete() {
    saveDraftNow();
    if (!deliveryReceiptRequiredOk) {
      // next: modal listing missing fields
      return;
    }
    onMarkDeliveryReceiptComplete?.();
  }

  return (
    <div className="pb-24">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
        <button type="button" onClick={() => onBack?.()} className="font-bold">
          ←
        </button>
        <div className="font-extrabold">Load Detail</div>
        <Btn className="bg-white/10 text-white px-3 py-2 text-sm" onClick={saveDraftNow}>
          Save Draft
        </Btn>
      </div>

      {/* Header area */}
      <div className="px-4 pt-4">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg font-extrabold">
                {load?.meta?.loadNumber || "New Load"}
              </div>
              <div className="text-sm text-slate-600">
                {isDraft ? "Draft — not started yet" : "Active / In Progress"}
              </div>
            </div>

            <div
              className={`px-3 py-2 rounded-xl text-xs font-extrabold ${
                isDraft ? "bg-slate-100 text-slate-700" : "bg-emerald-100 text-emerald-900"
              }`}
            >
              {isDraft ? "DRAFT" : "ACTIVE"}
            </div>
          </div>

          {/* Checklist chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip ok={checklist.billToOk} label="Bill To" />
            <Chip ok={checklist.bolOk} label="BOL #" />
            <Chip ok={checklist.poOk} label="PO #" />
            <Chip ok={checklist.dateOk} label="Date" />
            <Chip ok={checklist.timeOk} label="Time" />
            <Chip ok={checklist.piecesOk} label="# Pieces" />
            <Chip ok={checklist.bolImgOk} label="BOL Img" />
            <Chip ok={checklist.driverSigOk} label="Driver Sig" />
            <Chip ok={checklist.receiverSigOk} label="Receiver Sig" />
          </div>

          {/* Primary actions */}
          <div className="mt-4 flex gap-2">
            {isDraft ? (
              <Btn
                className="flex-1 bg-blue-600 text-white"
                onClick={() => onActivateLoad?.()}
              >
                Start Load
              </Btn>
            ) : (
              <Btn
                className="flex-1 bg-blue-600 text-white"
                onClick={markDeliveryReceiptComplete}
              >
                Mark Delivery Receipt Complete
              </Btn>
            )}

            <Btn className="bg-slate-100 text-slate-900" onClick={() => onGoLoadsTab?.()}>
              Loads
            </Btn>
          </div>
        </div>
      </div>

      {/* A - Delivery Receipt fields */}
      <div className="px-4 mt-4">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
          <div className="text-xs tracking-[0.18em] font-bold text-slate-500 mb-4">
            A · DELIVERY RECEIPT (REQUIRED)
          </div>

          <Field label="Bill To" required>
            <TextInput
              value={billTo}
              onChange={(e) => setBillTo(e.target.value)}
              onBlur={saveDraftNow}
              placeholder="Customer name..."
            />
          </Field>

          <Field label="BOL #" required>
            <TextInput
              value={bolNumber}
              onChange={(e) => setBolNumber(e.target.value)}
              onBlur={saveDraftNow}
              placeholder="e.g. 123456"
            />
          </Field>

          <Field label="PO #" required>
            <TextInput
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              onBlur={saveDraftNow}
              placeholder="e.g. 98765"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Field label="Delivery Date" required>
                <TextInput
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  onBlur={saveDraftNow}
                  placeholder="mm/dd/yyyy"
                />
              </Field>
            </div>
            <div>
              <Field label="Delivery Time" required>
                <TextInput
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  onBlur={saveDraftNow}
                  placeholder="--:--"
                />
              </Field>
            </div>
          </div>

          <Field label="# Pieces" required>
            <TextInput
              value={pieces}
              onChange={(e) => setPieces(e.target.value)}
              onBlur={saveDraftNow}
              placeholder="e.g. 12"
            />
          </Field>

          <Field label="Consignee" required={false}>
            <TextInput
              value={String(load?.deliveryReceipt?.consignee ?? "")}
              onChange={(e) => onSaveDeliveryReceipt?.({ consignee: e.target.value })}
              onBlur={saveDraftNow}
              placeholder="Consignee..."
            />
          </Field>

          <Field label="Shipper" required={false}>
            <TextInput
              value={String(load?.deliveryReceipt?.shipper ?? "")}
              onChange={(e) => onSaveDeliveryReceipt?.({ shipper: e.target.value })}
              onBlur={saveDraftNow}
              placeholder="Shipper..."
            />
          </Field>

          <Field label="Description / Special Instructions" required={false}>
            <TextArea
              rows={3}
              value={String(load?.deliveryReceipt?.instructions ?? "")}
              onChange={(e) => onSaveDeliveryReceipt?.({ instructions: e.target.value })}
              onBlur={saveDraftNow}
              placeholder="Product description, notes, special instructions..."
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Field label="Weight" required={false}>
                <TextInput
                  value={String(load?.deliveryReceipt?.weight ?? "")}
                  onChange={(e) => onSaveDeliveryReceipt?.({ weight: e.target.value })}
                  onBlur={saveDraftNow}
                  placeholder="Weight..."
                />
              </Field>
            </div>
            <div>
              <Field label="Print Name" required={false}>
                <TextInput
                  value={String(load?.deliveryReceipt?.printName ?? "")}
                  onChange={(e) => onSaveDeliveryReceipt?.({ printName: e.target.value })}
                  onBlur={saveDraftNow}
                  placeholder="Print name..."
                />
              </Field>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Field label="Tractor #" required={false}>
                <TextInput
                  value={String(load?.deliveryReceipt?.tractorNumber ?? "")}
                  onChange={(e) => onSaveDeliveryReceipt?.({ tractorNumber: e.target.value })}
                  onBlur={saveDraftNow}
                  placeholder="Tractor #"
                />
              </Field>
            </div>
            <div>
              <Field label="Trailer #" required={false}>
                <TextInput
                  value={String(load?.deliveryReceipt?.trailerNumber ?? "")}
                  onChange={(e) => onSaveDeliveryReceipt?.({ trailerNumber: e.target.value })}
                  onBlur={saveDraftNow}
                  placeholder="Trailer #"
                />
              </Field>
            </div>
          </div>
          {!deliveryReceiptRequiredOk ? (
            <div className="mt-2 text-xs text-amber-700 font-bold">
              Complete all required fields before marking Delivery Receipt complete.
            </div>
          ) : null}
        </div>
      </div>

      {/* B - BOL Images */}
      <div className="px-4 mt-4">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
          <div className="text-xs tracking-[0.18em] font-bold text-slate-500 mb-3">
            B · BOL IMAGES (REQUIRED)
          </div>

          <button
            type="button"
            onClick={() => onBOLUpload?.()}
            className="w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-10 font-extrabold text-slate-700"
          >
            + Add Photo
          </button>

          <div className="mt-2 text-xs text-slate-500">
            Uploaded: {load?.docs?.bolUploaded ? "Yes" : "No"}
          </div>
        </div>
      </div>

      {/* C - Notes + signatures + complete */}
      <div className="px-4 mt-4">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
          <div className="text-xs tracking-[0.18em] font-bold text-slate-500 mb-3">
            C · NOTES & SIGNATURES
          </div>

          <TextArea
            rows={4}
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
            placeholder="Notes about the load..."
          />

          <div className="mt-3 flex gap-2">
            <Btn className="flex-1 bg-slate-900 text-white" onClick={() => onDriverSign?.()}>
              Driver Signature
            </Btn>
            <Btn className="flex-1 bg-slate-900 text-white" onClick={() => onReceiverSign?.()}>
              Receiver Signature
            </Btn>
          </div>

          <Btn className="mt-3 w-full bg-emerald-600 text-white" onClick={() => onCompleteDelivery?.()}>
            Complete Delivery
          </Btn>
        </div>
      </div>
    </div>
  );
}