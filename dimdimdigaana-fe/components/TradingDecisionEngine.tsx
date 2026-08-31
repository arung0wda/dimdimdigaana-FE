"use client";

import { useState } from "react";
import {
  type Bias,
  type RTO,
  type SessionState,
  type Session,
  type TradePlan,
  useTradePlan,
} from "@/lib/tradePlan";

// ── Styling helpers ───────────────────────────────────────────

const selectClass =
  "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500";

const fieldHelpText = {
  bias:
    "Switch to 4h time frame. On a downtrend, If the price is closed above previous Swing high(resistance), it is bullish. vice versa for Bearish",
  rto:
    "Reference price action to the open. If price is accepting above the open, treat it as bullish. If it is accepting below the open, treat it as bearish. Use neutral when there is no clear directional intent.",
  asia:
    "Mark how the Asia session behaved. Choose bullish or bearish when Asia clearly expanded in one direction. Choose neutral when Asia stayed in a range or lacked direction.",
  session:
    "Choose the session you are currently planning to trade. Select New York only when you also want London session behavior included in the decision.",
  london:
    "Only used for New York trades. Mark whether London continued bullish, continued bearish, or stayed neutral before New York opened.",
} as const;

function FieldHelp({ text }: { text: string }) {
  return (
    <span
      className="mt-2 inline-flex cursor-help items-center gap-1 text-xs text-slate-500"
      title={text}
      aria-label={text}
      tabIndex={0}
    >
      <span className="text-sm leading-none text-slate-400">i</span>
      Hover for help
    </span>
  );
}

function tradeColor(trade: TradePlan["trade"]): string {
  if (trade === "BUY") return "bg-green-600 text-white";
  if (trade === "SELL") return "bg-red-600 text-white";
  return "bg-slate-600 text-white";
}

function confidenceBadge(c: TradePlan["confidence"]): string {
  if (c === "A+++") return "bg-green-900 text-green-300";
  if (c === "A++") return "bg-yellow-900 text-yellow-300";
  return "bg-orange-900 text-orange-300";
}

function setupLabel(s: TradePlan["setup"]): string {
  const map: Record<TradePlan["setup"], string> = {
    continuation: "Continuation",
    stop_hunt: "Stop Hunt",
    intraday: "Intraday (Bias Neutral)",
    anticipation: "Anticipation (RTO Neutral)",
    none: "No Setup",
  };
  return map[s];
}

// ── Component ─────────────────────────────────────────────────

export default function TradingDecisionEngine() {
  const [bias, setBias] = useState<Bias | "">("");
  const [rto, setRto] = useState<RTO | "">("");
  const [asia, setAsia] = useState<SessionState | "">("");
  const [london, setLondon] = useState<SessionState | "">("");
  const [session, setSession] = useState<Session | "">("");

  const { plan, error, compute, reset } = useTradePlan();
  const [validationError, setValidationError] = useState<string | null>(null);

  const showLondon = session === "newyork";

  function handleDecide() {
    setValidationError(null);

    if (!bias || !rto || !asia || !session) {
      setValidationError("Please fill all required fields.");
      reset();
      return;
    }

    if (session === "newyork" && !london) {
      setValidationError("London session state is required for New York session.");
      reset();
      return;
    }

    compute({
      bias,
      rto,
      asia,
      london: session === "newyork" ? (london as SessionState) : undefined,
      session,
    });
  }

  function handleReset() {
    setBias("");
    setRto("");
    setAsia("");
    setLondon("");
    setSession("");
    setValidationError(null);
    reset();
  }

  return (
    <div className="bg-slate-900 p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold mb-6">🧠 Trading Decision Engine v2</h2>

      {/* ── Inputs ─────────────────────────────────────────── */}
      <div className="space-y-4">
        {/* 4H Bias */}
        <div>
          <label className="text-sm text-slate-400">4H Bias</label>
          <select className={selectClass} value={bias} onChange={(e) => setBias(e.target.value as Bias | "")}>
            <option value="">Select</option>
            <option value="bullish">Bullish</option>
            <option value="bearish">Bearish</option>
            <option value="neutral">Neutral</option>
          </select>
          <FieldHelp text={fieldHelpText.bias} />
        </div>

        {/* RTO */}
        <div>
          <label className="text-sm text-slate-400">RTO (Reference to Open)</label>
          <select className={selectClass} value={rto} onChange={(e) => setRto(e.target.value as RTO | "")}>
            <option value="">Select</option>
            <option value="bullish">Bullish</option>
            <option value="bearish">Bearish</option>
            <option value="neutral">Neutral</option>
          </select>
          <FieldHelp text={fieldHelpText.rto} />
        </div>

        {/* Asia */}
        <div>
          <label className="text-sm text-slate-400">Asia Session</label>
          <select className={selectClass} value={asia} onChange={(e) => setAsia(e.target.value as SessionState | "")}>
            <option value="">Select</option>
            <option value="bullish">Bullish</option>
            <option value="bearish">Bearish</option>
            <option value="neutral">Neutral</option>
          </select>
          <FieldHelp text={fieldHelpText.asia} />
        </div>

        {/* Session */}
        <div>
          <label className="text-sm text-slate-400">Current Session</label>
          <select className={selectClass} value={session} onChange={(e) => { setSession(e.target.value as Session | ""); if (e.target.value !== "newyork") setLondon(""); }}>
            <option value="">Select</option>
            <option value="london">London</option>
            <option value="newyork">New York</option>
          </select>
          <FieldHelp text={fieldHelpText.session} />
        </div>

        {/* London (conditional) */}
        {showLondon && (
          <div>
            <label className="text-sm text-slate-400">London Session</label>
            <select className={selectClass} value={london} onChange={(e) => setLondon(e.target.value as SessionState | "")}>
              <option value="">Select</option>
              <option value="bullish">Bullish</option>
              <option value="bearish">Bearish</option>
              <option value="neutral">Neutral</option>
            </select>
            <FieldHelp text={fieldHelpText.london} />
          </div>
        )}
      </div>

      {/* ── Actions ────────────────────────────────────────── */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleDecide}
          className="flex-1 bg-green-600 hover:bg-green-500 text-black font-bold py-2.5 rounded-lg transition-colors"
        >
          Get Trade Plan
        </button>
        <button
          onClick={handleReset}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 rounded-lg transition-colors"
        >
          Reset
        </button>
      </div>

      {/* ── Errors ─────────────────────────────────────────── */}
      {(validationError || error) && (
        <p className="mt-4 text-sm text-red-400 text-center">{validationError || error}</p>
      )}

      {/* ── Result ─────────────────────────────────────────── */}
      {plan && (
        <div className="mt-6 space-y-4">
          {/* Trade action pill */}
          <div className={`text-center font-bold text-xl py-4 rounded-xl ${tradeColor(plan.trade)}`}>
            {plan.trade === "BUY" && "🟢 "}
            {plan.trade === "SELL" && "🔴 "}
            {plan.trade === "NO TRADE" && "⚪ "}
            {plan.trade}
          </div>

          {/* Meta row */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${confidenceBadge(plan.confidence)}`}>
              {plan.confidence}
            </span>
            <span className="text-xs font-semibold text-sky-400 bg-sky-900/40 px-3 py-1 rounded-full">
              {setupLabel(plan.setup)}
            </span>
            <span className="text-xs text-slate-400">
              Score: {plan.score}
            </span>
          </div>

          {/* Notes */}
          {plan.notes.length > 0 && (
            <div className="bg-slate-800/60 rounded-lg p-4 space-y-1.5">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Notes</h4>
              {plan.notes.map((note, i) => (
                <p key={i} className="text-sm text-slate-300 flex items-start gap-2">
                  <span className="text-indigo-400 mt-px shrink-0">•</span>
                  {note}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
