"""
STOCKSTREAM QUANT — Data Repository
Data access layer for watchlists, alerts, portfolio bookkeeping, and forecast validation.
"""

from typing import List, Dict, Any, Optional
from database.connection import get_connection

class MarketRepository:
    """Encapsulates all database persistence operations."""

    def __init__(self, db_path: Optional[str] = None):
        self.db_path = db_path

    # Watchlist methods
    def get_watchlist(self) -> List[Dict[str, Any]]:
        conn = get_connection(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT * FROM watchlist ORDER BY id ASC")
        rows = [dict(r) for r in cur.fetchall()]
        conn.close()
        return rows

    def add_to_watchlist(self, symbol: str, asset_type: str = "EQUITY", notes: str = "") -> bool:
        conn = get_connection(self.db_path)
        cur = conn.cursor()
        try:
            cur.execute(
                "INSERT INTO watchlist (symbol, asset_type, notes) VALUES (?, ?, ?)",
                (symbol.upper(), asset_type.upper(), notes)
            )
            conn.commit()
            return True
        except Exception:
            return False
        finally:
            conn.close()

    def remove_from_watchlist(self, symbol: str) -> bool:
        conn = get_connection(self.db_path)
        cur = conn.cursor()
        cur.execute("DELETE FROM watchlist WHERE symbol = ?", (symbol.upper(),))
        deleted = cur.rowcount > 0
        conn.commit()
        conn.close()
        return deleted

    # Alerts methods
    def get_alerts(self, active_only: bool = True) -> List[Dict[str, Any]]:
        conn = get_connection(self.db_path)
        cur = conn.cursor()
        if active_only:
            cur.execute("SELECT * FROM alerts WHERE is_active = 1 ORDER BY id DESC")
        else:
            cur.execute("SELECT * FROM alerts ORDER BY id DESC")
        rows = [dict(r) for r in cur.fetchall()]
        conn.close()
        return rows

    def create_alert(self, symbol: str, condition_type: str, threshold_value: float) -> int:
        conn = get_connection(self.db_path)
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO alerts (symbol, condition_type, threshold_value) VALUES (?, ?, ?)",
            (symbol.upper(), condition_type, threshold_value)
        )
        conn.commit()
        alert_id = cur.lastrowid
        conn.close()
        return alert_id

    # Portfolio & Paper Trading methods
    def get_portfolio(self) -> List[Dict[str, Any]]:
        conn = get_connection(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT * FROM portfolio_positions ORDER BY id ASC")
        rows = [dict(r) for r in cur.fetchall()]
        conn.close()
        return rows

    def record_paper_trade(self, symbol: str, side: str, shares: float, price: float, fee: float = 1.0) -> None:
        conn = get_connection(self.db_path)
        cur = conn.cursor()
        # Insert trade log
        cur.execute(
            "INSERT INTO trade_log (symbol, side, shares, price, fee) VALUES (?, ?, ?, ?, ?)",
            (symbol.upper(), side.upper(), shares, price, fee)
        )

        # Update position
        cur.execute("SELECT * FROM portfolio_positions WHERE symbol = ?", (symbol.upper(),))
        existing = cur.fetchone()

        if side.upper() == "BUY":
            if existing:
                old_shares = existing["shares"]
                old_entry = existing["avg_entry_price"]
                new_shares = old_shares + shares
                new_avg = ((old_shares * old_entry) + (shares * price)) / new_shares if new_shares > 0 else price
                cur.execute(
                    "UPDATE portfolio_positions SET shares = ?, avg_entry_price = ?, updated_at = CURRENT_TIMESTAMP WHERE symbol = ?",
                    (new_shares, new_avg, symbol.upper())
                )
            else:
                cur.execute(
                    "INSERT INTO portfolio_positions (symbol, shares, avg_entry_price) VALUES (?, ?, ?)",
                    (symbol.upper(), shares, price)
                )
        elif side.upper() == "SELL" and existing:
            remaining = existing["shares"] - shares
            if remaining <= 0.0001:
                cur.execute("DELETE FROM portfolio_positions WHERE symbol = ?", (symbol.upper(),))
            else:
                cur.execute(
                    "UPDATE portfolio_positions SET shares = ?, updated_at = CURRENT_TIMESTAMP WHERE symbol = ?",
                    (remaining, symbol.upper())
                )

        conn.commit()
        conn.close()
