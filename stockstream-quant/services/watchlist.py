"""
STOCKSTREAM QUANT — Watchlist Service
"""

from typing import List, Dict, Any
from database.repository import MarketRepository

class WatchlistService:
    """Manages user favorites and quick-access assets."""

    def __init__(self, repo: MarketRepository):
        self.repo = repo

    def list_symbols(self) -> List[str]:
        items = self.repo.get_watchlist()
        return [i["symbol"] for i in items]

    def add_symbol(self, symbol: str, asset_type: str = "EQUITY") -> bool:
        return self.repo.add_to_watchlist(symbol, asset_type)

    def remove_symbol(self, symbol: str) -> bool:
        return self.repo.remove_from_watchlist(symbol)
