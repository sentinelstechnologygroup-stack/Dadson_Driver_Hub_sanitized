// src/components/driverhub/driverhub.storage.js

export function makeLoadKey(load) {
  const L = load || {};
  return L.id || L.bol || L.po || "default-load";
}

export function getDriverSig(loadKey) {
  try {
    return localStorage.getItem(`dh:driverSig:${loadKey}`) === "1";
  } catch {
    return false;
  }
}

export function setDriverSig(loadKey, signed) {
  try {
    localStorage.setItem(`dh:driverSig:${loadKey}`, signed ? "1" : "0");
  } catch {
    // ignore
  }
}

export function getBolImagesCount(loadKey) {
  try {
    const raw = localStorage.getItem(`dh:bolImagesCount:${loadKey}`);
    const n = Number(raw || 0);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

export function setBolImagesCount(loadKey, count) {
  try {
    localStorage.setItem(`dh:bolImagesCount:${loadKey}`, String(Number(count) || 0));
  } catch {
    // ignore
  }
}