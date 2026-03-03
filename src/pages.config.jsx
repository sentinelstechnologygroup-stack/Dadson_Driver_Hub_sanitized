// src/pages.config.js
import React from "react";
import AppLayout from "@/layout/AppLayout";
import DriverHub from "@/pages/DriverHub";

export const pagesConfig = {
  Pages: {
    DriverHub,
  },

  // Canonical layout wrapper
  Layout: ({ children }) => <AppLayout>{children}</AppLayout>,

  // Default route ("/")
  mainPage: "DriverHub",
};