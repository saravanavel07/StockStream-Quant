"""
STOCKSTREAM QUANT — Bitcoin & Cryptocurrency Intelligence Terminal
Institutional crypto analytics, multi-currency conversions, exchange spread telemetry, and on-chain indicators.
"""

from typing import Dict, Any, List
from config.settings import CONFIG

class CryptoMarketIntelligence:
    """Specialized Bitcoin and crypto analytics suite."""

    @staticmethod
    def get_bitcoin_metrics(currency: str = "USD") -> Dict[str, Any]:
        """Provides institutional telemetry for Bitcoin."""
        base_price_usd = 68450.00
        rate = CONFIG.CURRENCY_RATES.get(currency.upper(), 1.0)
        converted_price = round(base_price_usd * rate, 2)
        
        # Currency formatting symbol
        symbols = {"USD": "$", "INR": "₹", "EUR": "€", "GBP": "£", "JPY": "¥"}
        sym = symbols.get(currency.upper(), "$")

        return {
            "symbol": "BTC",
            "name": "Bitcoin",
            "price_usd": base_price_usd,
            "currency": currency.upper(),
            "currency_symbol": sym,
            "converted_price": converted_price,
            "change_24h_pct": 3.42,
            "change_7d_pct": 7.18,
            "high_24h": round(base_price_usd * 1.028, 2),
            "low_24h": round(base_price_usd * 0.985, 2),
            "market_cap_usd": "1.35T",
            "volume_24h_usd": "34.2B",
            "circulating_supply": "19,765,000 BTC",
            "max_supply": "21,000,000 BTC",
            "btc_dominance_pct": 57.8,
            "fear_greed_index": 72, # Greed
            "fear_greed_label": "Greed",
            "hash_rate_ehs": 685.4, # EH/s
            "next_halving_est": "April 2028",
            "exchange_spreads": [
                {"exchange": "Binance", "pair": "BTC/USDT", "bid": 68449.50, "ask": 68450.00, "spread_usd": 0.50, "volume_share": "42.1%"},
                {"exchange": "Coinbase", "pair": "BTC/USD", "bid": 68451.20, "ask": 68452.10, "spread_usd": 0.90, "volume_share": "24.5%"},
                {"exchange": "Kraken", "pair": "BTC/USD", "bid": 68448.80, "ask": 68450.10, "spread_usd": 1.30, "volume_share": "14.2%"},
                {"exchange": "Bitfinex", "pair": "BTC/USD", "bid": 68453.00, "ask": 68455.20, "spread_usd": 2.20, "volume_share": "8.7%"}
            ],
            "support_levels": [66200.0, 64500.0, 60800.0],
            "resistance_levels": [70000.0, 71800.0, 73750.0],
            "downside_risk_scenarios": [
                {"scenario": "Immediate Invalidation", "level": 66200.0, "drop_pct": -3.29, "risk_type": "Retest of 20-Day EMA"},
                {"scenario": "Macro Pullback Target", "level": 61500.0, "drop_pct": -10.15, "risk_type": "CME Futures Gap Fill"},
                {"scenario": "Severe Liquidity Sweep", "level": 54000.0, "drop_pct": -21.11, "risk_type": "200-Day SMA Defense Zone"}
            ]
        }

    @staticmethod
    def get_crypto_universe() -> List[Dict[str, Any]]:
        """Major cryptocurrency basket telemetry."""
        return [
            {"symbol": "BTC", "name": "Bitcoin", "price": 68450.00, "change_24h": 3.42, "market_cap": "1.35T", "vol_24h": "34.2B", "dominance": "57.8%"},
            {"symbol": "ETH", "name": "Ethereum", "price": 2640.50, "change_24h": 2.15, "market_cap": "318B", "vol_24h": "16.8B", "dominance": "13.6%"},
            {"symbol": "SOL", "name": "Solana", "price": 178.40, "change_24h": 5.82, "market_cap": "83.6B", "vol_24h": "4.1B", "dominance": "3.6%"},
            {"symbol": "BNB", "name": "BNB", "price": 598.10, "change_24h": 0.85, "market_cap": "87.3B", "vol_24h": "1.2B", "dominance": "3.7%"},
            {"symbol": "XRP", "name": "XRP", "price": 0.542, "change_24h": -0.45, "market_cap": "30.8B", "vol_24h": "980M", "dominance": "1.3%"}
        ]
