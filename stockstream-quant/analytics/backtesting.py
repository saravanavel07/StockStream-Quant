"""
STOCKSTREAM QUANT — Walk-Forward Backtesting Engine
Simulates predictive strategy performance with transaction fees, slippage, and equity curve tracking.
"""

import math
from typing import List, Dict, Any

class StrategyBacktester:
    """Walk-forward backtesting engine with realistic friction costs."""

    @staticmethod
    def run_backtest(
        bars: List[Dict[str, Any]],
        initial_capital: float = 100000.0,
        fee_bps: float = 5.0, # 5 basis points = 0.05%
        slippage_bps: float = 2.0
    ) -> Dict[str, Any]:
        """
        Executes a walk-forward technical momentum/mean-reversion backtest over bars.
        """
        if len(bars) < 30:
            return {"error": "Need at least 30 bars for valid backtest"}

        closes = [b["close"] for b in bars]
        timestamps = [b["timestamp"] for b in bars]
        
        capital = initial_capital
        position_shares = 0.0
        equity_curve = [initial_capital]
        trades = []
        friction = (fee_bps + slippage_bps) / 10000.0

        # Run 20-period moving average breakout strategy
        for i in range(20, len(bars)):
            sma20 = sum(closes[i-20:i]) / 20.0
            price = closes[i]
            prev_price = closes[i-1]

            # Signal logic
            bullish_cross = prev_price <= sma20 and price > sma20
            bearish_cross = prev_price >= sma20 and price < sma20

            # Execution
            if bullish_cross and position_shares == 0:
                # Buy
                cost_price = price * (1 + friction)
                position_shares = (capital * 0.98) / cost_price
                capital -= position_shares * cost_price
                trades.append({
                    "type": "BUY",
                    "price": price,
                    "date": timestamps[i],
                    "cost": cost_price
                })
            elif bearish_cross and position_shares > 0:
                # Sell
                proceeds_price = price * (1 - friction)
                capital += position_shares * proceeds_price
                trades.append({
                    "type": "SELL",
                    "price": price,
                    "date": timestamps[i],
                    "proceeds": proceeds_price
                })
                position_shares = 0.0

            total_equity = capital + (position_shares * price)
            equity_curve.append(round(total_equity, 2))

        # Close position at the end
        if position_shares > 0:
            final_price = closes[-1] * (1 - friction)
            capital += position_shares * final_price
            position_shares = 0.0

        final_equity = equity_curve[-1]
        total_return_pct = round(((final_equity - initial_capital) / initial_capital) * 100, 2)
        benchmark_return_pct = round(((closes[-1] - closes[20]) / closes[20]) * 100, 2)

        # Max drawdown
        peak = equity_curve[0]
        max_dd = 0.0
        for eq in equity_curve:
            if eq > peak:
                peak = eq
            dd = (peak - eq) / peak
            if dd > max_dd:
                max_dd = dd

        # Sharpe ratio estimation
        returns = [(equity_curve[j] - equity_curve[j-1]) / equity_curve[j-1] for j in range(1, len(equity_curve))]
        mean_r = sum(returns) / len(returns) if returns else 0.0
        var_r = sum((r - mean_r)**2 for r in returns) / len(returns) if len(returns) > 1 else 0.0001
        std_r = math.sqrt(max(var_r, 0.00001))
        sharpe = round((mean_r / std_r) * math.sqrt(252), 2) if std_r > 0 else 0.0

        return {
            "initial_capital": initial_capital,
            "final_equity": round(final_equity, 2),
            "total_return_pct": total_return_pct,
            "benchmark_return_pct": benchmark_return_pct,
            "max_drawdown_pct": round(max_dd * 100, 2),
            "sharpe_ratio": sharpe,
            "trade_count": len(trades),
            "trades": trades[-8:], # last trades
            "equity_points": len(equity_curve)
        }
