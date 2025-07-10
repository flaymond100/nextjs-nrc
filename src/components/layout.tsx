"use client";

import React from "react";
import { ThemeProvider } from "@material-tailwind/react";
import Navbar from "./navbar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Navbar />
      {children}
    </ThemeProvider>
  );
}

export default Layout;
