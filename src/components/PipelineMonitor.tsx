import React from 'react';

export const PipelineMonitor: React.FC = () => {
  const stages = [
    {
      num: '01',
      name: 'Data Sources',
      provider: 'yfinance / CCXT / EDGAR',
      latency: 118,
      status: 'NOMINAL',
      detail: 'Public quote feeds & 13F-HR filings',
    },
    {
      num: '02',
      name: 'Ingestion & Deduplication',
      provider: 'MarketDataIngestor',
      latency: 16,
      status: 'NOMINAL',
      detail: 'Timestamp ISO normalization & duplicate checks',
    },
    {
      num: '03',
      name: 'Geometric Validation',
      provider: 'MarketDataValidator',
      latency: 4,
      status: 'NOMINAL',
      detail: 'High >= max(O,C) & Low <= min(O,C) enforcement',
    },
    {
      num: '04',
      name: 'Tiered Cache & Persistence',
      provider: 'MemoryCache + SQLite',
      latency: 2,
      status: 'NOMINAL',
      detail: 'TTL 15s (Quotes), 300s (Hist), 24h (13F)',
    },
    {
      num: '05',
      name: 'Feature Engineering',
      provider: 'FeatureEngineer',
      latency: 14,
      status: 'NOMINAL',
      detail: 'Lags (t-1..3), RSI(14), MACD, Bollinger %B',
    },
    {
      num: '06',
      name: 'Forecasting & Uncertainty',
      provider: 'MarketForecaster (Ridge L2)',
      latency: 32,
      status: 'NOMINAL',
      detail: '80% & 95% Confidence Intervals & MAE metrics',
    },
    {
      num: '07',
      name: 'Risk Evaluation (VaR/CVaR)',
      provider: 'RiskEvaluator',
      latency: 6,
      status: 'NOMINAL',
      detail: 'Historical Value at Risk & Beta estimation',
    },
    {
      num: '08',
      name: 'Distribution & Alerts',
      provider: 'AlertService',
      latency: 3,
      status: 'NOMINAL',
      detail: 'Push event triggers to UI terminal',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. System Health Status Banner */}
      <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-100">
            Real-Time Market Data Pipeline Architecture & Health
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict unidirectional processing flow ensuring zero look-ahead bias and verified data provenance.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-bold">
            PIPELINE STATUS: 100% OPERATIONAL
          </span>
        </div>
      </div>

      {/* 2. Observable Flow Diagram Stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stg) => (
          <div
            key={stg.num}
            className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-3.5 space-y-2 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-slate-500 font-bold">{stg.num}</span>
              <span className="text-emerald-400 font-semibold text-[11px]">
                ● {stg.status}
              </span>
            </div>
            <div className="font-bold text-slate-200 text-sm">
              {stg.name}
            </div>
            <div className="text-[11px] text-slate-400">
              {stg.detail}
            </div>
            <div className="pt-2 border-t border-[#1e293b]/70 flex items-center justify-between font-mono text-[11px] text-slate-400">
              <span>{stg.provider}</span>
              <span className="text-slate-200 font-semibold">{stg.latency}ms</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Cache Metrics & Data Freshness State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tiered Cache Diagnostics */}
        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-4 space-y-3 font-mono text-xs">
          <h3 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
            Tiered Cache Performance
          </h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded bg-[#070e1f] border border-[#1e293b]/60">
              <div className="text-slate-400 text-[10px]">CACHE HITS</div>
              <div className="text-lg font-bold text-emerald-400 mt-1">1,482</div>
            </div>
            <div className="p-2.5 rounded bg-[#070e1f] border border-[#1e293b]/60">
              <div className="text-slate-400 text-[10px]">CACHE MISSES</div>
              <div className="text-lg font-bold text-slate-300 mt-1">68</div>
            </div>
            <div className="p-2.5 rounded bg-[#070e1f] border border-[#1e293b]/60">
              <div className="text-slate-400 text-[10px]">HIT RATIO</div>
              <div className="text-lg font-bold text-emerald-400 mt-1">95.6%</div>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 leading-relaxed font-sans pt-1">
            In-memory LRU prevents redundant network roundtrips to exchange orderbooks, ensuring low latency in high-frequency trading sessions.
          </div>
        </div>

        {/* Provenance & Freshness Tagging */}
        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-4 space-y-3 font-mono text-xs">
          <h3 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
            Data Freshness & Provenance Audit
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between p-2 rounded bg-[#070e1f] border border-[#1e293b]/60">
              <span className="text-slate-300">Cryptocurrency Feeds:</span>
              <span className="text-emerald-400 font-bold">
                LIVE_STREAM (&lt; 5s)
              </span>
            </div>
            <div className="flex justify-between p-2 rounded bg-[#070e1f] border border-[#1e293b]/60">
              <span className="text-slate-300">Equities Quotes:</span>
              <span className="text-amber-400 font-bold">
                DELAYED_15M (Cboe BZX)
              </span>
            </div>
            <div className="flex justify-between p-2 rounded bg-[#070e1f] border border-[#1e293b]/60">
              <span className="text-slate-300">SEC 13F Ownership:</span>
              <span className="text-slate-400 font-bold">
                QUARTERLY_STATUTORY
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
