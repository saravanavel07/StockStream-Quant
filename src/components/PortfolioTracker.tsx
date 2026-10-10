import React, { useState } from 'react';
import { PaperPosition, TradeOrder, Quote } from '../types/market';
import { CURRENCY_MAP } from '../data/marketData';

interface PortfolioTrackerProps {
  positions: PaperPosition[];
  cashBalance: number;
  tradeLog: TradeOrder[];
  quotes: Quote[];
  currency: string;
  onExecuteTrade: (symbol: string, side: 'BUY' | 'SELL', shares: number) => void;
  onResetPortfolio: () => void;
}

export const PortfolioTracker: React.FC<PortfolioTrackerProps> = ({
  positions,
  cashBalance,
  tradeLog,
  quotes,
  currency,
  onExecuteTrade,
  onResetPortfolio,
}) => {
  const meta = CURRENCY_MAP[currency] || CURRENCY_MAP.USD;

  const [tradeSymbol, setTradeSymbol] = useState<string>('NVDA');
  const [tradeSide, setTradeSide] = useState<'BUY' | 'SELL'>('BUY');
  const [sharesInput, setSharesInput] = useState<number>(10);

  const selectedQuote = quotes.find((q) => q.symbol === tradeSymbol) || quotes[0];
  const estPrice = selectedQuote.price;
  const grossTotal = sharesInput * estPrice;
  const estimatedFee = grossTotal * 0.0007; // 7 bps total friction (5 bps fee + 2 bps slippage)
  const netOrderTotal = tradeSide === 'BUY' ? grossTotal + estimatedFee : grossTotal - estimatedFee;

  // Portfolio total valuation
  const investedValue = positions.reduce((acc, p) => acc + p.shares * p.currentPrice, 0);
  const totalEquity = cashBalance + investedValue;
  const totalUnrealizedPnl = positions.reduce((acc, p) => acc + p.unrealizedPnl, 0);

  const handleTradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sharesInput <= 0) return;
    onExecuteTrade(tradeSymbol, tradeSide, sharesInput);
  };

  const formatMoney = (val: number) =>
    `${meta.symbol}${(val * meta.rate).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="space-y-6">
      {/* 1. Portfolio Header KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-3.5">
          <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
            Total Net Liquidation Value
          </div>
          <div className="text-xl font-bold text-slate-100 tabular-nums">
            {formatMoney(totalEquity)}
          </div>
          <div className="text-slate-400 text-[11px] mt-0.5">
            Initial Capital: {formatMoney(100000)}
          </div>
        </div>

        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-3.5">
          <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
            Available Cash Reserve
          </div>
          <div className="text-xl font-bold text-emerald-400 tabular-nums">
            {formatMoney(cashBalance)}
          </div>
          <div className="text-slate-400 text-[11px] mt-0.5">
            Purchasing Power
          </div>
        </div>

        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-3.5">
          <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
            Invested Market Assets
          </div>
          <div className="text-xl font-bold text-slate-100 tabular-nums">
            {formatMoney(investedValue)}
          </div>
          <div className="text-slate-400 text-[11px] mt-0.5">
            Across {positions.length} Active Positions
          </div>
        </div>

        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-3.5">
          <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
            Unrealized Total P&L
          </div>
          <div
            className={`text-xl font-bold tabular-nums ${
              totalUnrealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {totalUnrealizedPnl >= 0 ? '+' : ''}
            {formatMoney(totalUnrealizedPnl)}
          </div>
          <div className="text-slate-400 text-[11px] mt-0.5">
            Mark to Market
          </div>
        </div>
      </div>

      {/* 2. Order Entry & Position List Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Paper Trade Execution Ticket */}
        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Paper Order Ticket
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono">
              Simulated 7 bps Friction
            </span>
          </div>

          <form onSubmit={handleTradeSubmit} className="space-y-3 text-xs">
            {/* Side selection */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTradeSide('BUY')}
                className={`py-2 rounded font-semibold transition-colors ${
                  tradeSide === 'BUY'
                    ? 'bg-emerald-500 text-slate-900 shadow-sm'
                    : 'bg-[#070e1f] text-slate-400 hover:text-slate-200 border border-[#1e293b]'
                }`}
              >
                BUY (LONG)
              </button>
              <button
                type="button"
                onClick={() => setTradeSide('SELL')}
                className={`py-2 rounded font-semibold transition-colors ${
                  tradeSide === 'SELL'
                    ? 'bg-rose-500 text-slate-900 shadow-sm'
                    : 'bg-[#070e1f] text-slate-400 hover:text-slate-200 border border-[#1e293b]'
                }`}
              >
                SELL (SHORT/EXIT)
              </button>
            </div>

            {/* Asset Picker */}
            <div>
              <label className="block text-slate-400 mb-1">Target Symbol</label>
              <select
                value={tradeSymbol}
                onChange={(e) => setTradeSymbol(e.target.value)}
                className="w-full bg-[#070e1f] border border-[#1e293b] rounded p-2 text-slate-200 font-mono"
              >
                {quotes.map((q) => (
                  <option key={q.symbol} value={q.symbol}>
                    {q.symbol} — {q.name} ({formatMoney(q.price)})
                  </option>
                ))}
              </select>
            </div>

            {/* Shares / Size */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Quantity (Shares / Units)</span>
                <span className="text-slate-200 font-mono">
                  Market: {formatMoney(estPrice)}
                </span>
              </div>
              <input
                type="number"
                min="0.01"
                step="any"
                value={sharesInput}
                onChange={(e) => setSharesInput(Number(e.target.value))}
                className="w-full bg-[#070e1f] border border-[#1e293b] rounded p-2 text-slate-100 font-mono"
              />
            </div>

            {/* Order Summary breakdown */}
            <div className="bg-[#070e1f] border border-[#1e293b]/70 rounded p-3 font-mono text-[11px] space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Gross Value:</span>
                <span className="text-slate-200">{formatMoney(grossTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Friction (Fee & Slippage):</span>
                <span className="text-amber-400">{formatMoney(estimatedFee)}</span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-[#1e293b]/50">
                <span className="text-slate-300">Est. Total:</span>
                <span className="text-slate-100">{formatMoney(netOrderTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 rounded font-bold transition-colors ${
                tradeSide === 'BUY'
                  ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-900'
                  : 'bg-rose-400 hover:bg-rose-300 text-slate-900'
              }`}
            >
              Confirm Simulated {tradeSide} Order
            </button>
          </form>

          <div className="pt-2">
            <button
              onClick={onResetPortfolio}
              className="w-full py-1.5 text-[11px] text-slate-400 hover:text-slate-200 border border-[#1e293b] rounded transition-colors font-mono"
            >
              Reset Account to $100,000 Cash
            </button>
          </div>
        </div>

        {/* Current Portfolio Positions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#1e293b] flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                Active Portfolio Positions ({positions.length})
              </span>
            </div>

            {positions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 font-mono">
                No active positions. Execute your first simulated trade using the ticket on the left.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#070e1f] text-slate-400 border-b border-[#1e293b] text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Symbol</th>
                      <th className="py-2.5 px-3 text-right">Shares</th>
                      <th className="py-2.5 px-3 text-right">Avg Entry</th>
                      <th className="py-2.5 px-3 text-right">Current</th>
                      <th className="py-2.5 px-3 text-right">Market Value</th>
                      <th className="py-2.5 px-3 text-right">Unrealized P&L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e293b]/60">
                    {positions.map((pos) => {
                      const isPos = pos.unrealizedPnl >= 0;
                      return (
                        <tr key={pos.symbol} className="hover:bg-[#111f38]/50">
                          <td className="py-2.5 px-3 font-bold text-slate-100">
                            {pos.symbol}
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-300 tabular-nums">
                            {pos.shares}
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-400 tabular-nums">
                            {formatMoney(pos.avgEntryPrice)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-100 font-semibold tabular-nums">
                            {formatMoney(pos.currentPrice)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-100 tabular-nums">
                            {formatMoney(pos.shares * pos.currentPrice)}
                          </td>
                          <td
                            className={`py-2.5 px-3 text-right font-bold tabular-nums ${
                              isPos ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {isPos ? '+' : ''}
                            {formatMoney(pos.unrealizedPnl)} ({isPos ? '+' : ''}
                            {pos.unrealizedPnlPct.toFixed(2)}%)
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Trade Execution Audit Log */}
          {tradeLog.length > 0 && (
            <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#1e293b] flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                  Simulated Execution History Log ({tradeLog.length})
                </span>
              </div>
              <div className="max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs font-mono">
                  <tbody className="divide-y divide-[#1e293b]/40">
                    {tradeLog.map((t) => (
                      <tr key={t.id} className="text-[11px] text-slate-400 hover:bg-[#070e1f]">
                        <td className="py-1.5 px-3">{t.timestamp}</td>
                        <td
                          className={`py-1.5 px-3 font-bold ${
                            t.side === 'BUY' ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {t.side}
                        </td>
                        <td className="py-1.5 px-3 text-slate-200 font-bold">
                          {t.shares} {t.symbol}
                        </td>
                        <td className="py-1.5 px-3 text-right text-slate-300">
                          @ {formatMoney(t.price)}
                        </td>
                        <td className="py-1.5 px-3 text-right text-slate-400">
                          Fee: {formatMoney(t.fee)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
