"""
STOCKSTREAM QUANT — Institutional Visual Theme
Applies the Midnight Navy, Deep Ocean Blue, Emerald Green, and Gold Bitcoin styling for Streamlit.
"""

def get_terminal_custom_css() -> str:
    """Returns CSS injection string for Streamlit styling."""
    return """
    <style>
    /* Global dark canvas */
    .stApp {
        background-color: #060B18;
        color: #F8FAFC;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Plus Jakarta Sans", sans-serif;
    }
    
    /* Headers & Typography */
    h1, h2, h3, h4, h5, h6 {
        color: #F8FAFC !important;
        font-weight: 600 !important;
        letter-spacing: -0.02em !important;
    }
    
    /* Monospace tabular metrics */
    .metric-value {
        font-family: "JetBrains Mono", monospace !important;
        font-variant-numeric: tabular-nums !important;
    }
    
    /* Institutional cards */
    .quant-card {
        background: #0B1528;
        border: 1px solid #1E293B;
        border-radius: 8px;
        padding: 18px;
        margin-bottom: 16px;
    }
    
    /* Bitcoin Gold Highlight Card */
    .btc-gold-card {
        background: linear-gradient(135deg, #0B1528 0%, #171E2D 100%);
        border: 1px solid #D97706;
        border-radius: 8px;
        padding: 20px;
    }
    
    /* Streamlit sidebar */
    section[data-testid="stSidebar"] {
        background-color: #070E1F !important;
        border-right: 1px solid #1E293B !important;
    }

    /* Badges & Unboxed metadata */
    .text-emerald { color: #10B981; }
    .text-crimson { color: #EF4444; }
    .text-gold { color: #F59E0B; }
    .text-muted { color: #94A3B8; }
    </style>
    """
