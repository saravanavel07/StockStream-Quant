import React from 'react';
import { CURRENCY_MAP } from '../data/marketData';

interface HeaderProps {
  activeModule: string;
  setActiveModule: (m: string) => void;
  currency: string;
  setCurrency: (c: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  setActiveModule,
  currency,
  setCurrency,
}) => {
  const navItems = [
    { id: 'overview', label: 'Market Overview' },
    { id: 'screener', label: 'Stock Screener' },
    { id: 'bitcoin', label: 'Bitcoin Terminal' },
    { id: 'prediction', label: 'Prediction Lab' },
    { id: 'ownership', label: '13F Ownership' },
    { id: 'portfolio', label: 'Paper Portfolio' },
    { id: 'research', label: 'Trading Research' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'pipeline', label: 'Pipeline Monitor' },
  ];

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-8 px-6 py-3.5 bg-[#060b18]/95 backdrop-blur-md border-b border-[#1e293b]">
      {/* Zone 1: Brand title wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            setActiveModule('overview');
          }}
          className="flex items-center gap-2.5 text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-amber-400 transition-colors"
        >
          <div className="relative w-7 h-7 rounded-full overflow-hidden border border-amber-400/60 shadow-sm shadow-amber-500/30 shrink-0">
            <img
              src="/src/assets/images/golden_bitcoin_logo_1791607960688.jpg"
              alt="Golden Bitcoin with surrounding stars logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span>STOCKSTREAM QUANT</span>
        </a>
      </div>

      {/* Zone 2: Navigation Links (single line, whitespace-nowrap) */}
      <nav className="hidden xl:flex items-center gap-5 text-xs font-medium text-slate-300">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveModule(item.id)}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeModule === item.id
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-500'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Zone 3: Currency selector */}
      <div className="flex items-center gap-3 shrink-0">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="bg-[#0b1528] border border-[#1e293b] text-slate-200 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 transition-colors font-mono cursor-pointer"
          title="Base currency selector"
        >
          {Object.entries(CURRENCY_MAP).map(([code, meta]) => (
            <option key={code} value={code}>
              {code} ({meta.symbol})
            </option>
          ))}
        </select>
      </div>
    </header>
  );
};
