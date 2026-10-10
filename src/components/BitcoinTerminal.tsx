import React from 'react';
import { BitcoinMetrics, MarketBar } from '../types/market';
import { CURRENCY_MAP } from '../data/marketData';
import { CandleChart } from './CandleChart';

interface BitcoinTerminalProps {
  btcMetrics: BitcoinMetrics;
  currency: string;
  btcBars: MarketBar[];
}

export const BitcoinTerminal: React.FC<BitcoinTerminalProps> = ({
  btcMetrics,
  currency,
  btcBars,
}) => {
  const meta = CURRENCY_MAP[currency] || CURRENCY_MAP.USD;
  const convertedPrice = (btcMetrics.priceUsd * meta.rate).toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );

  return (
    <div className="space-y-6">
      {/* 1. Signature Gold Bitcoin Command Banner with subtle floating gold particles */}
      <div className="relative overflow-hidden rounded-xl border border-amber-500/40 bg-gradient-to-r from-[#091322] via-[#121929] to-[#0c1626] p-6 shadow-lg shadow-amber-950/20">
        {/* Subtle decorative gold particles */}
        <div className="absolute top-2 right-12 w-2 h-2 rounded-full bg-amber-400/40 blur-[1px] animate-float" />
        <div
          className="absolute bottom-3 right-36 w-1.5 h-1.5 rounded-full bg-yellow-300/30 blur-[1px] animate-float"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute top-8 right-60 w-1 h-1 rounded-full bg-amber-300/50 animate-float"
          style={{ animationDelay: '4s' }}
        />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          {/* Logo & Headline */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400/80 shadow-xl shadow-amber-500/40 shrink-0 bg-[#060b18] group">
              <img
                src="/src/assets/images/golden_bitcoin_logo_1791607960688.jpg"
                alt="Golden Bitcoin Logo surrounded by shining stars"
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  BITCOIN COMMAND CENTER
                </h1>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  BTC / {currency}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Decentralized Sovereign Reserve Asset · Continuous 24/7 Global Orderbooks
              </p>
            </div>
          </div>

          {/* Price & 24h Delta */}
          <div className="text-right">
            <div className="text-3xl font-extrabold font-mono text-white tracking-tight tabular-nums">
              {meta.symbol}
              {convertedPrice}
            </div>
            <div className="flex items-center justify-end gap-3 text-xs mt-1 font-mono">
              <span
                className={`font-semibold tabular-nums ${
                  btcMetrics.change24hPct >= 0
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}
              >
                {btcMetrics.change24hPct >= 0 ? '▲ +' : '▼ '}
                {btcMetrics.change24hPct}% (24h)
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-300">
                24h Volume: {btcMetrics.volume24hUsd}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Institutional Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-3.5">
          <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
            Market Capitalization
          </div>
          <div className="text-lg font-bold text-slate-100 tabular-nums">
            {btcMetrics.marketCapUsd}
          </div>
          <div className="text-emerald-400 text-[11px] mt-0.5">
            Macro Asset Rank #1
          </div>
        </div>

        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-3.5">
          <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
            Bitcoin Dominance (BTC.D)
          </div>
          <div className="text-lg font-bold text-amber-400 tabular-nums">
            {btcMetrics.btcDominancePct}%
          </div>
          <div className="text-slate-400 text-[11px] mt-0.5">
            Of Total Crypto Market Cap
          </div>
        </div>

        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-3.5">
          <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
            Fear & Greed Index
          </div>
          <div className="text-lg font-bold text-emerald-400 tabular-nums">
            {btcMetrics.fearGreedIndex} / 100
          </div>
          <div className="text-emerald-400 text-[11px] mt-0.5">
            Sentiment: {btcMetrics.fearGreedLabel}
          </div>
        </div>

        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-3.5">
          <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
            Network Hashrate
          </div>
          <div className="text-lg font-bold text-slate-100 tabular-nums">
            {btcMetrics.hashRateEhs} EH/s
          </div>
          <div className="text-slate-400 text-[11px] mt-0.5">
            All-Time Security Peak
          </div>
        </div>
      </div>

      {/* 3. Bitcoin Candlestick Chart */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <h2 className="font-bold text-slate-200">
            BTC Institutional Price Action & Volatility Bands
          </h2>
          <span className="text-slate-400 font-mono">
            {btcMetrics.nextHalvingEst}
          </span>
        </div>
        <CandleChart
          symbol="BTC"
          bars={btcBars}
          currencySymbol={meta.symbol}
        />
      </div>

      {/* 4. Multi-Exchange Orderbook Spreads & Liquidity Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Cross-Exchange Spreads & Liquidity Depth
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono">
              ● Live Feeds Synchronized
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#070e1f] text-slate-400 border-b border-[#1e293b] text-[11px]">
                <tr>
                  <th className="py-2 px-3">Exchange</th>
                  <th className="py-2 px-3 text-right">Bid</th>
                  <th className="py-2 px-3 text-right">Ask</th>
                  <th className="py-2 px-3 text-right">Spread ($)</th>
                  <th className="py-2 px-3 text-right">Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/50">
                {btcMetrics.exchangeSpreads.map((ex) => (
                  <tr key={ex.exchange} className="hover:bg-[#111f38]/60">
                    <td className="py-2.5 px-3 font-semibold text-slate-200">
                      {ex.exchange}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-300 tabular-nums">
                      ${ex.bid.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-300 tabular-nums">
                      ${ex.ask.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 tabular-nums font-semibold">
                      ${ex.spreadUsd.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400 tabular-nums">
                      {ex.volumeShare}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Downside Liquidity Retest Scenarios */}
        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Quantitative Downside Retest Scenarios
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Risk Invalidation Levels
            </span>
          </div>

          <div className="space-y-2.5">
            {btcMetrics.downsideScenarios.map((sc, i) => (
              <div
                key={i}
                className="bg-[#070e1f] border border-[#1e293b]/70 rounded p-3 text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-mono">
                  <span className="font-semibold text-slate-200">
                    {sc.scenario}
                  </span>
                  <span className="text-rose-400 font-bold tabular-nums">
                    ${sc.level.toLocaleString()} ({sc.dropPct}%)
                  </span>
                </div>
                <div className="text-slate-400 text-[11px]">{sc.riskType}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
