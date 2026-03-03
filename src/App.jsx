// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";

import { AuthProvider, useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";

import { Toaster } from "@/components/ui/toaster.jsx";
import PageNotFound from "@/lib/PageNotFound";
import { pagesConfig } from "./pages.config";

const { Pages, Layout, mainPage } = pagesConfig;

const LayoutWrapper = ({ children }) =>
  Layout ? <Layout>{children}</Layout> : <>{children}</>;

function AuthenticatedApp() {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } =
    useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (authError) {
    if (authError.type === "user_not_registered") return <UserNotRegisteredError />;
    if (authError.type === "auth_required") {
      navigateToLogin();
      return null;
    }
  }

  const Main = Pages[mainPage];

  return (
    <Routes>
      {/* Default route */}
      <Route
        path="/"
        element={
          <LayoutWrapper>
            <Main />
          </LayoutWrapper>
        }
      />

      {/* Named pages */}
      {Object.entries(Pages).map(([key, Page]) => (
        <Route
          key={key}
          path={`/${key}`}
          element={
            <LayoutWrapper>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}