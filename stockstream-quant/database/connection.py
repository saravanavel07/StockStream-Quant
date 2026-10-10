"""
STOCKSTREAM QUANT — Database Connection & Migration Layer
Provides local SQLite storage for watchlists, alerts, portfolio positions, and historical forecasts.
"""

import sqlite3
import os
from typing import Optional

DB_FILE = os.getenv("DATABASE_PATH", "stockstream.db")

def get_connection(db_path: Optional[str] = None) -> sqlite3.Connection:
    """Creates a configured connection to the SQLite database."""
    target_path = db_path or DB_FILE
    conn = sqlite3.connect(target_path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def initialize_database(db_path: Optional[str] = None) -> None:
    """Executes schema migrations for persistent local operations."""
    conn = get_connection(db_path)
    cursor = conn.cursor()

    # Watchlist table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS watchlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symbol TEXT NOT NULL UNIQUE,
        asset_type TEXT NOT NULL DEFAULT 'EQUITY',
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notes TEXT
    );
    """)

    # Alerts table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symbol TEXT NOT NULL,
        condition_type TEXT NOT NULL, -- 'PRICE_ABOVE', 'PRICE_BELOW', 'RSI_OVERSOLD', 'RSI_OVERBOUGHT'
        threshold_value REAL NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        triggered_at TIMESTAMP
    );
    """)

    # Paper trading portfolio table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS portfolio_positions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symbol TEXT NOT NULL UNIQUE,
        shares REAL NOT NULL,
        avg_entry_price REAL NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Trade executions log
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS trade_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symbol TEXT NOT NULL,
        side TEXT NOT NULL, -- 'BUY', 'SELL'
        shares REAL NOT NULL,
        price REAL NOT NULL,
        fee REAL NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Prediction log (tracks forecasts vs subsequent actuals)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS prediction_audit_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symbol TEXT NOT NULL,
        forecast_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        horizon_days INTEGER NOT NULL,
        base_price REAL NOT NULL,
        predicted_price REAL NOT NULL,
        confidence_80_lower REAL,
        confidence_80_upper REAL,
        actual_price REAL,
        error_pct REAL
    );
    """)

    # Seed default watchlists if empty
    cursor.execute("SELECT COUNT(*) as count FROM watchlist")
    if cursor.fetchone()["count"] == 0:
        cursor.executemany(
            "INSERT INTO watchlist (symbol, asset_type, notes) VALUES (?, ?, ?)",
            [
                ("BTC", "CRYPTO", "Primary digital asset benchmark"),
                ("NVDA", "EQUITY", "AI hardware leadership"),
                ("AAPL", "EQUITY", "Consumer ecosystem cash flow"),
                ("SPY", "ETF", "Broad market S&P 500 index"),
            ]
        )

    conn.commit()
    conn.close()
