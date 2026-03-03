// src/api/apiClient.js
// Minimal, local-first API shim.
// Replace with a real backend (Firebase / REST) when ready.

const DEV_USER_KEY = "driverhub.devUser.v1";

function readDevUser() {
  try {
    const raw = window.localStorage.getItem(DEV_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearDevUser() {
  try {
    window.localStorage.removeItem(DEV_USER_KEY);
  } catch {
    // ignore
  }
}

export const api = {
  auth: {
    async me() {
      // If you want an authenticated dev session, set:
      // localStorage.setItem("driverhub.devUser.v1", JSON.stringify({ id: "dev", role: "admin", name: "Dev User" }))
      const user = readDevUser();
      if (!user) {
        const err = new Error("Not authenticated");
        err.status = 401;
        throw err;
      }
      return user;
    },

    async logout() {
      clearDevUser();
      return true;
    },

    redirectToLogin() {
      // App can implement a /login route later. For now, go home.
      window.location.href = "/";
    },
  },
};
