import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

const TransitionContext = createContext(null);

export function TransitionProvider({ children }) {
  const [transitionState, setTransitionState] = useState("idle");
  const [isIntroActive, setIsIntroActive] = useState(true);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isIntroActive) {
      document.body.classList.add("page-loading");
    } else {
      document.body.classList.remove("page-loading");
    }
    return () => {
      document.body.classList.remove("page-loading");
    };
  }, [isIntroActive]);

  const transitionTo = useCallback((href) => {
    // No-op transition helper for single page layout
    console.log("Smooth scroll transition requested to:", href);
  }, []);

  const contextValue = useMemo(() => ({
    transitionState,
    transitionTo,
    isIntroActive,
    setIsIntroActive
  }), [transitionState, transitionTo, isIntroActive]);

  return (
    <TransitionContext.Provider value={contextValue}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
}
