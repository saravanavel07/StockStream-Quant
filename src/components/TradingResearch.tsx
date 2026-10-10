import React, { useState } from 'react';
import { Quote, PaperPosition } from '../types/market';
import { CURRENCY_MAP } from '../data/marketData';

interface TradingResearchProps {
  quotes: Quote[];
  positions: PaperPosition[];
  currency: string;
}

export const TradingResearch: React.FC<TradingResearchProps> = ({
  quotes,
  positions,
  currency,
}) => {
  const meta = CURRENCY_MAP[currency] || CURRENCY_MAP.USD;
  const [selectedSymbol, setSelectedSymbol] = useState<string>('NVDA');

  const equity = quotes.find((q) => q.symbol === selectedSymbol) || quotes[0];
  const price = equity.price;
  const support = equity.support || price * 0.95;
  const resistance = equity.resistance || price * 1.05;

  const stopLoss = Number((support * 0.985).toFixed(2));
  const risk = Math.max(price - stopLoss, 0.01);
  const reward = Math.max(resistance - price, 0.01);
  const rrRatio = Number((reward / risk).toFixed(2));

  // Portfolio concentration warning
  const totalSharesVal = positions.reduce(
    (acc, p) => acc + p.shares * p.currentPrice,
    0
  );
  const currentPos = positions.find((p) => p.symbol === selectedSymbol);
  const posVal = currentPos ? currentPos.shares * currentPos.currentPrice : 0;
  const concentrationPct = totalSharesVal > 0 ? (posVal / totalSharesVal) * 100 : 0;

  const formatPrice = (val: number) =>
    `${meta.symbol}${(val * meta.rate).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="space-y-6">
      {/* 1. Research Disclaimer & Asset Picker */}
      <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-100">
            Algorithmic Trade Research & Risk/Reward Invalidation Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Deterministic technical structure modeling. All levels represent analytical research scenarios, not automated execution instructions.
          </p>
        </div>

        {/* Asset selector */}
        <div className="flex items-center gap-1.5 bg-[#070e1f] p-1 rounded border border-[#1e293b] text-xs font-mono">
          {quotes.slice(0, 6).map((q) => (
            <button
              key={q.symbol}
              onClick={() => setSelectedSymbol(q.symbol)}
              className={`px-3 py-1 rounded transition-colors ${
                selectedSymbol === q.symbol
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {q.symbol}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Portfolio Concentration Alert if > 25% */}
      {concentrationPct > 25 && (
        <div className="bg-amber-950/30 border border-amber-500/50 rounded-lg p-3 text-xs text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>
              <strong>Portfolio Concentration Warning:</strong> {selectedSymbol} represents{' '}
              {concentrationPct.toFixed(1)}% of your active invested capital.
            </span>
          </div>
          <span className="font-mono text-[11px] text-amber-400">
            Recommended cap: &le; 20%
          </span>
        </div>
      )}

      {/* 3. Setup Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-3.5">
          <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
            Current Price
          </div>
          <div className="text-xl font-bold text-slate-100 tabular-nums">
            {formatPrice(price)}
          </div>
          <div className="text-slate-400 text-[11px] mt-0.5">
            24h Delta: {equity.changePct.toFixed(2)}%
          </div>
        </div>

        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-3.5">
          <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
            Risk / Reward Ratio
          </div>
          <div className="text-xl font-bold text-emerald-400 tabular-nums">
            1 : {rrRatio}
          </div>
          <div className="text-emerald-400 text-[11px] mt-0.5">
            {rrRatio >= 2.0 ? 'High Asymmetry' : rrRatio >= 1.2 ? 'Moderate' : 'Low Profile'}
          </div>
        </div>

        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-3.5">
          <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
            Invalidation Stop-Loss
          </div>
          <div className="text-xl font-bold text-rose-400 tabular-nums">
            {formatPrice(stopLoss)}
          </div>
          <div className="text-slate-400 text-[11px] mt-0.5">
            -{(Math.abs((stopLoss - price) / price) * 100).toFixed(2)}% Risk Floor
          </div>
        </div>

        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-3.5">
          <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
            Target Resistance
          </div>
          <div className="text-xl font-bold text-amber-400 tabular-nums">
            {formatPrice(resistance)}
          </div>
          <div className="text-slate-400 text-[11px] mt-0.5">
            +{(Math.abs((resistance - price) / price) * 100).toFixed(2)}% Upside Ceiling
          </div>
        </div>
      </div>

      {/* 4. Detailed Technical Blueprint */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-4 space-y-3 text-xs">
          <h3 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
            Quantitative Execution Blueprint
          </h3>
          <div className="space-y-2.5 font-mono">
            <div className="flex justify-between p-2 rounded bg-[#070e1f] border border-[#1e293b]/60">
              <span className="text-slate-400">Potential Entry Zone:</span>
              <span className="text-emerald-300 font-bold">
                {formatPrice(support * 1.005)} — {formatPrice(support * 1.025)}
              </span>
            </div>
            <div className="flex justify-between p-2 rounded bg-[#070e1f] border border-[#1e293b]/60">
              <span className="text-slate-400">Risk per Share:</span>
              <span className="text-rose-400 font-bold">
                {formatPrice(risk)}
              </span>
            </div>
            <div className="flex justify-between p-2 rounded bg-[#070e1f] border border-[#1e293b]/60">
              <span className="text-slate-400">Reward per Share:</span>
              <span className="text-emerald-400 font-bold">
                {formatPrice(reward)}
              </span>
            </div>
            <div className="flex justify-between p-2 rounded bg-[#070e1f] border border-[#1e293b]/60">
              <span className="text-slate-400">RSI(14) Momentum:</span>
              <span className="text-slate-200 font-bold">
                {equity.rsi || 50.0} (
                {(equity.rsi || 50) > 70
                  ? 'Overbought'
                  : (equity.rsi || 50) < 30
                  ? 'Oversold'
                  : 'Neutral Oscillator'}
                )
              </span>
            </div>
          </div>
        </div>

        {/* Explainable Analytical Thesis */}
        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-4 space-y-3 text-xs">
          <h3 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
            Explainable Analytical Hypothesis
          </h3>
          <div className="space-y-2 text-slate-300 leading-relaxed font-sans text-xs">
            <p>
              • <strong>Trend Regime:</strong> {equity.signal?.replace(/_/g, ' ') || 'NEUTRAL'}. The price is consolidating above primary horizontal support at {formatPrice(support)}.
            </p>
            <p>
              • <strong>Invalidation Rule:</strong> A daily candle close below {formatPrice(stopLoss)} violates local market structure, invalidating bullish continuation and requiring immediate capital protection.
            </p>
            <p>
              • <strong>Liquidity Context:</strong> Volume expansion on advances indicates accumulation by institutional participants, while pullbacks demonstrate declining sell-side volume.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
