const nasaClient = require('../utils/nasaClient');
const cache = require('../utils/cache');

class APODService {
  async getTodayAPOD(hd = false) {
    const cacheKey = cache.generateKey('today', { hd });
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const params = hd ? { thumbs: true } : {};
    const data = await nasaClient.fetchAPOD(params);
    const normalized = nasaClient.normalizeAPOD(data);
    
    cache.set(cacheKey, normalized);
    return normalized;
  }

  async getAPODByDate(date) {
    if (!this.isValidDate(date)) {
      throw {
        status: 400,
        message: 'Invalid date format. Use YYYY-MM-DD'
      };
    }

    const cacheKey = cache.generateKey('by-date', { date });
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const data = await nasaClient.fetchAPOD({ date });
    const normalized = nasaClient.normalizeAPOD(data);
    
    cache.set(cacheKey, normalized);
    return normalized;
  }

  async getRecentAPODs(days = 10) {
    const numDays = Math.min(Math.max(parseInt(days) || 10, 1), 30);
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (numDays - 1));

    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };

    const start = formatDate(startDate);
    const end = formatDate(endDate);

    const cacheKey = cache.generateKey('recent', { start, end });
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const data = await nasaClient.fetchAPOD({
      start_date: start,
      end_date: end
    });

    const normalized = Array.isArray(data)
      ? data.map(item => nasaClient.normalizeAPOD(item)).reverse()
      : [nasaClient.normalizeAPOD(data)];
    
    cache.set(cacheKey, normalized);
    return normalized;
  }

  isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
      return false;
    }
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }
}

module.exports = new APODService();
