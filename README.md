# NASA APOD Explorer

A full-stack web application that explores NASA's Astronomy Picture of the Day (APOD) API. View stunning space imagery, browse past APODs, and discover the wonders of our universe through NASA's curated collection.

This project demonstrates a complete full-stack architecture with a Node.js/Express REST API backend and a modern React frontend, featuring intelligent caching, responsive design, and clean separation of concerns.

## Tech Stack

### Backend
- **Node.js** with **Express** - RESTful API server
- **Axios** - HTTP client for NASA API calls
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing
- **Custom in-memory cache** - TTL-based caching with LRU eviction

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **CSS3** - Responsive styling with mobile-first design
- **Fetch API** - HTTP requests to backend

## Features

- 📸 **Today's APOD** - Automatic display of the current day's astronomy picture
- 📅 **Date Picker** - Browse APODs from any past date
- 🖼️ **Recent Gallery** - Grid view of the last 10 days with clickable cards
- 🔍 **Detailed Modal** - Full-screen view with complete descriptions
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- ⚡ **Smart Caching** - In-memory cache with 10-minute TTL and 100-entry max
- 🎥 **Media Support** - Handles both images and embedded videos

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)
- NASA API Key (free from [api.nasa.gov](https://api.nasa.gov/))

### Clone the Repository

```bash
git clone https://github.com/Devansh0908/NASA-APOD-Explorer.git
cd NASA-APOD-Explorer
```

### Environment Variables

1. Navigate to the `backend` folder:
   ```
   cd backend
   ```

2. Create a `.env` file in the `backend` folder with your NASA API key:
   ```
   NASA_API_KEY=your_nasa_api_key_here
   PORT=5000
   ```

   **Get Your API Key**: Visit [NASA API Portal](https://api.nasa.gov/) to obtain a free API key.
   
   **Security Note**: The `.env` file is ignored by git (see `.gitignore`). Never commit API keys to version control.

### Backend Installation & Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server (with hot reload):
   ```
   npm run dev
   ```

   Or start production server:
   ```
   npm start
   ```

4. The backend will run at `http://localhost:5000`

5. Verify health: `http://localhost:5000/api/health`

### Frontend Installation & Setup

1. Open a new terminal and navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. The frontend will run at `http://localhost:3000`

5. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

The backend exposes the following REST API endpoints:

### Health Check
- **GET** `/api/health`
  - Returns: `{ status: "ok" }`
  - Used to verify server is running

### APOD Endpoints

All endpoints return a normalized JSON response:
```json
{
  "date": "YYYY-MM-DD",
  "title": "string",
  "explanation": "string",
  "mediaType": "image|video",
  "url": "string",
  "hdUrl": "string|null",
  "copyright": "string|null"
}
```

#### 1. Get Today's APOD
- **GET** `/api/apod/today`
- **Query Parameters**:
  - `hd` (optional): `true` or `false` - Request HD image when available
- **Example**: `/api/apod/today?hd=true`

#### 2. Get APOD by Date
- **GET** `/api/apod/by-date?date=YYYY-MM-DD`
- **Query Parameters**:
  - `date` (required): Date in `YYYY-MM-DD` format
- **Example**: `/api/apod/by-date?date=2024-01-15`
- **Error**: Returns `400` if date is missing or invalid

#### 3. Get Recent APODs
- **GET** `/api/apod/recent?days=N`
- **Query Parameters**:
  - `days` (optional): Number of days (default: 10, max: 30)
- **Returns**: Array of APOD objects sorted by most recent first
- **Example**: `/api/apod/recent?days=15`

## Caching Behavior

The backend implements an intelligent in-memory caching system:

- **TTL (Time-to-Live)**: 10 minutes
- **Max Size**: 100 entries
- **Eviction Policy**: FIFO (First-In-First-Out) when cache is full
- **Cache Keys**: Based on endpoint type and parameters
  - Example: `today::hd:true`, `by-date::date:2024-01-15`, `recent::start:2024-01-01|end:2024-01-10`

### How It Works
1. On each API request, the cache is checked first
2. If found and not expired (< 10 minutes old), cached data is returned
3. On cache miss, NASA API is called
4. Response is stored in cache with timestamp
5. When cache reaches 100 entries, oldest entry is removed

This reduces NASA API calls, improves response times, and respects API rate limits.

## Architecture

This application follows REST API principles and runs completely locally:

- **Backend**: RESTful API server that acts as a proxy to NASA's API
- **Frontend**: Single-page application that communicates only with the local backend
- **Separation of Concerns**: Clean architecture with routes, controllers, services, and utilities
- **Security**: API keys never exposed to frontend; all external API calls handled server-side
- **Performance**: Smart caching reduces latency and external API calls

## Project Structure

```
nasa-apod-explorer/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js              # Environment configuration
│   │   ├── controllers/
│   │   │   └── apodController.js   # Request handlers
│   │   ├── routes/
│   │   │   └── apodRoutes.js       # API route definitions
│   │   ├── services/
│   │   │   └── apodService.js      # Business logic & caching
│   │   ├── utils/
│   │   │   ├── cache.js            # Cache implementation
│   │   │   └── nasaClient.js       # NASA API client
│   │   ├── app.js                  # Express app setup
│   │   └── server.js               # Server entry point
│   ├── .env                        # Environment variables (not in git)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Header.jsx      # App header
│   │   │   │   ├── Header.css
│   │   │   │   ├── Footer.jsx      # App footer
│   │   │   │   └── Footer.css
│   │   │   └── Apod/
│   │   │       ├── TodayApod.jsx           # Today's APOD component
│   │   │       ├── TodayApod.css
│   │   │       ├── DatePickerApod.jsx      # Date picker component
│   │   │       ├── DatePickerApod.css
│   │   │       ├── ApodGallery.jsx         # Gallery grid component
│   │   │       ├── ApodGallery.css
│   │   │       ├── ApodDetailModal.jsx     # Detail modal component
│   │   │       └── ApodDetailModal.css
│   │   ├── config/
│   │   │   └── api.js              # API base URL configuration
│   │   ├── styles/
│   │   │   └── globals.css         # Global styles
│   │   ├── App.jsx                 # Main app component
│   │   ├── App.css
│   │   └── main.jsx                # React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

The build creates optimized static files in `frontend/dist/`.

## API Key Security

- API key is stored in `backend/.env` file
- `.env` is listed in `.gitignore` and never committed
- Backend reads key via `process.env.NASA_API_KEY`
- Frontend never has direct access to the NASA API key
- All NASA API calls are proxied through the backend

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Credits

Data provided by NASA's Astronomy Picture of the Day API.

## Author

**Devansh0908**
- GitHub: [@Devansh0908](https://github.com/Devansh0908)

---

⭐ If you found this project helpful, please consider giving it a star!
