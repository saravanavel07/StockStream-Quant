import React, { useState } from 'react';
import { AlertRule, Quote } from '../types/market';
import { CURRENCY_MAP } from '../data/marketData';

interface AlertsCenterProps {
  alerts: AlertRule[];
  quotes: Quote[];
  currency: string;
  onAddAlert: (rule: Omit<AlertRule, 'id' | 'createdAt'>) => void;
  onToggleAlert: (id: string) => void;
  onDeleteAlert: (id: string) => void;
  onSimulateTrigger: () => void;
}

export const AlertsCenter: React.FC<AlertsCenterProps> = ({
  alerts,
  quotes,
  currency,
  onAddAlert,
  onToggleAlert,
  onDeleteAlert,
  onSimulateTrigger,
}) => {
  const meta = CURRENCY_MAP[currency] || CURRENCY_MAP.USD;

  const [symbol, setSymbol] = useState('BTC');
  const [conditionType, setConditionType] = useState<AlertRule['conditionType']>('PRICE_ABOVE');
  const [thresholdValue, setThresholdValue] = useState<number>(70000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAlert({
      symbol,
      conditionType,
      thresholdValue,
      isActive: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar with Test Trigger simulation */}
      <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-100">
            Real-Time Market & Volatility Alert Engine
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Event-driven threshold monitors inspecting tick updates and technical oscillators every 5 seconds.
          </p>
        </div>

        <button
          onClick={onSimulateTrigger}
          className="px-3.5 py-1.5 text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded hover:bg-amber-500/30 transition-colors"
        >
          ⚡ Simulate Market Alert Trigger
        </button>
      </div>

      {/* 2. Configure Rule Form & Active Alerts Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* New Rule Builder */}
        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-4 space-y-4">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider pb-2 border-b border-[#1e293b]">
            Configure Trigger Condition
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Asset Symbol</label>
              <select
                value={symbol}
                onChange={(e) => {
                  setSymbol(e.target.value);
                  const q = quotes.find((x) => x.symbol === e.target.value);
                  if (q) setThresholdValue(Math.round(q.price * 1.05));
                }}
                className="w-full bg-[#070e1f] border border-[#1e293b] rounded p-2 text-slate-200 font-mono"
              >
                {quotes.map((q) => (
                  <option key={q.symbol} value={q.symbol}>
                    {q.symbol} ({q.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Trigger Condition</label>
              <select
                value={conditionType}
                onChange={(e) => setConditionType(e.target.value as AlertRule['conditionType'])}
                className="w-full bg-[#070e1f] border border-[#1e293b] rounded p-2 text-slate-200 font-mono"
              >
                <option value="PRICE_ABOVE">Price Above (&ge; Target)</option>
                <option value="PRICE_BELOW">Price Below (&le; Support)</option>
                <option value="RSI_OVERBOUGHT">RSI Overbought (&ge; 70)</option>
                <option value="RSI_OVERSOLD">RSI Oversold (&le; 30)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">
                Threshold Numerical Value
              </label>
              <input
                type="number"
                step="any"
                value={thresholdValue}
                onChange={(e) => setThresholdValue(Number(e.target.value))}
                className="w-full bg-[#070e1f] border border-[#1e293b] rounded p-2 text-slate-100 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold rounded transition-colors"
            >
              Arm Alert Rule
            </button>
          </form>
        </div>

        {/* Active Rules List */}
        <div className="lg:col-span-2 bg-[#0b1528] border border-[#1e293b] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1e293b] flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
              Active Rule Monitors ({alerts.length})
            </span>
          </div>

          {alerts.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 font-mono">
              No alert monitors configured. Create a condition on the left.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#070e1f] text-slate-400 border-b border-[#1e293b] text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Symbol</th>
                    <th className="py-2.5 px-3">Condition</th>
                    <th className="py-2.5 px-3 text-right">Threshold</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]/50">
                  {alerts.map((al) => (
                    <tr key={al.id} className="hover:bg-[#111f38]/50">
                      <td className="py-2.5 px-3 font-bold text-slate-100">
                        {al.symbol}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">
                        {al.conditionType.replace(/_/g, ' ')}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-100 font-bold tabular-nums">
                        {al.conditionType.includes('PRICE')
                          ? `${meta.symbol}${al.thresholdValue.toLocaleString()}`
                          : al.thresholdValue}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`text-[11px] font-semibold ${
                            al.isActive ? 'text-emerald-400' : 'text-slate-500'
                          }`}
                        >
                          {al.isActive ? '● ACTIVE' : '○ MUTED'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right space-x-2">
                        <button
                          onClick={() => onToggleAlert(al.id)}
                          className="text-[11px] text-slate-400 hover:text-slate-200"
                        >
                          {al.isActive ? 'Mute' : 'Enable'}
                        </button>
                        <button
                          onClick={() => onDeleteAlert(al.id)}
                          className="text-[11px] text-rose-400 hover:text-rose-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
