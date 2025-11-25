const axios = require('axios');
const { NASA_API_KEY, NASA_BASE_URL } = require('../config/env');

class NASAClient {
  constructor() {
    this.baseURL = NASA_BASE_URL;
    this.apiKey = NASA_API_KEY;
  }

  async fetchAPOD(params = {}) {
    try {
      const response = await axios.get(`${this.baseURL}/planetary/apod`, {
        params: {
          api_key: this.apiKey,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw {
          status: error.response.status,
          message: error.response.data.msg || 'NASA API error'
        };
      }
      throw {
        status: 500,
        message: 'Failed to connect to NASA API'
      };
    }
  }

  normalizeAPOD(data) {
    return {
      date: data.date,
      title: data.title,
      explanation: data.explanation,
      mediaType: data.media_type,
      url: data.url,
      hdUrl: data.hdurl || null,
      copyright: data.copyright || null
    };
  }
}

module.exports = new NASAClient();
