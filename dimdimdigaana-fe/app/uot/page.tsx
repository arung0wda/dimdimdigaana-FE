import TradingDecisionEngine from "@/components/TradingDecisionEngine";
import TradingPlaybook from "@/components/TradingPlaybook";

export default function UotPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4">
      <TradingDecisionEngine />
      <TradingPlaybook />
    </div>
  );
}

