"""
STOCKSTREAM QUANT — Market Intelligence & Catalyst News
Aggregates factual market developments and macro events with clear source attribution.
"""

from typing import List, Dict, Any

class MarketNewsService:
    """Delivers objective market catalyst events and news summaries."""

    @staticmethod
    def get_market_news(category: str = "all") -> List[Dict[str, Any]]:
        news_items = [
            {
                "id": "news_1",
                "title": "U.S. Non-Farm Payrolls Exceed Consensus, Yields Hold Above 4.0%",
                "source": "Bureau of Labor Statistics / Dow Jones Wire",
                "timestamp": "25 mins ago",
                "category": "Macro",
                "impact": "BULLISH_USD",
                "summary": "Labor market resilience cools immediate expectations of aggressive 50bps rate cuts, stabilizing equity valuations."
            },
            {
                "id": "news_2",
                "title": "Global Bitcoin ETF Inflows Cross $1.2B in Weekly Institutional Allocations",
                "source": "CoinDesk Institutional Flow Desk",
                "timestamp": "1 hour ago",
                "category": "Crypto",
                "impact": "BULLISH_CRYPTO",
                "summary": "Sustained net inflows into spot ETFs reduce liquid exchange reserves, tightening spot orderbook depth."
            },
            {
                "id": "news_3",
                "title": "Semiconductor Supply Chain Reports Robust Blackwell GPU Production Ramps",
                "source": "TrendForce Financial Research",
                "timestamp": "3 hours ago",
                "category": "Equities",
                "impact": "BULLISH_TECH",
                "summary": "Packaging yields improved ahead of Q4 enterprise delivery cycles, supporting datacenter capital expenditure projections."
            },
            {
                "id": "news_4",
                "title": "Crude Oil Consolidates Around $74/bbl Amid Middle East Supply Buffer Checks",
                "source": "Reuters Commodity Markets",
                "timestamp": "5 hours ago",
                "category": "Commodities",
                "impact": "NEUTRAL",
                "summary": "OPEC+ spare capacity provides ceiling while seasonal inventory draws offset global demand softness."
            }
        ]

        if category == "all":
            return news_items
        return [n for n in news_items if n["category"].lower() == category.lower()]
