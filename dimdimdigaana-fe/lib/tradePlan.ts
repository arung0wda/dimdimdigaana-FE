// ─── Types ──────────────────────────────────────────────────────────────────

export type Bias = "bullish" | "bearish" | "neutral";
export type RTO = "bullish" | "bearish" | "neutral";
export type SessionState = "bullish" | "bearish" | "neutral";
export type Session = "london" | "newyork";

export interface TradeInputs {
  bias: Bias;
  rto: RTO;
  asia: SessionState;
  london?: SessionState;
  session: Session;
}

export type Setup =
  | "continuation"
  | "stop_hunt"
  | "intraday"
  | "anticipation"
  | "none";

export type Confidence = "A+" | "A++" | "A+++";

export interface TradePlan {
  trade: "BUY" | "SELL" | "NO TRADE";
  setup: Setup;
  confidence: Confidence;
  score: number;
  notes: string[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function directionToTrade(dir: "bullish" | "bearish"): "BUY" | "SELL" {
  return dir === "bullish" ? "BUY" : "SELL";
}

function getConfidenceLabel(score: number): Confidence {
  if (score >= 3) return "A+++";
  if (score >= 2) return "A++";
  return "A+";
}

// ── Layer 1: Base decision ──────────────────────────────────────────────────

interface BaseDecision {
  trade: "BUY" | "SELL";
  setup: Setup;
  score: number;
  notes: string[];
}

function computeBaseDecision(bias: Bias, rto: RTO): BaseDecision {
  // CASE A: bias neutral, rto directional
  if (bias === "neutral" && rto !== "neutral") {
    return {
      trade: directionToTrade(rto),
      setup: "intraday",
      score: 1,
      notes: [
        "4H bias neutral → lower timeframe control",
        "Weaker setup, manage risk",
      ],
    };
  }

  // CASE B: rto neutral, bias directional
  if (rto === "neutral" && bias !== "neutral") {
    return {
      trade: directionToTrade(bias),
      setup: "anticipation",
      score: 1,
      notes: [
        "RTO neutral → no clear intraday intent",
        "Wait for confirmation or breakout",
      ],
    };
  }

  // CASE C: both directional (guaranteed at this point after layer 0 guard)
  if (bias === rto) {
    return { trade: directionToTrade(bias as "bullish" | "bearish"), setup: "continuation", score: 2, notes: [] };
  }

  return {
    trade: directionToTrade(bias as "bullish" | "bearish"),
    setup: "stop_hunt",
    score: 1,
    notes: ["Wait for liquidity sweep before entry"],
  };
}

// ── Layer 2: Asia session adjustments ───────────────────────────────────────

function applyAsiaLayer(bias: Bias, asia: SessionState, score: number, notes: string[]): number {
  if (asia === "neutral") {
    notes.push("Asia range → breakout likely");
    return score + 1;
  }
  if (bias !== "neutral" && asia === bias) {
    notes.push("Asia aligned with bias → continuation strength");
    return score;
  }
  if (bias !== "neutral" && asia !== bias) {
    notes.push("Asia against bias → possible trap");
    return score - 0.5;
  }
  return score;
}

// ── Layer 3: Session adjustments ────────────────────────────────────────────

function applySessionLayer(
  session: Session,
  bias: Bias,
  asia: SessionState,
  london: SessionState | undefined,
  score: number,
  notes: string[],
): number {
  if (session === "london") {
    notes.push("Focus on Asia high/low sweep");
    if (asia === "neutral") {
      notes.push("High probability London breakout");
    }
    return score;
  }

  // session === "newyork"
  if (london === undefined) {
    throw new Error("London session state is required for New York session");
  }

  if (bias !== "neutral" && london === bias) {
    notes.push("London aligned → trend continuation likely");
    return score + 1;
  }
  if (london !== "neutral" && bias !== "neutral" && london !== bias) {
    notes.push("London conflict → reversal or choppy conditions");
    return score - 0.5;
  }
  if (london === "neutral") {
    notes.push("London range → NY breakout likely");
  }
  return score;
}

// ─── Core Engine ────────────────────────────────────────────────────────────

export function getTradePlan(inputs: TradeInputs): TradePlan {
  const { bias, rto, asia, london, session } = inputs;

  // ── LAYER 0: Hard stop ──────────────────────────────────────────────────
  if (bias === "neutral" && rto === "neutral") {
    return {
      trade: "NO TRADE",
      setup: "none",
      confidence: "A+",
      score: 0,
      notes: [
        "Higher timeframe and intraday intent are both neutral",
        "Market lacks direction",
        "Best action: stay out",
      ],
    };
  }

  // ── LAYER 1: Base decision ──────────────────────────────────────────────
  const base = computeBaseDecision(bias, rto);
  const notes = [...base.notes];
  let score = base.score;

  // ── LAYER 2: Asia ───────────────────────────────────────────────────────
  score = applyAsiaLayer(bias, asia, score, notes);

  // ── LAYER 3: Session ────────────────────────────────────────────────────
  score = applySessionLayer(session, bias, asia, london, score, notes);

  // ── LAYER 4: Confidence ─────────────────────────────────────────────────
  const confidence = getConfidenceLabel(score);

  return { trade: base.trade, setup: base.setup, confidence, score, notes };
}

// ─── React hook wrapper ─────────────────────────────────────────────────────

import { useState, useCallback } from "react";

export interface UseTradePlanReturn {
  plan: TradePlan | null;
  error: string | null;
  compute: (inputs: TradeInputs) => void;
  reset: () => void;
}

export function useTradePlan(): UseTradePlanReturn {
  const [plan, setPlan] = useState<TradePlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const compute = useCallback((inputs: TradeInputs) => {
    try {
      setError(null);
      const result = getTradePlan(inputs);
      setPlan(result);
    } catch (err: unknown) {
      setPlan(null);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, []);

  const reset = useCallback(() => {
    setPlan(null);
    setError(null);
  }, []);

  return { plan, error, compute, reset };
}
