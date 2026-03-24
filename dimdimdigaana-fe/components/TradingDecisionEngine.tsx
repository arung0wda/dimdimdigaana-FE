"use client";

import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────

type Bias = "" | "bull" | "bear";
type RTO = "" | "green" | "red";
type Session = "" | "yes" | "no";
type Decision = "trade" | "wait" | "skip";

interface Result {
  grade: string;
  setup: string;
  aligned: boolean;
  decision: Decision;
  label: string;
}

// ── Pure logic ────────────────────────────────────────────────

function isAligned(bias: Bias, rto: RTO): boolean {
  return (bias === "bull" && rto === "green") || (bias === "bear" && rto === "red");
}

function calculateGrade(sweep: boolean, rtoAlign: boolean, sessionStart: boolean, asia: boolean): string {
  if (sweep && rtoAlign && sessionStart && asia)  return "A+++";
  if (!sweep && rtoAlign && sessionStart && asia) return "A++";
  if (sweep && !rtoAlign && sessionStart)         return "A+";
  return "bad";
}

function detectSetup(bias: Bias, rto: RTO, sweep: boolean): string {
  if (bias === "bull" && rto === "green") return "Bullish Continuation (BUY)";
  if (bias === "bear" && rto === "red")   return "Bearish Continuation (SELL)";
  if (bias === "bull" && rto === "red")
    return sweep ? "Bullish Stop Hunt (BUY after sweep)" : "Potential Stop Hunt (wait for sweep)";
  if (bias === "bear" && rto === "green")
    return sweep ? "Bearish Stop Hunt (SELL after sweep)" : "Potential Stop Hunt (wait for sweep)";
  return "No clear setup";
}

function evaluate(
  bias: Bias,
  rto: RTO,
  session: Session,
  sweep: boolean,
  sessionStart: boolean,
  asia: boolean,
): Result | null {
  if (!bias || !rto || !session) return null;

  const aligned = isAligned(bias, rto);
  const grade   = calculateGrade(sweep, aligned, sessionStart, asia);
  const setup   = detectSetup(bias, rto, sweep);

  // ── Priority-ordered decision logic ──────────────────────────

  // a. Out of session
  if (session === "no") {
    return { grade, setup, aligned, decision: "skip", label: "❌ SKIP (Out of session)" };
  }

  // b. No edge
  if (grade === "bad") {
    return { grade, setup, aligned, decision: "skip", label: "❌ SKIP (No edge detected)" };
  }

  // c. Not aligned and no sweep yet
  if (!aligned && !sweep) {
    return { grade, setup, aligned, decision: "wait", label: "⏳ WAIT (Incomplete setup - wait for sweep)" };
  }

  // d. Stop hunt forming — needs confirmation
  if (grade === "A+") {
    return { grade, setup, aligned, decision: "wait", label: "⏳ WAIT (Stop hunt forming - need confirmation)" };
  }

  // e. Strong confluence — take the trade
  if (grade === "A++" || grade === "A+++") {
    return { grade, setup, aligned, decision: "trade", label: "✅ TRADE (Valid setup)" };
  }

  // f. Fallback
  return { grade, setup, aligned, decision: "skip", label: "❌ SKIP (Low quality setup)" };
}

// ── Styling helpers ───────────────────────────────────────────

const DECISION_STYLES: Record<Decision, string> = {
  trade: "bg-green-600 text-white",
  wait:  "bg-yellow-500 text-black",
  skip:  "bg-red-600 text-white",
};

const selectClass =
  "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500";

// ── Component ─────────────────────────────────────────────────

export default function TradingDecisionEngine() {
  const [bias, setBias]               = useState<Bias>("");
  const [rto, setRto]                 = useState<RTO>("");
  const [session, setSession]         = useState<Session>("");
  const [sweep, setSweep]             = useState(false);
  const [sessionStart, setSessionStart] = useState(false);
  const [asia, setAsia]               = useState(false);
  const [result, setResult]           = useState<Result | null>(null);
  const [error, setError]             = useState<string | null>(null);

  function handleDecide() {
    setError(null);
    if (!bias || !rto || !session) {
      setError("Please fill all required fields.");
      setResult(null);
      return;
    }
    setResult(evaluate(bias, rto, session, sweep, sessionStart, asia));
  }

  return (
    <div className="bg-slate-900 p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold mb-6">🧠 Trading Decision Engine</h2>

      {/* ── Selects ──────────────────────────────────────────── */}
      <div className="space-y-4">
        <div>
          <label className="text-sm text-slate-400">4H Bias</label>
          <select className={selectClass} value={bias} onChange={(e) => setBias(e.target.value as Bias)}>
            <option value="">Select</option>
            <option value="bull">Bullish</option>
            <option value="bear">Bearish</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-slate-400">RTO</label>
          <select className={selectClass} value={rto} onChange={(e) => setRto(e.target.value as RTO)}>
            <option value="">Select</option>
            <option value="green">Green</option>
            <option value="red">Red</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-slate-400">Session Active?</label>
          <select className={selectClass} value={session} onChange={(e) => setSession(e.target.value as Session)}>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>

      {/* ── Entry components (checkboxes) ────────────────────── */}
      <h3 className="text-sm font-semibold text-slate-300 mt-6 mb-3">Entry Components</h3>
      <div className="space-y-2">
        {([
          { id: "sweep",        label: "Liquidity Sweep",        checked: sweep,        set: setSweep },
          { id: "sessionStart", label: "Session Start Momentum", checked: sessionStart, set: setSessionStart },
          { id: "asia",         label: "Asia Continuation",      checked: asia,         set: setAsia },
        ] as const).map(({ id, label, checked, set }) => (
          <label key={id} className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => set(e.target.checked)}
              className="accent-indigo-500 h-4 w-4"
            />
            {label}
          </label>
        ))}
      </div>

      {/* ── Action ───────────────────────────────────────────── */}
      <button
        onClick={handleDecide}
        className="mt-6 w-full bg-green-600 hover:bg-green-500 text-black font-bold py-2.5 rounded-lg transition-colors"
      >
        Get Decision
      </button>

      {error && <p className="mt-4 text-sm text-red-400 text-center">{error}</p>}

      {/* ── Result ───────────────────────────────────────────── */}
      {result && (
        <div className="mt-6 space-y-3">
          <p className="text-center font-semibold text-sm text-slate-300">
            Entry Grade: {result.grade}
          </p>
          <p className="text-center font-semibold text-sm text-sky-400">
            Setup: {result.setup}
          </p>
          <p className={`text-center font-semibold text-sm ${result.aligned ? "text-green-400" : "text-red-400"}`}>
            RTO Alignment: {result.aligned ? "✅ Aligned" : "❌ Not Aligned"}
          </p>
          <div className={`text-center font-bold py-3 rounded-xl ${DECISION_STYLES[result.decision]}`}>
            {result.label}
          </div>
        </div>
      )}
    </div>
  );
}
