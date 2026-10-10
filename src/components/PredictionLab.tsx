import React, { useState } from 'react';
import { MarketBar, ForecastResult } from '../types/market';
import { computeForecast, CURRENCY_MAP } from '../data/marketData';
import { CandleChart } from './CandleChart';

interface PredictionLabProps {
  selectedSymbol: string;
  setSelectedSymbol: (s: string) => void;
  bars: MarketBar[];
  currency: string;
}

export const PredictionLab: React.FC<PredictionLabProps> = ({
  selectedSymbol,
  setSelectedSymbol,
  bars,
  currency,
}) => {
  const meta = CURRENCY_MAP[currency] || CURRENCY_MAP.USD;
  const [selectedHorizon, setSelectedHorizon] = useState<'1D' | '5D' | '20D'>('5D');

  const forecast: ForecastResult = computeForecast(selectedSymbol, bars);
  const activeProj = forecast.projections[selectedHorizon];

  const formatPrice = (val: number) =>
    `${meta.symbol}${(val * meta.rate).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="space-y-6">
      {/* 1. Regulatory Audit Notice Banner */}
      <div className="bg-[#101b2f] border border-amber-500/40 rounded-lg p-3.5 text-xs flex items-start gap-3">
        <span className="text-amber-400 text-base font-bold shrink-0">⚠️</span>
        <div>
          <div className="text-amber-300 font-semibold uppercase tracking-wider text-[11px]">
            Experimental Quantitative Forecast — Not Financial Advice
          </div>
          <div className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
            All predictive paths, confidence intervals, and directional probabilities are generated via regularized multi-feature time-series regressors. Projections model statistical tendencies under historical distribution parameters and are subject to severe systemic drawdown risks.
          </div>
        </div>
      </div>

      {/* 2. Model Selection & Asset Toolbar */}
      <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <label className="text-slate-400 font-medium">Select Modeling Target:</label>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['BTC', 'NVDA', 'AAPL', 'MSFT', 'TSLA', 'SPY'].map((sym) => (
              <button
                key={sym}
                onClick={() => setSelectedSymbol(sym)}
                className={`px-3 py-1 font-mono rounded text-xs transition-colors ${
                  selectedSymbol === sym
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <span>Architecture:</span>
          <span className="text-slate-200 font-semibold">
            Ridge L2 + Drift
          </span>
          <span>·</span>
          <span>Sample Size:</span>
          <span className="text-slate-200 font-semibold">
            {forecast.metrics.sampleSize} Bars
          </span>
        </div>
      </div>

      {/* 3. Prediction Error & Performance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-3.5">
          <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
            Walk-Forward Hit Rate
          </div>
          <div className="text-xl font-bold text-emerald-400 tabular-nums">
            {forecast.metrics.directionalAccuracyPct}%
          </div>
          <div className="text-slate-400 text-[11px] mt-0.5">
            Directional Sign Accuracy
          </div>
        </div>

        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-3.5">
          <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
            Mean Absolute Error (MAE)
          </div>
          <div className="text-xl font-bold text-slate-100 tabular-nums">
            {forecast.metrics.mae}
          </div>
          <div className="text-slate-400 text-[11px] mt-0.5">
            Normalized Daily Return Delta
          </div>
        </div>

        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-3.5">
          <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
            Root Mean Squared Error
          </div>
          <div className="text-xl font-bold text-slate-100 tabular-nums">
            {forecast.metrics.rmse}
          </div>
          <div className="text-slate-400 text-[11px] mt-0.5">
            Outlier Penalized Dispersion
          </div>
        </div>

        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-3.5">
          <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
            Active Spot Price
          </div>
          <div className="text-xl font-bold text-slate-100 tabular-nums">
            {formatPrice(forecast.lastPrice)}
          </div>
          <div className="text-emerald-400 text-[11px] mt-0.5">
            Baseline Inception
          </div>
        </div>
      </div>

      {/* 4. Candlestick Chart with Projection Cone Overlay */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <h2 className="font-bold text-slate-200">
            {selectedSymbol} Predictive Cone Overlay
          </h2>
          <div className="flex items-center gap-1.5 bg-[#070e1f] p-0.5 rounded border border-[#1e293b]">
            {(['1D', '5D', '20D'] as const).map((hz) => (
              <button
                key={hz}
                onClick={() => setSelectedHorizon(hz)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
                  selectedHorizon === hz
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Horizon {hz}
              </button>
            ))}
          </div>
        </div>
        <CandleChart
          symbol={selectedSymbol}
          bars={bars}
          currencySymbol={meta.symbol}
          forecast={forecast}
        />
      </div>

      {/* 5. Horizon Breakdown Table & Factor Drivers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Horizon Confidence Intervals Table */}
        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-4 space-y-3">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Multi-Horizon Confidence Cones
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#070e1f] text-slate-400 border-b border-[#1e293b] text-[11px]">
                <tr>
                  <th className="py-2 px-3">Horizon</th>
                  <th className="py-2 px-3 text-right">Expected</th>
                  <th className="py-2 px-3 text-right">Delta (%)</th>
                  <th className="py-2 px-3 text-right">80% CI Band</th>
                  <th className="py-2 px-3 text-right">95% CI Band</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/50">
                {Object.entries(forecast.projections).map(([hz, p]) => (
                  <tr
                    key={hz}
                    className={
                      selectedHorizon === hz ? 'bg-amber-500/10' : 'hover:bg-[#111f38]/60'
                    }
                  >
                    <td className="py-2.5 px-3 font-bold text-amber-400">
                      T+{hz}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-100 font-bold tabular-nums">
                      {formatPrice(p.expectedPrice)}
                    </td>
                    <td
                      className={`py-2.5 px-3 text-right font-bold tabular-nums ${
                        p.expectedDeltaPct >= 0
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {p.expectedDeltaPct >= 0 ? '+' : ''}
                      {p.expectedDeltaPct}%
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-300 tabular-nums text-[11px]">
                      {formatPrice(p.confidence80.lower)} - {formatPrice(p.confidence80.upper)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400 tabular-nums text-[11px]">
                      {formatPrice(p.confidence95.lower)} - {formatPrice(p.confidence95.upper)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contributing Quantitative Factors */}
        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-4 space-y-3">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Key Factor Attribution Weights
          </h3>
          <div className="space-y-3">
            {forecast.keyDrivers.map((d, i) => {
              const isPos = d.impact >= 0;
              return (
                <div key={i} className="text-xs space-y-1">
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-300">{d.factor}</span>
                    <span
                      className={`font-bold tabular-nums ${
                        isPos ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isPos ? '+' : ''}
                      {d.impact.toFixed(3)}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#070e1f] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(Math.abs(d.impact) * 1200, 100)}%` }}
                      className={`h-full ${
                        isPos ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-[#1e293b]/70 font-mono">
            * Weights estimated via Ridge regularized ordinary least squares regression.
          </div>
        </div>
      </div>
    </div>
  );
};
