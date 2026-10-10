"""
STOCKSTREAM QUANT — Plotly Financial Chart Factory
Generates interactive candlesticks, volume subplots, technical overlays, and forecast cones.
"""

from typing import List, Dict, Any, Optional

def create_candlestick_chart(
    symbol: str,
    bars: List[Dict[str, Any]],
    show_volume: bool = True,
    show_bb: bool = True,
    forecast_data: Optional[Dict[str, Any]] = None
):
    """
    Constructs an institutional Plotly figure dictionary for Streamlit or Plotly rendering.
    """
    import plotly.graph_objects as go
    from plotly.subplots import make_subplots

    if not bars:
        fig = go.Figure()
        fig.update_layout(title="No data available")
        return fig

    dates = [b["timestamp"] for b in bars]
    opens = [b["open"] for b in bars]
    highs = [b["high"] for b in bars]
    lows = [b["low"] for b in bars]
    closes = [b["close"] for b in bars]
    volumes = [b["volume"] for b in bars]

    fig = make_subplots(
        rows=2 if show_volume else 1,
        cols=1,
        shared_xaxes=True,
        vertical_spacing=0.03,
        row_heights=[0.75, 0.25] if show_volume else [1.0]
    )

    # Candlestick
    fig.add_trace(
        go.Candlestick(
            x=dates,
            open=opens,
            high=highs,
            low=lows,
            close=closes,
            name="OHLC",
            increasing_line_color="#10B981", # Emerald
            decreasing_line_color="#EF4444"  # Crimson
        ),
        row=1, col=1
    )

    # Volume
    if show_volume:
        vol_colors = ["#10B981" if c >= o else "#EF4444" for c, o in zip(closes, opens)]
        fig.add_trace(
            go.Bar(
                x=dates,
                y=volumes,
                name="Volume",
                marker_color=vol_colors,
                opacity=0.6
            ),
            row=2, col=1
        )

    # Forecast projection cone if supplied
    if forecast_data and "projections" in forecast_data:
        last_date = dates[-1]
        last_price = closes[-1]
        proj_1d = forecast_data["projections"].get("1D")
        proj_5d = forecast_data["projections"].get("5D")
        
        if proj_5d:
            # Future point projection
            fig.add_trace(
                go.Scatter(
                    x=[last_date, "T+5D"],
                    y=[last_price, proj_5d["expected_price"]],
                    mode="lines+markers",
                    name="Expected Path",
                    line=dict(color="#F59E0B", width=2, dash="dot")
                ),
                row=1, col=1
            )

    fig.update_layout(
        template="plotly_dark",
        paper_bgcolor="#060B18",
        plot_bgcolor="#0B1528",
        margin=dict(l=10, r=10, t=30, b=10),
        xaxis_rangeslider_visible=False,
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
        font=dict(family="JetBrains Mono, sans-serif", color="#E2E8F0")
    )

    return fig
