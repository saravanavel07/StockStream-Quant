"""
STOCKSTREAM QUANT — System Settings & Global Constants
"""

import os
from dataclasses import dataclass
from typing import List, Dict

@dataclass(frozen=True)
class AppConfig:
    """Application configuration container."""
    APP_NAME: str = "STOCKSTREAM QUANT"
    TAGLINE: str = "Real-Time Stock Market & Bitcoin Intelligence Platform"
    VERSION: str = "2.4.0"
    
    # Palette Hex Codes
    COLOR_NAVY_DEEP: str = "#060B18"
    COLOR_NAVY_SURFACE: str = "#0B1528"
    COLOR_NAVY_BORDER: str = "#1E293B"
    COLOR_EMERALD: str = "#10B981"
    COLOR_EMERALD_MUTED: str = "#059669"
    COLOR_GOLD_BTC: str = "#F59E0B"
    COLOR_GOLD_LIGHT: str = "#FCD34D"
    COLOR_CRIMSON: str = "#EF4444"
    COLOR_TEXT_PRIMARY: str = "#F8FAFC"
    COLOR_TEXT_MUTED: str = "#94A3B8"
    
    # Database
    DB_PATH: str = os.getenv("DATABASE_PATH", "stockstream.db")
    
    # Cache TTLs (seconds)
    CACHE_TTL_QUOTE: int = int(os.getenv("CACHE_TTL_QUOTE", "15"))
    CACHE_TTL_HISTORICAL: int = int(os.getenv("CACHE_TTL_HISTORICAL", "300"))
    CACHE_TTL_OWNERSHIP: int = int(os.getenv("CACHE_TTL_OWNERSHIP", "86400"))
    
    # Supported Currencies
    SUPPORTED_CURRENCIES: List[str] = ("USD", "INR", "EUR", "GBP", "JPY")
    
    # Forex Base Rates to USD
    CURRENCY_RATES: Dict[str, float] = None

    def __post_init__(self):
        # Frozen dataclass workaround for dictionary default
        object.__setattr__(self, 'CURRENCY_RATES', {
            "USD": 1.000,
            "INR": 83.92,
            "EUR": 0.924,
            "GBP": 0.785,
            "JPY": 154.20
        })

CONFIG = AppConfig()
