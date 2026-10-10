"""
STOCKSTREAM QUANT — Stock Market Intelligence Module
Global indices, equity screener, technical setups, support/resistance, and fundamentals.
"""

from typing import List, Dict, Any, Optional

GLOBAL_INDICES = [
    {"symbol": "^GSPC", "name": "S&P 500", "region": "US", "price": 5751.13, "change_pct": 0.42, "volume": "3.8B"},
    {"symbol": "^IXIC", "name": "Nasdaq 100", "region": "US", "price": 20048.21, "change_pct": 0.81, "volume": "4.2B"},
    {"symbol": "^DJI", "name": "Dow Jones Ind", "region": "US", "price": 42352.75, "change_pct": -0.12, "volume": "380M"},
    {"symbol": "^FTSE", "name": "FTSE 100", "region": "UK", "price": 8280.63, "change_pct": 0.18, "volume": "710M"},
    {"symbol": "^N225", "name": "Nikkei 225", "region": "Japan", "price": 39380.89, "change_pct": 1.45, "volume": "1.2B"},
    {"symbol": "^NSEI", "name": "Nifty 50", "region": "India", "price": 25014.60, "change_pct": 0.35, "volume": "520M"},
]

TRACKED_EQUITIES = [
    {
        "symbol": "NVDA",
        "name": "NVIDIA Corporation",
        "sector": "Semiconductors",
        "price": 138.50,
        "change_pct": 2.85,
        "market_cap": "3.41T",
        "pe_ratio": 54.2,
        "volume": "48.2M",
        "support": 131.00,
        "resistance": 142.50,
        "rsi": 66.4,
        "signal": "BULLISH_MOMENTUM",
        "dividend_yield": "0.03%"
    },
    {
        "symbol": "AAPL",
        "name": "Apple Inc.",
        "sector": "Consumer Electronics",
        "price": 232.10,
        "change_pct": 0.65,
        "market_cap": "3.52T",
        "pe_ratio": 34.8,
        "volume": "39.5M",
        "support": 224.00,
        "resistance": 237.20,
        "rsi": 58.2,
        "signal": "CONSOLIDATION_WATCH",
        "dividend_yield": "0.43%"
    },
    {
        "symbol": "MSFT",
        "name": "Microsoft Corporation",
        "sector": "Enterprise Software",
        "price": 422.80,
        "change_pct": -0.42,
        "market_cap": "3.14T",
        "pe_ratio": 36.1,
        "volume": "18.4M",
        "support": 412.00,
        "resistance": 435.00,
        "rsi": 49.8,
        "signal": "NEUTRAL",
        "dividend_yield": "0.71%"
    },
    {
        "symbol": "GOOGL",
        "name": "Alphabet Inc.",
        "sector": "Internet & Cloud",
        "price": 168.20,
        "change_pct": 1.15,
        "market_cap": "2.09T",
        "pe_ratio": 24.3,
        "volume": "22.8M",
        "support": 162.00,
        "resistance": 172.50,
        "rsi": 61.0,
        "signal": "BULLISH_SETUP",
        "dividend_yield": "0.48%"
    },
    {
        "symbol": "AMZN",
        "name": "Amazon.com Inc.",
        "sector": "E-Commerce & Cloud",
        "price": 186.40,
        "change_pct": 0.92,
        "market_cap": "1.94T",
        "pe_ratio": 42.5,
        "volume": "31.2M",
        "support": 180.00,
        "resistance": 192.00,
        "rsi": 54.3,
        "signal": "CONSOLIDATION_WATCH",
        "dividend_yield": "0.00%"
    },
    {
        "symbol": "TSLA",
        "name": "Tesla, Inc.",
        "sector": "Automotive & Clean Energy",
        "price": 218.90,
        "change_pct": -2.10,
        "market_cap": "698B",
        "pe_ratio": 62.4,
        "volume": "64.1M",
        "support": 205.00,
        "resistance": 235.00,
        "rsi": 43.1,
        "signal": "BEARISH_PRESSURE",
        "dividend_yield": "0.00%"
    }
]

class StockMarketIntelligence:
    """Provides market screener and equity intelligence metrics."""

    @staticmethod
    def get_global_indices() -> List[Dict[str, Any]]:
        return GLOBAL_INDICES

    @staticmethod
    def get_tracked_equities() -> List[Dict[str, Any]]:
        return TRACKED_EQUITIES

    @staticmethod
    def screen_stocks(
        min_market_cap: Optional[float] = None,
        sector: Optional[str] = None,
        max_pe: Optional[float] = None,
        signal_filter: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        results = []
        for eq in TRACKED_EQUITIES:
            if sector and sector != "All" and eq["sector"] != sector:
                continue
            if max_pe and eq["pe_ratio"] > max_pe:
                continue
            if signal_filter and signal_filter != "All" and eq["signal"] != signal_filter:
                continue
            results.append(eq)
        return results

    @staticmethod
    def calculate_trade_setup(equity: Dict[str, Any]) -> Dict[str, Any]:
        """Calculates potential entry zone, stop loss, target, and risk/reward ratio."""
        price = equity["price"]
        support = equity["support"]
        resistance = equity["resistance"]

        stop_loss = round(support * 0.985, 2)
        risk = price - stop_loss
        reward = resistance - price

        rr_ratio = round(reward / risk, 2) if risk > 0 else 0.0

        return {
            "symbol": equity["symbol"],
            "current_price": price,
            "entry_zone": f"${round(support * 1.005, 2)} - ${round(support * 1.025, 2)}",
            "invalidation_stop_loss": stop_loss,
            "take_profit_target": resistance,
            "risk_per_share": round(risk, 2),
            "reward_per_share": round(reward, 2),
            "risk_reward_ratio": f"1:{rr_ratio}" if rr_ratio > 0 else "N/A",
            "setup_quality": "High" if rr_ratio >= 2.0 else ("Moderate" if rr_ratio >= 1.2 else "Low")
        }
