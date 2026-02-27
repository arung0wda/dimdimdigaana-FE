"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface BlockingState {
  isBlocking: boolean;
  message: string;
}

interface BlockingContextType {
  block: (message?: string) => void;
  unblock: () => void;
  isBlocking: boolean;
}

const BlockingContext = createContext<BlockingContextType>({
  block: () => {},
  unblock: () => {},
  isBlocking: false,
});

export function useBlocking() {
  return useContext(BlockingContext);
}

/** Wraps an async function so it auto-blocks/unblocks the UI */
export function useBlockingCall() {
  const { block, unblock } = useBlocking();

  return useCallback(
    async <T,>(fn: () => Promise<T>, message?: string): Promise<T> => {
      block(message);
      try {
        return await fn();
      } finally {
        unblock();
      }
    },
    [block, unblock]
  );
}

export function BlockingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BlockingState>({
    isBlocking: false,
    message: "",
  });

  const block = useCallback((message = "Processing…") => {
    setState({ isBlocking: true, message });
  }, []);

  const unblock = useCallback(() => {
    setState({ isBlocking: false, message: "" });
  }, []);

  return (
    <BlockingContext.Provider value={{ block, unblock, isBlocking: state.isBlocking }}>
      {children}

      {/* Full-screen blocking overlay */}
      {state.isBlocking && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all">
          <div className="flex flex-col items-center gap-5 bg-slate-900/90 border border-slate-700 rounded-2xl px-10 py-8 shadow-2xl">
            {/* Animated spinner */}
            <div className="relative h-14 w-14">
              <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-indigo-300 animate-spin-reverse" />
            </div>
            <p className="text-slate-200 text-sm font-medium tracking-wide animate-pulse">
              {state.message}
            </p>
          </div>
        </div>
      )}
    </BlockingContext.Provider>
  );
}

