from typing import Any, Optional
from datetime import datetime, timedelta
from collections import OrderedDict

class Cache:
    def __init__(self, max_size: int = 100, ttl: int = 600):
        self.max_size = max_size
        self.ttl = ttl
        self.cache: OrderedDict = OrderedDict()
    
    def _is_expired(self, timestamp: datetime) -> bool:
        return datetime.now() > timestamp + timedelta(seconds=self.ttl)
    
    def get(self, key: str) -> Optional[Any]:
        if key not in self.cache:
            return None
        
        data, timestamp = self.cache[key]
        
        if self._is_expired(timestamp):
            del self.cache[key]
            return None
        
        # Move to end (most recently used)
        self.cache.move_to_end(key)
        return data
    
    def set(self, key: str, value: Any) -> None:
        if key in self.cache:
            del self.cache[key]
        
        self.cache[key] = (value, datetime.now())
        
        # Evict oldest if over max size (FIFO)
        if len(self.cache) > self.max_size:
            self.cache.popitem(last=False)
    
    def clear(self) -> None:
        self.cache.clear()
    
    def size(self) -> int:
        return len(self.cache)

# Global cache instance
cache = Cache()
