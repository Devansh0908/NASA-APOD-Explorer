require('dotenv').config();

const NASA_API_KEY = process.env.NASA_API_KEY;
const PORT = process.env.PORT || 5000;
const NASA_BASE_URL = 'https://api.nasa.gov';

if (!NASA_API_KEY) {
  throw new Error('NASA_API_KEY is required in .env file');
}

module.exports = {
  NASA_API_KEY,
  PORT,
  NASA_BASE_URL
};
