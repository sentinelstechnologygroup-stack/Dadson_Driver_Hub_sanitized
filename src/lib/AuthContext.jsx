// src/lib/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/api/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Kept for compatibility with existing App.jsx expectations
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    // Local-first auth: if a dev user is present in localStorage, treat as authenticated.
    const bootstrap = async () => {
      setIsLoadingAuth(true);
      setAuthError(null);

      try {
        const me = await api.auth.me();
        setUser(me);
        setIsAuthenticated(true);
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
        // Do not surface an error by default; the app can run without auth.
        setAuthError(null);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    bootstrap();
  }, []);

  const navigateToLogin = () => {
    api.auth.redirectToLogin();
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      navigateToLogin,
      logout,
      setUser,
      setIsAuthenticated,
      setAuthError,
      setAppPublicSettings,
    }),
    [user, isAuthenticated, isLoadingAuth, isLoadingPublicSettings, authError, appPublicSettings]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}
