"""
STOCKSTREAM QUANT — Real-Time Alert Evaluation Service
Monitors price limits, volatility surges, and indicator threshold triggers.
"""

from typing import List, Dict, Any

class AlertService:
    """Evaluates active rules against incoming asset telemetry."""

    @staticmethod
    def evaluate_price_rule(alert: Dict[str, Any], current_price: float, current_rsi: float = 50.0) -> Dict[str, Any]:
        """
        Tests if a condition has breached its trigger threshold.
        """
        c_type = alert["condition_type"]
        threshold = alert["threshold_value"]
        triggered = False
        message = ""

        if c_type == "PRICE_ABOVE" and current_price >= threshold:
            triggered = True
            message = f"{alert['symbol']} price reached ${current_price:.2f} (Target >= ${threshold:.2f})"
        elif c_type == "PRICE_BELOW" and current_price <= threshold:
            triggered = True
            message = f"{alert['symbol']} price fell to ${current_price:.2f} (Support <= ${threshold:.2f})"
        elif c_type == "RSI_OVERBOUGHT" and current_rsi >= threshold:
            triggered = True
            message = f"{alert['symbol']} RSI breached overbought threshold: {current_rsi:.1f} >= {threshold:.1f}"
        elif c_type == "RSI_OVERSOLD" and current_rsi <= threshold:
            triggered = True
            message = f"{alert['symbol']} RSI dipped to oversold level: {current_rsi:.1f} <= {threshold:.1f}"

        return {
            "alert_id": alert.get("id"),
            "symbol": alert["symbol"],
            "triggered": triggered,
            "message": message,
            "current_price": current_price
        }
