import React, { useState } from 'react';
import { Quote } from '../types/market';
import { CURRENCY_MAP } from '../data/marketData';

interface StockScreenerProps {
  quotes: Quote[];
  currency: string;
  onSelectQuote: (sym: string) => void;
}

export const StockScreener: React.FC<StockScreenerProps> = ({
  quotes,
  currency,
  onSelectQuote,
}) => {
  const meta = CURRENCY_MAP[currency] || CURRENCY_MAP.USD;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [maxPe, setMaxPe] = useState<number>(80);
  const [selectedSignal, setSelectedSignal] = useState('All');

  const sectors = ['All', ...new Set(quotes.map((q) => q.sector))];
  const signals = [
    'All',
    'BULLISH_MOMENTUM',
    'BULLISH_SETUP',
    'CONSOLIDATION_WATCH',
    'NEUTRAL',
    'BEARISH_PRESSURE',
  ];

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      q.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector =
      selectedSector === 'All' || q.sector === selectedSector;
    const matchesPe = !q.peRatio || q.peRatio <= maxPe;
    const matchesSignal =
      selectedSignal === 'All' || q.signal === selectedSignal;
    return matchesSearch && matchesSector && matchesPe && matchesSignal;
  });

  return (
    <div className="space-y-4">
      {/* Filters Toolbar */}
      <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Search Term */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">
              Search Symbol or Company
            </label>
            <input
              type="text"
              placeholder="e.g. NVDA, Apple, BTC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#070e1f] border border-[#1e293b] rounded px-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          {/* Sector Selector */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">
              Sector / Industry
            </label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full bg-[#070e1f] border border-[#1e293b] rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            >
              {sectors.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Max P/E Multiple Slider */}
          <div>
            <div className="flex justify-between text-slate-400 mb-1 font-medium">
              <span>Max P/E Multiple</span>
              <span className="font-mono text-slate-200">{maxPe}x</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={maxPe}
              onChange={(e) => setMaxPe(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Signal Filter */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">
              Technical Setup Signal
            </label>
            <select
              value={selectedSignal}
              onChange={(e) => setSelectedSignal(e.target.value)}
              className="w-full bg-[#070e1f] border border-[#1e293b] rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            >
              {signals.map((sig) => (
                <option key={sig} value={sig}>
                  {sig}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Screened Equities Table */}
      <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1e293b] flex items-center justify-between text-xs">
          <span className="text-slate-300 font-medium">
            Qualified Assets:{' '}
            <strong className="text-emerald-400 font-mono font-bold">
              {filteredQuotes.length}
            </strong>{' '}
            of {quotes.length}
          </span>
          <span className="text-slate-500 font-mono text-[11px]">
            Click row to load into Terminal
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#070e1f] text-slate-400 border-b border-[#1e293b] select-none text-[11px]">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Symbol</th>
                <th className="px-4 py-2.5 font-semibold">Company / Asset</th>
                <th className="px-4 py-2.5 font-semibold">Sector</th>
                <th className="px-4 py-2.5 text-right font-semibold">Price</th>
                <th className="px-4 py-2.5 text-right font-semibold">24h Chg</th>
                <th className="px-4 py-2.5 text-right font-semibold">P/E</th>
                <th className="px-4 py-2.5 text-right font-semibold">RSI(14)</th>
                <th className="px-4 py-2.5 text-right font-semibold">Cap</th>
                <th className="px-4 py-2.5 font-semibold">Signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/60">
              {filteredQuotes.map((q) => {
                const isPos = q.changePct >= 0;
                const convertedPrice = (q.price * meta.rate).toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: q.price > 100 ? 2 : 3,
                    maximumFractionDigits: q.price > 100 ? 2 : 3,
                  }
                );

                return (
                  <tr
                    key={q.symbol}
                    onClick={() => onSelectQuote(q.symbol)}
                    className="hover:bg-[#111f38] transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-2.5 font-bold text-slate-100 group-hover:text-emerald-400">
                      {q.symbol}
                    </td>
                    <td className="px-4 py-2.5 text-slate-300 font-sans">
                      {q.name}
                    </td>
                    <td className="px-4 py-2.5 text-slate-400 font-sans">
                      {q.sector}
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-slate-100 tabular-nums">
                      {meta.symbol}
                      {convertedPrice}
                    </td>
                    <td
                      className={`px-4 py-2.5 text-right font-bold tabular-nums ${
                        isPos ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isPos ? '+' : ''}
                      {q.changePct.toFixed(2)}%
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-400 tabular-nums">
                      {q.peRatio ? `${q.peRatio.toFixed(1)}x` : '—'}
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-300 tabular-nums">
                      {q.rsi ? q.rsi.toFixed(1) : '—'}
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-400 tabular-nums">
                      {q.marketCap}
                    </td>
                    <td className="px-4 py-2.5 font-sans">
                      <span
                        className={`text-[11px] font-medium ${
                          q.signal?.includes('BULLISH')
                            ? 'text-emerald-400'
                            : q.signal?.includes('BEARISH')
                            ? 'text-rose-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {q.signal?.replace(/_/g, ' ') || 'NEUTRAL'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
