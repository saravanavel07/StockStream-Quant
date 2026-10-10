import React from 'react';
import { Quote } from '../types/market';
import { CURRENCY_MAP } from '../data/marketData';

interface TickerTapeProps {
  quotes: Quote[];
  currency: string;
  onSelectQuote: (sym: string) => void;
}

export const TickerTape: React.FC<TickerTapeProps> = ({
  quotes,
  currency,
  onSelectQuote,
}) => {
  const meta = CURRENCY_MAP[currency] || CURRENCY_MAP.USD;

  return (
    <div className="w-full bg-[#070e1f] border-b border-[#1e293b]/80 overflow-hidden py-1.5 px-4 text-xs font-mono select-none">
      <div className="flex items-center gap-8 animate-none overflow-x-auto no-scrollbar">
        <span className="text-[11px] text-slate-400 font-semibold tracking-wider shrink-0 uppercase">
          Tape
        </span>
        <div className="flex items-center gap-7">
          {quotes.map((q) => {
            const isPos = q.changePct >= 0;
            const converted = (q.price * meta.rate).toLocaleString(undefined, {
              minimumFractionDigits: q.price > 100 ? 2 : 3,
              maximumFractionDigits: q.price > 100 ? 2 : 3,
            });

            return (
              <button
                key={q.symbol}
                onClick={() => onSelectQuote(q.symbol)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0 group text-left cursor-pointer"
              >
                {q.symbol === 'BTC' && (
                  <img
                    src="/src/assets/images/golden_bitcoin_logo_1791607960688.jpg"
                    alt="BTC"
                    className="w-3.5 h-3.5 rounded-full object-cover border border-amber-400/60"
                    referrerPolicy="no-referrer"
                  />
                )}
                <span className="font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">
                  {q.symbol}
                </span>
                <span className="text-slate-100 tabular-nums">
                  {meta.symbol}
                  {converted}
                </span>
                <span
                  className={`tabular-nums ${
                    isPos ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPos ? '+' : ''}
                  {q.changePct.toFixed(2)}%
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
