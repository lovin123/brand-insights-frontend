"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { BrandInsights } from "@/lib/api-client";

interface InsightsContextType {
  insights: BrandInsights | null;
  setInsights: (insights: BrandInsights | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const InsightsContext = createContext<InsightsContextType | undefined>(
  undefined
);

export function InsightsProvider({ children }: { children: ReactNode }) {
  const [insights, setInsights] = useState<BrandInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <InsightsContext.Provider
      value={{
        insights,
        setInsights,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </InsightsContext.Provider>
  );
}

export function useInsights() {
  const context = useContext(InsightsContext);
  if (context === undefined) {
    throw new Error("useInsights must be used within an InsightsProvider");
  }
  return context;
}
