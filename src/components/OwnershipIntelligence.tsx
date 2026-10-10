import React, { useState } from 'react';
import { OWNERSHIP_DATA_MAP } from '../data/marketData';

export const OwnershipIntelligence: React.FC = () => {
  const [selectedEntity, setSelectedEntity] = useState<string>('NVDA');
  const ownership = OWNERSHIP_DATA_MAP[selectedEntity] || OWNERSHIP_DATA_MAP.NVDA;

  return (
    <div className="space-y-6">
      {/* 1. Regulatory Context Notice */}
      <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-100">
            SEC Form 13F & Regulatory Shareholder Intelligence
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Institutional investment managers exercising discretion over &gt;$100M must file Form 13F within 45 days after the end of each calendar quarter.
          </p>
        </div>

        {/* Entity Switcher */}
        <div className="flex items-center gap-1.5 bg-[#070e1f] p-1 rounded border border-[#1e293b] text-xs font-mono">
          {Object.keys(OWNERSHIP_DATA_MAP).map((sym) => (
            <button
              key={sym}
              onClick={() => setSelectedEntity(sym)}
              className={`px-3 py-1 rounded transition-colors ${
                selectedEntity === sym
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sym}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Float Ownership Distribution Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-4">
          <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
            Institutional Ownership
          </div>
          <div className="text-2xl font-bold text-emerald-400 tabular-nums">
            {ownership.institutionalOwnershipPct}%
          </div>
          <div className="text-slate-400 text-[11px] mt-1">
            Mutual Funds, Pensions, ETFs & Sovereign Wealth
          </div>
        </div>

        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-4">
          <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
            Executive & Insider Holdings
          </div>
          <div className="text-2xl font-bold text-amber-400 tabular-nums">
            {ownership.insiderOwnershipPct}%
          </div>
          <div className="text-slate-400 text-[11px] mt-1">
            Officers, Directors & Form 4 Reporting Persons
          </div>
        </div>

        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-4">
          <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
            Public & Retail Float
          </div>
          <div className="text-2xl font-bold text-slate-100 tabular-nums">
            {ownership.retailPublicPct}%
          </div>
          <div className="text-slate-400 text-[11px] mt-1">
            Freely Tradable Public Liquidity Pool
          </div>
        </div>
      </div>

      {/* 3. Disclosed Major Institutional Holders Table */}
      <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1e293b] flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
              Top Disclosed Institutional Shareholders
            </span>
            <span className="text-slate-500 ml-2 font-mono text-[11px]">
              Source: {ownership.filingSource} ({ownership.reportingPeriod})
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#070e1f] text-slate-400 border-b border-[#1e293b] text-[11px]">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Institution Name</th>
                <th className="px-4 py-2.5 text-right font-semibold">Reported Shares</th>
                <th className="px-4 py-2.5 text-right font-semibold">Portfolio Weight</th>
                <th className="px-4 py-2.5 text-right font-semibold">QoQ Change</th>
                <th className="px-4 py-2.5 text-right font-semibold">Audit Filing Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/60">
              {ownership.topInstitutions.map((inst, i) => {
                const isPos = inst.changeSharesPct.startsWith('+');
                return (
                  <tr key={i} className="hover:bg-[#111f38]/50">
                    <td className="px-4 py-2.5 font-semibold text-slate-200 font-sans">
                      {inst.name}
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-100 tabular-nums">
                      {inst.sharesHeld}
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-300 tabular-nums">
                      {inst.portfolioWeightPct}%
                    </td>
                    <td
                      className={`px-4 py-2.5 text-right tabular-nums font-semibold ${
                        isPos ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {inst.changeSharesPct}
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-400 tabular-nums text-[11px]">
                      {inst.filingDate}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Insider Roster & Statutory Disclaimer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0b1528] border border-[#1e293b] rounded-lg p-4 space-y-3">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Major Disclosed Insider & Corporate Officer Holdings
          </h3>
          <div className="space-y-2">
            {ownership.keyInsiders.map((ins, idx) => (
              <div
                key={idx}
                className="bg-[#070e1f] border border-[#1e293b]/70 rounded p-3 text-xs flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <div className="font-semibold text-slate-200">{ins.name}</div>
                  <div className="text-[11px] text-slate-400">{ins.title}</div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-slate-200 font-bold tabular-nums">
                    {ins.sharesHeld} ({ins.pctOutstanding})
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Reported: {ins.reportedDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Boundaries Box */}
        <div className="bg-[#070e1f] border border-[#1e293b] rounded-lg p-4 text-xs space-y-2.5">
          <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
            Data Boundary & Disclosure Rules
          </h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            {ownership.notice}
          </p>
          <div className="pt-2 border-t border-[#1e293b] text-[10px] text-slate-400 space-y-1">
            <div>• Form 13F excludes short positions and cash balances.</div>
            <div>• Insider trades must be filed within 2 business days on SEC Form 4.</div>
            <div>• Never implies real-time insight into private brokerages.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
