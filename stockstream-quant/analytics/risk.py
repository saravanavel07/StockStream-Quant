"""
STOCKSTREAM QUANT — Quantitative Risk Assessment Engine
Computes Value at Risk (VaR), Conditional VaR, Downside Deviation, and Beta Exposure.
"""

import math
from typing import List, Dict, Any

class RiskEvaluator:
    """Institutional portfolio and asset risk analytics."""

    @staticmethod
    def calculate_var_cvar(returns: List[float], confidence: float = 0.95) -> Dict[str, float]:
        """
        Calculates Historical Value at Risk (VaR) and Expected Shortfall (CVaR).
        """
        if not returns or len(returns) < 10:
            return {"var_pct": 2.5, "cvar_pct": 3.8}

        sorted_returns = sorted(returns)
        cutoff_index = int(math.floor((1.0 - confidence) * len(sorted_returns)))
        cutoff_index = max(0, min(cutoff_index, len(sorted_returns) - 1))
        
        var_val = -sorted_returns[cutoff_index]
        tail_losses = [-r for r in sorted_returns[:cutoff_index + 1]]
        cvar_val = sum(tail_losses) / len(tail_losses) if tail_losses else var_val

        return {
            "var_pct": round(var_val * 100, 2),
            "cvar_pct": round(cvar_val * 100, 2),
            "confidence_level": confidence
        }

    @staticmethod
    def calculate_beta(asset_returns: List[float], benchmark_returns: List[float]) -> float:
        """
        Calculates Beta coefficient: Cov(asset, benchmark) / Var(benchmark).
        """
        min_len = min(len(asset_returns), len(benchmark_returns))
        if min_len < 10:
            return 1.0

        r_a = asset_returns[:min_len]
        r_b = benchmark_returns[:min_len]

        mean_a = sum(r_a) / min_len
        mean_b = sum(r_b) / min_len

        cov = sum((a - mean_a) * (b - mean_b) for a, b in zip(r_a, r_b)) / (min_len - 1)
        var_b = sum((b - mean_b) ** 2 for b in r_b) / (min_len - 1)

        if var_b == 0:
            return 1.0

        return round(cov / var_b, 2)
