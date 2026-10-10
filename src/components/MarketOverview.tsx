import React from 'react';
import { GlobalIndex, Quote, MarketBar } from '../types/market';
import { CURRENCY_MAP } from '../data/marketData';
import { CandleChart } from './CandleChart';

interface MarketOverviewProps {
  indices: GlobalIndex[];
  quotes: Quote[];
  selectedSymbol: string;
  setSelectedSymbol: (s: string) => void;
  selectedBars: MarketBar[];
  currency: string;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({
  indices,
  quotes,
  selectedSymbol,
  setSelectedSymbol,
  selectedBars,
  currency,
}) => {
  const meta = CURRENCY_MAP[currency] || CURRENCY_MAP.USD;

  // Market Breadth calculation
  const advancers = quotes.filter((q) => q.changePct > 0).length;
  const decliners = quotes.filter((q) => q.changePct < 0).length;
  const unchanged = quotes.filter((q) => q.changePct === 0).length;
  const total = quotes.length || 1;

  // Gainers & Losers
  const sortedByPerf = [...quotes].sort((a, b) => b.changePct - a.changePct);
  const topGainers = sortedByPerf.slice(0, 4);
  const topLosers = sortedByPerf.slice(-4).reverse();

  return (
    <div className="space-y-6">
      {/* 1. Global Benchmark Indices Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {indices.map((idx) => {
          const isPos = idx.changePct >= 0;
          return (
            <div
              key={idx.symbol}
              className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-3 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">{idx.name}</span>
                <span>{idx.region}</span>
              </div>
              <div className="text-base font-bold text-slate-100 font-mono mt-1 tabular-nums">
                {idx.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div
                className={`text-xs font-mono font-medium mt-0.5 tabular-nums ${
                  isPos ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isPos ? '+' : ''}
                {idx.changePct.toFixed(2)}% ({isPos ? '+' : ''}
                {idx.change.toFixed(1)})
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Interactive Chart & Market Breadth Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Active Asset Chart View */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-slate-100">
                Active Asset Terminal
              </h2>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                {selectedSymbol === 'BTC' && (
                  <img
                    src="/src/assets/images/golden_bitcoin_logo_1791607960688.jpg"
                    alt="BTC"
                    className="w-4 h-4 rounded-full object-cover border border-amber-400/60 inline-block"
                    referrerPolicy="no-referrer"
                  />
                )}
                <span>{selectedSymbol} · 60-Day Daily Bars</span>
              </span>
            </div>
            {/* Quick asset pill tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {['BTC', 'NVDA', 'AAPL', 'MSFT', 'TSLA', 'SPY'].map((sym) => (
                <button
                  key={sym}
                  onClick={() => setSelectedSymbol(sym)}
                  className={`px-2.5 py-1 text-xs font-mono rounded transition-colors flex items-center gap-1 ${
                    selectedSymbol === sym
                      ? sym === 'BTC'
                        ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {sym === 'BTC' && (
                    <img
                      src="/src/assets/images/golden_bitcoin_logo_1791607960688.jpg"
                      alt="BTC"
                      className="w-3.5 h-3.5 rounded-full object-cover border border-amber-400/60"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <span>{sym}</span>
                </button>
              ))}
            </div>
          </div>

          <CandleChart
            symbol={selectedSymbol}
            bars={selectedBars}
            currencySymbol={meta.symbol}
          />
        </div>

        {/* Market Breadth & Sentiment Panel */}
        <div className="space-y-4">
          <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-4">
            <h3 className="text-xs font-semibold text-slate-300 tracking-wider uppercase mb-3">
              Market Breadth & Participation
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300 font-mono">
                <span className="text-emerald-400">
                  Advancers: {advancers} ({Math.round((advancers / total) * 100)}%)
                </span>
                <span className="text-rose-400">
                  Decliners: {decliners} ({Math.round((decliners / total) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#060b18] rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${(advancers / total) * 100}%` }}
                  className="bg-emerald-500 h-full"
                />
                <div
                  style={{ width: `${(unchanged / total) * 100}%` }}
                  className="bg-slate-600 h-full"
                />
                <div
                  style={{ width: `${(decliners / total) * 100}%` }}
                  className="bg-rose-500 h-full"
                />
              </div>
              <div className="text-[11px] text-slate-400 text-center pt-1">
                Net Market Bias:{' '}
                <span
                  className={
                    advancers > decliners
                      ? 'text-emerald-400 font-semibold'
                      : 'text-rose-400 font-semibold'
                  }
                >
                  {advancers > decliners
                    ? 'Positive Inflow (Bullish Breadth)'
                    : 'Distribution Pressure (Defensive)'}
                </span>
              </div>
            </div>
          </div>

          {/* Top Gainers & Decliners Lists */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-3">
              <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                Top Gainers
              </div>
              <div className="space-y-1.5">
                {topGainers.map((g) => (
                  <button
                    key={g.symbol}
                    onClick={() => setSelectedSymbol(g.symbol)}
                    className="w-full flex items-center justify-between text-xs hover:bg-[#13223f] p-1 rounded transition-colors text-left"
                  >
                    <span className="font-semibold text-slate-200">{g.symbol}</span>
                    <span className="text-emerald-400 font-mono tabular-nums font-medium">
                      +{g.changePct.toFixed(2)}%
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-3">
              <div className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider mb-2">
                Top Decliners
              </div>
              <div className="space-y-1.5">
                {topLosers.map((l) => (
                  <button
                    key={l.symbol}
                    onClick={() => setSelectedSymbol(l.symbol)}
                    className="w-full flex items-center justify-between text-xs hover:bg-[#13223f] p-1 rounded transition-colors text-left"
                  >
                    <span className="font-semibold text-slate-200">{l.symbol}</span>
                    <span className="text-rose-400 font-mono tabular-nums font-medium">
                      {l.changePct.toFixed(2)}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Catalyst News Stream */}
      <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-4">
        <h3 className="text-xs font-semibold text-slate-300 tracking-wider uppercase mb-3">
          Institutional Catalyst & Market Developments
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              cat: 'MACRO',
              title: 'U.S. Non-Farm Payrolls Exceed Expectations',
              src: 'BLS / Dow Jones',
              time: '18m ago',
              text: 'Labor resilience stabilizes treasury yields around 4.02%, moderating rate cut trajectory.',
            },
            {
              cat: 'CRYPTO',
              title: 'Global Spot Bitcoin ETFs Absorb $1.2B Weekly',
              src: 'CoinDesk Institutional',
              time: '45m ago',
              text: 'Liquid exchange reserves fall to multi-year lows as custodian inflows intensify.',
            },
            {
              cat: 'TECH',
              title: 'Semiconductor Capacity Expands on Packaging Yields',
              src: 'TrendForce Research',
              time: '2h ago',
              text: 'High-bandwidth memory supply bottlenecks loosen ahead of enterprise datacenter rollouts.',
            },
            {
              cat: 'POLICY',
              title: 'Central Bank Liquidity Operations Maintain Buffer',
              src: 'Federal Reserve Desk',
              time: '4h ago',
              text: 'Reverse repo facility balances demonstrate steady collateral absorption without spikes.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#070e1f] border border-[#1e293b]/70 rounded p-3 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="text-emerald-400 font-semibold">{item.cat}</span>
                <span>{item.time}</span>
              </div>
              <div className="font-semibold text-slate-200 line-clamp-1">
                {item.title}
              </div>
              <div className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                {item.text}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Source: {item.src}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
