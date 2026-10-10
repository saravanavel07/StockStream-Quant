import React, { useState } from 'react';
import { MarketBar, ForecastResult } from '../types/market';

interface CandleChartProps {
  symbol: string;
  bars: MarketBar[];
  currencySymbol?: string;
  forecast?: ForecastResult | null;
}

export const CandleChart: React.FC<CandleChartProps> = ({
  symbol,
  bars,
  currencySymbol = '$',
  forecast,
}) => {
  const [chartType, setChartType] = useState<'candle' | 'line'>('candle');
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const [hoverBar, setHoverBar] = useState<MarketBar | null>(null);

  if (!bars || bars.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-slate-500 font-mono text-xs">
        No bar data available
      </div>
    );
  }

  // Dimensions
  const width = 800;
  const height = 360;
  const padding = { top: 20, right: 60, bottom: 40, left: 20 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Price range
  const allHighs = bars.map((b) => b.high);
  const allLows = bars.map((b) => b.low);
  const minPrice = Math.min(...allLows) * 0.995;
  const maxPrice = Math.max(...allHighs) * 1.005;
  const priceRange = maxPrice - minPrice || 1;

  // Volume range
  const maxVolume = Math.max(...bars.map((b) => b.volume)) || 1;
  const volumeHeight = 60;

  // Coordinates
  const getX = (index: number) =>
    padding.left + (index / (bars.length - 1 || 1)) * chartWidth;
  const getY = (val: number) =>
    padding.top + (1 - (val - minPrice) / priceRange) * (chartHeight - volumeHeight);
  const getVolY = (vol: number) =>
    height - padding.bottom - (vol / maxVolume) * volumeHeight;

  // SMA(20) calculation for overlay
  const sma20 = bars.map((_, i) => {
    if (i < 19) return null;
    const slice = bars.slice(i - 19, i + 1);
    return slice.reduce((acc, curr) => acc + curr.close, 0) / 20;
  });

  // Line path generator
  const linePoints = bars
    .map((b, i) => `${getX(i).toFixed(1)},${getY(b.close).toFixed(1)}`)
    .join(' ');

  const activeBar = hoverBar || bars[bars.length - 1];

  return (
    <div className="w-full bg-[#0b1528] border border-[#1e293b] rounded-lg p-4">
      {/* Chart toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#1e293b]/70 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-100 text-sm">{symbol}</span>
          <span className="text-slate-400 font-mono text-[11px]">
            {activeBar.timestamp}
          </span>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-slate-400">O:</span>
            <span className="text-slate-200">
              {currencySymbol}
              {activeBar.open.toFixed(2)}
            </span>
            <span className="text-slate-400">H:</span>
            <span className="text-slate-200">
              {currencySymbol}
              {activeBar.high.toFixed(2)}
            </span>
            <span className="text-slate-400">L:</span>
            <span className="text-slate-200">
              {currencySymbol}
              {activeBar.low.toFixed(2)}
            </span>
            <span className="text-slate-400">C:</span>
            <span
              className={
                activeBar.close >= activeBar.open
                  ? 'text-emerald-400 font-semibold'
                  : 'text-rose-400 font-semibold'
              }
            >
              {currencySymbol}
              {activeBar.close.toFixed(2)}
            </span>
          </div>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#070e1f] rounded border border-[#1e293b] p-0.5">
            <button
              onClick={() => setChartType('candle')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                chartType === 'candle'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Candles
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                chartType === 'line'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Line
            </button>
          </div>

          <button
            onClick={() => setShowOverlay(!showOverlay)}
            className={`px-2 py-1 rounded text-[11px] border font-mono transition-colors ${
              showOverlay
                ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                : 'border-[#1e293b] text-slate-400 hover:text-slate-200'
            }`}
          >
            SMA(20)
          </button>
          <button
            onClick={() => setShowVolume(!showVolume)}
            className={`px-2 py-1 rounded text-[11px] border font-mono transition-colors ${
              showVolume
                ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                : 'border-[#1e293b] text-slate-400 hover:text-slate-200'
            }`}
          >
            Vol
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full mt-2 overflow-x-auto select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[600px] overflow-visible"
        >
          {/* Horizontal Price Gridlines */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
            const p = minPrice + (1 - frac) * priceRange;
            const y =
              padding.top + frac * (chartHeight - volumeHeight);
            return (
              <g key={idx}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                  strokeWidth="0.8"
                />
                <text
                  x={width - padding.right + 8}
                  y={y + 3}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {currencySymbol}
                  {p.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Volume sub-chart */}
          {showVolume &&
            bars.map((b, i) => {
              const x = getX(i);
              const y = getVolY(b.volume);
              const h = height - padding.bottom - y;
              const barW = Math.max(
                (chartWidth / bars.length) * 0.65,
                2
              );
              const isUp = b.close >= b.open;

              return (
                <rect
                  key={`vol-${i}`}
                  x={x - barW / 2}
                  y={y}
                  width={barW}
                  height={Math.max(h, 1)}
                  fill={isUp ? '#10b981' : '#f43f5e'}
                  opacity={0.35}
                />
              );
            })}

          {/* Candlesticks or Line */}
          {chartType === 'candle' ? (
            bars.map((b, i) => {
              const x = getX(i);
              const openY = getY(b.open);
              const closeY = getY(b.close);
              const highY = getY(b.high);
              const lowY = getY(b.low);
              const isUp = b.close >= b.open;
              const color = isUp ? '#10b981' : '#f43f5e';
              const topY = Math.min(openY, closeY);
              const barH = Math.max(Math.abs(closeY - openY), 1.5);
              const barW = Math.max(
                (chartWidth / bars.length) * 0.7,
                3
              );

              return (
                <g
                  key={`candle-${i}`}
                  onMouseEnter={() => setHoverBar(b)}
                  onMouseLeave={() => setHoverBar(null)}
                  className="cursor-crosshair"
                >
                  {/* High/Low wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={color}
                    strokeWidth="1.2"
                  />
                  {/* Open/Close body */}
                  <rect
                    x={x - barW / 2}
                    y={topY}
                    width={barW}
                    height={barH}
                    fill={color}
                    rx="1"
                  />
                </g>
              );
            })
          ) : (
            <path
              d={`M ${linePoints}`}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
            />
          )}

          {/* SMA(20) line */}
          {showOverlay && (
            <path
              d={sma20
                .map((val, i) =>
                  val !== null
                    ? `${i === 19 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(val).toFixed(1)}`
                    : ''
                )
                .join(' ')}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity={0.8}
            />
          )}

          {/* Forecast cone overlay if provided */}
          {forecast && (
            <g>
              {/* Projected path */}
              <line
                x1={getX(bars.length - 1)}
                y1={getY(bars[bars.length - 1].close)}
                x2={getX(bars.length - 1) + 50}
                y2={getY(forecast.projections['5D'].expectedPrice)}
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <circle
                cx={getX(bars.length - 1) + 50}
                cy={getY(forecast.projections['5D'].expectedPrice)}
                r="4"
                fill="#f59e0b"
              />
              {/* 80% Confidence Band Target */}
              <rect
                x={getX(bars.length - 1) + 46}
                y={getY(forecast.projections['5D'].confidence80.upper)}
                width="8"
                height={
                  getY(forecast.projections['5D'].confidence80.lower) -
                  getY(forecast.projections['5D'].confidence80.upper)
                }
                fill="#f59e0b"
                opacity="0.25"
                rx="2"
              />
            </g>
          )}

          {/* Time axis labels */}
          {[0, Math.floor(bars.length / 2), bars.length - 1].map((idx) => {
            if (!bars[idx]) return null;
            return (
              <text
                key={`lbl-${idx}`}
                x={getX(idx)}
                y={height - 12}
                fill="#64748b"
                fontSize="10"
                textAnchor="middle"
                fontFamily="JetBrains Mono, monospace"
              >
                {bars[idx].timestamp}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
