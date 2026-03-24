export default function TradingPlaybook() {
  return (
    <div className="bg-slate-900 p-6 rounded-xl shadow-lg max-w-2xl mx-auto mt-8 space-y-8 text-sm leading-relaxed">
      <h2 className="text-lg font-semibold text-center border-b border-slate-700 pb-3">
        📘 Trading Playbook
      </h2>

      {/* ── 1. Identify the 4H Bias ─────────────────────────── */}
      <section>
        <h3 className="text-base font-semibold text-indigo-400 mb-2">
          1. Identify the 4H Bias
        </h3>
        <ul className="space-y-1.5 ml-1">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 h-2 w-2 rounded-full bg-green-500 shrink-0" />
            <span>
              <span className="text-green-400 font-medium">Green</span>{" "}
              (Recent resistance breakout) → Bias is <strong>bullish</strong> → look for{" "}
              <span className="text-green-400 font-semibold">BUY</span> setups only.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 h-2 w-2 rounded-full bg-red-500 shrink-0" />
            <span>
              <span className="text-red-400 font-medium">Red</span>{" "}
              (Recent support breakdown) → Bias is <strong>bearish</strong> → look for{" "}
              <span className="text-red-400 font-semibold">SELL</span> setups only.
            </span>
          </li>
        </ul>
      </section>

      {/* ── 2. Check RTO Color ───────────────────────────────── */}
      <section>
        <h3 className="text-base font-semibold text-indigo-400 mb-2">
          2. Check RTO (Reference to Open) Color
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-slate-400 border-b border-slate-700">
                <th className="py-2 pr-4">4H Bias</th>
                <th className="py-2 pr-4">RTO</th>
                <th className="py-2">Trade Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              <tr className="border-b border-slate-800">
                <td className="py-2 pr-4 text-green-400">Green</td>
                <td className="py-2 pr-4 text-green-400">Green</td>
                <td className="py-2">Only <span className="text-green-400 font-semibold">BUYS</span></td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 pr-4 text-red-400">Red</td>
                <td className="py-2 pr-4 text-red-400">Red</td>
                <td className="py-2">Only <span className="text-red-400 font-semibold">SELLS</span></td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 pr-4 text-green-400">Green</td>
                <td className="py-2 pr-4 text-red-400">Red</td>
                <td className="py-2">
                  Stop hunt <span className="text-green-400 font-semibold">BUY</span>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-red-400">Red</td>
                <td className="py-2 pr-4 text-green-400">Green</td>
                <td className="py-2">
                  Stop hunt <span className="text-red-400 font-semibold">SELL</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 3. Entry Quality ─────────────────────────────────── */}
      <section>
        <h3 className="text-base font-semibold text-indigo-400 mb-2">
          3. Entry Quality
        </h3>
        <div className="space-y-2">
          {[
            {
              grade: "A+++",
              color: "text-green-400",
              tag: "Best",
              desc: "Sweep, RTO aligned, Start of session, Asia continuation",
            },
            {
              grade: "A++",
              color: "text-yellow-400",
              tag: null,
              desc: "No sweep, RTO aligned, Start of session, Asia continuation",
            },
            {
              grade: "A+",
              color: "text-orange-400",
              tag: null,
              desc: "Sweep, RTO NOT aligned, Start of session",
            },
          ].map(({ grade, color, tag, desc }) => (
            <div
              key={grade}
              className="flex items-start gap-3 bg-slate-800/50 rounded-lg px-3 py-2"
            >
              <span className={`font-bold shrink-0 ${color}`}>
                {grade}
                {tag && (
                  <span className="ml-1 text-[10px] bg-green-900 text-green-300 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    {tag}
                  </span>
                )}
              </span>
              <span className="text-slate-300">{desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Trading Windows ───────────────────────────────── */}
      <section>
        <h3 className="text-base font-semibold text-indigo-400 mb-2">
          4. Trading Windows
        </h3>
        <ul className="space-y-1.5 ml-1 text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-px">⏰</span>{" "}
            Focus at the <strong className="text-white">start of sessions</strong> (London / New York)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-px">🌏</span>{" "}
            Prefer setups that align with <strong className="text-white">Asia session continuation</strong>
          </li>
        </ul>
      </section>

      {/* ── 5. Execution Rules ───────────────────────────────── */}
      <section>
        <h3 className="text-base font-semibold text-indigo-400 mb-2">
          5. Execution Rules
        </h3>
        <ul className="space-y-1.5 ml-1 text-slate-300 list-none">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-px">✔</span>{" "}
            Trade only in <strong className="text-white">4H bias direction</strong>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-px">✔</span>{" "}
            If bias &amp; RTO are aligned → <strong className="text-white">continuation trades</strong>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-px">✔</span>{" "}
            If bias &amp; RTO are <em>not</em> aligned → <strong className="text-white">stop hunt setups</strong> in bias direction
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-px">✔</span>{" "}
            Confirm with: <strong className="text-white">Sweep</strong> (if applicable), session start momentum, technical confluence (Levels, TL, AH-AL)
          </li>
        </ul>
      </section>

      {/* ── 6. Avoid ─────────────────────────────────────────── */}
      <section>
        <h3 className="text-base font-semibold text-red-400 mb-2">
          6. Avoid
        </h3>
        <ul className="space-y-1.5 ml-1 text-slate-300 list-none">
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-px">✘</span>{" "}
            Trading out of sessions with no momentum
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-px">✘</span>{" "}
            Taking trades against 4H bias
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-px">✘</span>{" "}
            Entering without session start / sweep / RTO check
          </li>
        </ul>
      </section>
    </div>
  );
}
