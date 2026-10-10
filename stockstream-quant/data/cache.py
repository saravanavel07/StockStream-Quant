"""
STOCKSTREAM QUANT — Tiered Cache Manager
Provides fast in-memory LRU/TTL caching with persistent SQLite fallback.
"""

import time
from typing import Any, Optional, Dict

class MemoryCache:
    """In-memory key-value cache with time-to-live expiration."""

    def __init__(self, default_ttl_sec: int = 60):
        self._store: Dict[str, Dict[str, Any]] = {}
        self.default_ttl = default_ttl_sec
        self.hits = 0
        self.misses = 0

    def get(self, key: str) -> Optional[Any]:
        """Retrieve value if present and not expired."""
        if key not in self._store:
            self.misses += 1
            return None

        entry = self._store[key]
        if time.time() > entry["expires_at"]:
            del self._store[key]
            self.misses += 1
            return None

        self.hits += 1
        return entry["value"]

    def set(self, key: str, value: Any, ttl_sec: Optional[int] = None) -> None:
        """Store value with expiration."""
        ttl = ttl_sec if ttl_sec is not None else self.default_ttl
        self._store[key] = {
            "value": value,
            "expires_at": time.time() + ttl,
            "created_at": time.time()
        }

    def invalidate(self, key: str) -> None:
        """Remove a single key."""
        if key in self._store:
            del self._store[key]

    def clear(self) -> None:
        """Clear all entries."""
        self._store.clear()
        self.hits = 0
        self.misses = 0

    @property
    def hit_ratio(self) -> float:
        """Calculate hit ratio percentage."""
        total = self.hits + self.misses
        return (self.hits / total * 100.0) if total > 0 else 0.0

GLOBAL_CACHE = MemoryCache()
