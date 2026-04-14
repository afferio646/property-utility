"use client";

import React, { ReactNode, useEffect, useState, createContext } from "react";
import { DemoProvider } from "./DemoContext";
import { DataProvider } from "./DataContext";

export const ModeContext = createContext<{ isDemo: boolean }>({ isDemo: false });

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isDemo, setIsDemo] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only access URL and Session Storage inside the effect
    const demoModeParam = new URLSearchParams(window.location.search).get("mode") === "demo";
    const demoModeSession = sessionStorage.getItem("demo_mode") === "true";

    // We defer the state update slightly to avoid the "setState synchronously within an effect" warning
    // which happens if we call setDemo/setMounted immediately inside the first pass of useEffect.
    const timeoutId = setTimeout(() => {
      if (demoModeParam || demoModeSession) {
        setIsDemo(true);
        sessionStorage.setItem("demo_mode", "true");
      }
      setMounted(true);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <ModeContext.Provider value={{ isDemo }}>
      {isDemo ? (
        <DemoProvider>{children}</DemoProvider>
      ) : (
        <DataProvider>{children}</DataProvider>
      )}
    </ModeContext.Provider>
  );
};
