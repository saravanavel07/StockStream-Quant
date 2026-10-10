"""
STOCKSTREAM QUANT — UI Components
HTML string formatters for Streamlit widgets and clean unboxed metadata tags.
"""

from typing import Dict, Any

def render_kpi_card_html(label: str, value: str, change: str, is_positive: bool = True) -> str:
    """Generates clean HTML card without pill clutter."""
    change_color = "#10B981" if is_positive else "#EF4444"
    arrow = "▲" if is_positive else "▼"
    return f"""
    <div style="background:#0B1528; border:1px solid #1E293B; border-radius:6px; padding:14px; min-width:180px;">
        <div style="font-size:12px; color:#94A3B8; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px;">{label}</div>
        <div style="font-size:22px; font-weight:700; color:#F8FAFC; font-family:'JetBrains Mono',monospace;">{value}</div>
        <div style="font-size:12px; color:{change_color}; margin-top:4px; font-weight:500;">{arrow} {change}</div>
    </div>
    """

def render_btc_hero_html(btc_metrics: Dict[str, Any]) -> str:
    """Generates the signature gold Bitcoin hero banner."""
    curr_sym = btc_metrics.get("currency_symbol", "$")
    price = f"{curr_sym}{btc_metrics['converted_price']:,}"
    pct = btc_metrics["change_24h_pct"]
    arrow = "▲" if pct >= 0 else "▼"
    color = "#10B981" if pct >= 0 else "#EF4444"

    return f"""
    <div style="background:linear-gradient(135deg, #091322 0%, #161D2B 100%); border:1px solid #B45309; border-radius:8px; padding:20px; margin-bottom:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
            <div style="display:flex; align-items:center; gap:14px;">
                <div style="width:44px; height:44px; border-radius:50%; background:linear-gradient(135deg, #F59E0B, #B45309); display:flex; align-items:center; justify-content:center; box-shadow:0 0 16px rgba(245, 158, 11, 0.35);">
                    <span style="font-size:24px; font-weight:bold; color:#060B18;">₿</span>
                </div>
                <div>
                    <div style="font-size:14px; color:#FCD34D; font-weight:600; letter-spacing:0.05em;">BITCOIN COMMAND CENTER</div>
                    <div style="font-size:11px; color:#94A3B8;">BTC · Public Blockchain Protocol · 24/7 Global Orderbooks</div>
                </div>
            </div>
            <div style="text-align:right;">
                <div style="font-size:30px; font-weight:800; color:#F8FAFC; font-family:'JetBrains Mono',monospace;">{price}</div>
                <div style="font-size:13px; color:{color}; font-weight:600;">{arrow} {pct}% (24h) · Vol {btc_metrics['volume_24h_usd']}</div>
            </div>
        </div>
    </div>
    """
