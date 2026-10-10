import { useState, useEffect } from 'react';
import {
  Quote,
  GlobalIndex,
  BitcoinMetrics,
  PaperPosition,
  TradeOrder,
  AlertRule,
} from './types/market';
import {
  INITIAL_INDICES,
  INITIAL_QUOTES,
  BITCOIN_TELEMETRY,
  generateHistoricalCandles,
} from './data/marketData';
import { Header } from './components/Header';
import { TickerTape } from './components/TickerTape';
import { MarketOverview } from './components/MarketOverview';
import { StockScreener } from './components/StockScreener';
import { BitcoinTerminal } from './components/BitcoinTerminal';
import { PredictionLab } from './components/PredictionLab';
import { OwnershipIntelligence } from './components/OwnershipIntelligence';
import { PortfolioTracker } from './components/PortfolioTracker';
import { TradingResearch } from './components/TradingResearch';
import { AlertsCenter } from './components/AlertsCenter';
import { PipelineMonitor } from './components/PipelineMonitor';

export default function App() {
  const [activeModule, setActiveModule] = useState<string>('overview');
  const [currency, setCurrency] = useState<string>('USD');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('NVDA');

  // Market quotes state
  const [quotes, setQuotes] = useState<Quote[]>(INITIAL_QUOTES);
  const [indices, setIndices] = useState<GlobalIndex[]>(INITIAL_INDICES);
  const [btcMetrics, setBtcMetrics] = useState<BitcoinMetrics>(BITCOIN_TELEMETRY);

  // Portfolio state
  const [cashBalance, setCashBalance] = useState<number>(100000.0);
  const [positions, setPositions] = useState<PaperPosition[]>([
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      shares: 0.5,
      avgEntryPrice: 65200.0,
      currentPrice: 68450.0,
      unrealizedPnl: 1625.0,
      unrealizedPnlPct: 4.98,
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      shares: 100,
      avgEntryPrice: 128.5,
      currentPrice: 138.5,
      unrealizedPnl: 1000.0,
      unrealizedPnlPct: 7.78,
    },
  ]);
  const [tradeLog, setTradeLog] = useState<TradeOrder[]>([
    {
      id: 'tr_1',
      symbol: 'BTC',
      side: 'BUY',
      shares: 0.5,
      price: 65200.0,
      fee: 22.8,
      timestamp: '2024-10-01 09:30',
    },
    {
      id: 'tr_2',
      symbol: 'NVDA',
      side: 'BUY',
      shares: 100,
      price: 128.5,
      fee: 8.9,
      timestamp: '2024-10-02 10:15',
    },
  ]);

  // Alerts state
  const [alerts, setAlerts] = useState<AlertRule[]>([
    {
      id: 'al_1',
      symbol: 'BTC',
      conditionType: 'PRICE_ABOVE',
      thresholdValue: 70000,
      isActive: true,
      createdAt: '2024-10-08',
    },
    {
      id: 'al_2',
      symbol: 'NVDA',
      conditionType: 'RSI_OVERBOUGHT',
      thresholdValue: 70,
      isActive: true,
      createdAt: '2024-10-08',
    },
    {
      id: 'al_3',
      symbol: 'AAPL',
      conditionType: 'PRICE_BELOW',
      thresholdValue: 225,
      isActive: true,
      createdAt: '2024-10-08',
    },
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cached historical candles per symbol
  const selectedBars = generateHistoricalCandles(selectedSymbol, 60);
  const btcBars = generateHistoricalCandles('BTC', 60);

  // Live tick simulator (every 4 seconds, updates subtle micro-price)
  useEffect(() => {
    const interval = setInterval(() => {
      setQuotes((prev) =>
        prev.map((q) => {
          const delta = (Math.random() - 0.48) * (q.price * 0.002);
          const newPrice = Number(Math.max(q.price + delta, 1.0).toFixed(2));
          const changePct = Number(
            (q.changePct + (delta / q.price) * 100).toFixed(2)
          );
          return {
            ...q,
            price: newPrice,
            changePct,
          };
        })
      );

      // Micro update Bitcoin telemetry
      setBtcMetrics((prev) => {
        const delta = (Math.random() - 0.48) * 80;
        const newPrice = Number((prev.priceUsd + delta).toFixed(2));
        return {
          ...prev,
          priceUsd: newPrice,
        };
      });

      // Update indices
      setIndices((prev) =>
        prev.map((idx) => {
          const delta = (Math.random() - 0.48) * 4;
          return {
            ...idx,
            price: Number((idx.price + delta).toFixed(2)),
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Update positions currentPrice when quotes update
  useEffect(() => {
    setPositions((prev) =>
      prev.map((pos) => {
        const matchingQuote = quotes.find((q) => q.symbol === pos.symbol);
        const currentP = matchingQuote ? matchingQuote.price : pos.currentPrice;
        const unrealizedPnl = (currentP - pos.avgEntryPrice) * pos.shares;
        const unrealizedPnlPct =
          ((currentP - pos.avgEntryPrice) / pos.avgEntryPrice) * 100;
        return {
          ...pos,
          currentPrice: currentP,
          unrealizedPnl,
          unrealizedPnlPct,
        };
      })
    );
  }, [quotes]);

  // Execute Paper Trade
  const handleExecuteTrade = (
    symbol: string,
    side: 'BUY' | 'SELL',
    shares: number
  ) => {
    const q = quotes.find((item) => item.symbol === symbol) || quotes[0];
    const price = q.price;
    const gross = shares * price;
    const fee = gross * 0.0007;

    if (side === 'BUY') {
      if (cashBalance < gross + fee) {
        showToast(`Insufficient cash reserve for ${shares} ${symbol}`);
        return;
      }
      setCashBalance((prev) => prev - (gross + fee));

      setPositions((prev) => {
        const existing = prev.find((p) => p.symbol === symbol);
        if (existing) {
          const newShares = existing.shares + shares;
          const newAvg =
            (existing.shares * existing.avgEntryPrice + gross) / newShares;
          return prev.map((p) =>
            p.symbol === symbol
              ? {
                  ...p,
                  shares: newShares,
                  avgEntryPrice: newAvg,
                  currentPrice: price,
                  unrealizedPnl: (price - newAvg) * newShares,
                  unrealizedPnlPct: ((price - newAvg) / newAvg) * 100,
                }
              : p
          );
        } else {
          return [
            ...prev,
            {
              symbol,
              name: q.name,
              shares,
              avgEntryPrice: price,
              currentPrice: price,
              unrealizedPnl: 0,
              unrealizedPnlPct: 0,
            },
          ];
        }
      });
      showToast(`Filled: BUY ${shares} ${symbol} @ $${price.toFixed(2)}`);
    } else {
      // SELL
      const existing = positions.find((p) => p.symbol === symbol);
      if (!existing || existing.shares < shares) {
        showToast(`Insufficient shares of ${symbol} to sell`);
        return;
      }
      setCashBalance((prev) => prev + (gross - fee));
      setPositions((prev) => {
        const remaining = existing.shares - shares;
        if (remaining <= 0.001) {
          return prev.filter((p) => p.symbol !== symbol);
        } else {
          return prev.map((p) =>
            p.symbol === symbol
              ? {
                  ...p,
                  shares: remaining,
                  unrealizedPnl: (price - p.avgEntryPrice) * remaining,
                  unrealizedPnlPct:
                    ((price - p.avgEntryPrice) / p.avgEntryPrice) * 100,
                }
              : p
          );
        }
      });
      showToast(`Filled: SELL ${shares} ${symbol} @ $${price.toFixed(2)}`);
    }

    // Append to trade log
    setTradeLog((prev) => [
      {
        id: `tr_${Date.now()}`,
        symbol,
        side,
        shares,
        price,
        fee,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      },
      ...prev,
    ]);
  };

  const handleResetPortfolio = () => {
    setCashBalance(100000.0);
    setPositions([]);
    setTradeLog([]);
    showToast('Paper trading portfolio reset to $100,000 cash.');
  };

  const handleAddAlert = (rule: Omit<AlertRule, 'id' | 'createdAt'>) => {
    const newAlert: AlertRule = {
      ...rule,
      id: `al_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAlerts((prev) => [newAlert, ...prev]);
    showToast(`Alert monitor armed for ${rule.symbol}`);
  };

  const handleToggleAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast('Alert monitor removed.');
  };

  const handleSimulateTrigger = () => {
    showToast(
      '🚨 ALERT TRIGGERED: BTC breached resistance threshold ($68,500 target reached)'
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-[#050914] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b1528] border border-amber-500/60 shadow-xl shadow-black/80 rounded-lg px-4 py-3 text-xs font-mono text-amber-300 flex items-center gap-3 animate-bounce">
          <span>⚡</span>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-200 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        currency={currency}
        setCurrency={setCurrency}
      />

      {/* Live Continuous Ticker Marquee */}
      <TickerTape
        quotes={quotes}
        currency={currency}
        onSelectQuote={(sym) => {
          setSelectedSymbol(sym);
          if (activeModule !== 'overview' && activeModule !== 'prediction') {
            setActiveModule('overview');
          }
        }}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-[1520px] w-full mx-auto p-4 sm:p-6 space-y-6">
        {activeModule === 'overview' && (
          <MarketOverview
            indices={indices}
            quotes={quotes}
            selectedSymbol={selectedSymbol}
            setSelectedSymbol={setSelectedSymbol}
            selectedBars={selectedBars}
            currency={currency}
          />
        )}

        {activeModule === 'screener' && (
          <StockScreener
            quotes={quotes}
            currency={currency}
            onSelectQuote={(sym) => {
              setSelectedSymbol(sym);
              setActiveModule('overview');
            }}
          />
        )}

        {activeModule === 'bitcoin' && (
          <BitcoinTerminal
            btcMetrics={btcMetrics}
            currency={currency}
            btcBars={btcBars}
          />
        )}

        {activeModule === 'prediction' && (
          <PredictionLab
            selectedSymbol={selectedSymbol}
            setSelectedSymbol={setSelectedSymbol}
            bars={selectedBars}
            currency={currency}
          />
        )}

        {activeModule === 'ownership' && <OwnershipIntelligence />}

        {activeModule === 'portfolio' && (
          <PortfolioTracker
            positions={positions}
            cashBalance={cashBalance}
            tradeLog={tradeLog}
            quotes={quotes}
            currency={currency}
            onExecuteTrade={handleExecuteTrade}
            onResetPortfolio={handleResetPortfolio}
          />
        )}

        {activeModule === 'research' && (
          <TradingResearch
            quotes={quotes}
            positions={positions}
            currency={currency}
          />
        )}

        {activeModule === 'alerts' && (
          <AlertsCenter
            alerts={alerts}
            quotes={quotes}
            currency={currency}
            onAddAlert={handleAddAlert}
            onToggleAlert={handleToggleAlert}
            onDeleteAlert={handleDeleteAlert}
            onSimulateTrigger={handleSimulateTrigger}
          />
        )}

        {activeModule === 'pipeline' && <PipelineMonitor />}
      </main>

      {/* Terminal Footer */}
      <footer className="border-t border-[#1e293b] bg-[#060b18] py-4 px-6 text-xs text-slate-500 font-mono">
        <div className="max-w-[1520px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">STOCKSTREAM QUANT</span>
            <span>·</span>
            <span>Institutional-Grade Financial Intelligence Terminal</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Market Data: yfinance / CCXT</span>
            <span>·</span>
            <span>13F: SEC EDGAR Public Filings</span>
            <span>·</span>
            <span>Apache 2.0 License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
