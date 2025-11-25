# NASA APOD Explorer

![Version](https://img.shields.io/badge/version-3.1.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-19.0.0-61DAFB)
![Vite](https://img.shields.io/badge/vite-6.4.1-646CFF)
![License](https://img.shields.io/badge/license-MIT-green)

A full-stack web application that explores NASA's Astronomy Picture of the Day (APOD) API. View stunning space imagery, browse past APODs, and discover the wonders of our universe through NASA's curated collection.

This project demonstrates a complete full-stack architecture with a Node.js/Express REST API backend and a modern React frontend, featuring intelligent caching, responsive design, and clean separation of concerns.

## Tech Stack

### Backend
- **Node.js 18+** with **Express 4.21.2** - RESTful API server
- **Axios 1.7.9** - HTTP client for NASA API calls
- **dotenv 16.4.7** - Environment variable management
- **CORS 2.8.5** - Cross-origin resource sharing
- **Custom in-memory cache** - TTL-based caching with FIFO eviction

### Frontend
- **React 19** - Latest UI framework with improved performance
- **Vite 6** - Next-generation build tool with lightning-fast HMR
- **CSS3** - Responsive styling with mobile-first design
- **Fetch API** - HTTP requests to backend

## Features

### Core Features
- **Today's APOD** - Automatic display of the current day's astronomy picture
- **Date Picker** - Browse APODs from any past date
- **Smart Caching** - In-memory cache with 10-minute TTL and 100-entry max
- **Media Support** - Handles both images and embedded videos
- **Fully Responsive** - Mobile-first design that works on all devices

### UI/UX Enhancements (v3.1.0)
- 🎨 **Dark/Light Theme Toggle** - Seamlessly switch between themes with persistent preferences
- 🔍 **Image Zoom & Pan** - Advanced image viewer with zoom controls, mouse wheel support, and drag-to-pan
- 🎬 **Slideshow Mode** - Auto-playing slideshow with customizable speed (2s/3s/5s) and keyboard navigation
- ♾️ **Infinite Scroll** - Automatically loads more APODs as you scroll through the gallery
- 🎯 **Media Type Filters** - Filter gallery by images only, videos only, or view all
- 🖼️ **Enhanced Gallery** - Hover effects, overlay controls, and quick actions for each card
- ⌨️ **Keyboard Shortcuts** - Navigate slideshow (←/→), zoom (±/0), play/pause (Space), close (Esc)

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
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

## Changelog

### Version 3.1.0 (November 2025)
**Major UI/UX Enhancement Update - New interactive features and dark mode:**

#### New Features
- **🎨 Dark/Light Theme Toggle** - Persistent theme switcher with smooth transitions and localStorage support
- **🔍 Image Zoom & Pan** - Advanced image viewer with:
  - Mouse wheel zoom (up to 5x magnification)
  - Click and drag to pan when zoomed
  - Keyboard shortcuts (+, -, 0 for zoom in/out/reset)
  - Reset button and zoom level indicator
- **🎬 Slideshow Mode** - Full-featured slideshow with:
  - Customizable speed (2s, 3s, or 5s intervals)
  - Auto-play with play/pause control
  - Keyboard navigation (arrows, space, esc)
  - Thumbnail navigation bar
  - Start from any image in gallery
- **♾️ Infinite Scroll** - Automatic loading of more APODs as you scroll
- **🎯 Media Type Filters** - Quick filter buttons for All/Images/Videos with counts
- **🖼️ Enhanced Gallery Cards** - Hover overlays with zoom and slideshow quick actions

#### Technical Improvements
- Implemented React Context API for theme management
- Added CSS custom properties for theme variables
- Intersection Observer API for efficient infinite scroll
- Optimized re-renders with useCallback and proper dependencies
- Responsive design improvements for all new features

### Version 3.0.0 (November 2025)
**Major upgrade to React 19, Vite 6, and latest dependencies with zero vulnerabilities:**

#### Backend Updates
- Upgraded Express to 4.21.2 (latest stable with security patches)
- Upgraded Axios to 1.7.9 (improved performance and bug fixes)
- Upgraded dotenv to 16.4.7 (enhanced environment variable handling)
- Upgraded nodemon to 3.1.11 (better watch mode and stability)
- Updated Node.js requirement to >=18.0.0 and npm to >=9.0.0

#### Frontend Updates
- **Upgraded React to 19.0.0** (major version with improved performance and concurrent features)
- **Upgraded Vite to 6.4.1** (next-generation build tool with faster HMR and better optimization)
- Upgraded @vitejs/plugin-react to 4.3.4 (React 19 support)
- Updated @types packages to 19.0.2 for React 19 compatibility
- Updated Node.js requirement to >=18.0.0 and npm to >=9.0.0

#### Security & Performance
- ✅ **Zero vulnerabilities** in npm audit
- Fixed all moderate severity CVEs in previous esbuild/vite versions
- Improved build performance with Vite 6 optimizations
- Enhanced React rendering with new concurrent features in React 19

#### Compatibility
- Fully tested with Node.js 18+ and npm 9+
- Production build validated and working
- All features maintain backward compatibility

### Version 2.0.0 (2025)
**Major dependency upgrades and modernization:**

#### Backend Updates
- Upgraded Express from 4.18.2 to 4.21.1 (improved security and performance)
- Upgraded Axios from 1.6.2 to 1.7.7 (enhanced HTTP client features)
- Upgraded dotenv from 16.3.1 to 16.4.5 (improved environment variable handling)
- Upgraded nodemon from 3.0.2 to 3.1.7 (better dev experience)
- Added Node.js >=16.0.0 and npm >=7.0.0 engine requirements

#### Frontend Updates
- Upgraded React from 18.2.0 to 18.3.1 (latest stable with performance improvements)
- Upgraded Vite from 5.0.8 to 5.4.11 (faster builds and HMR)
- Upgraded @vitejs/plugin-react from 4.2.1 to 4.3.3
- Updated all @types packages for better TypeScript support
- Added Node.js >=16.0.0 and npm >=7.0.0 engine requirements

#### Features & Improvements
- Enhanced UI/UX with modern CSS animations and glassmorphism effects
- Improved responsive design with mobile-first approach
- Fixed video playback with proper iframe permissions
- Enhanced modal contrast for better accessibility
- Comprehensive documentation improvements
- Added MIT License for open-source distribution

### Version 1.0.0 (2023)
**Initial Release**
- Complete backend REST API with NASA APOD integration
- React frontend with responsive design
- Intelligent caching system (10-min TTL, 100-entry max)
- Support for images and videos
- Date-based browsing and gallery view

## Credits

Data provided by NASA's Astronomy Picture of the Day API.

## Author

**Devansh0908**
- GitHub: [@Devansh0908](https://github.com/Devansh0908)

---

⭐ If you found this project helpful, please consider giving it a star!
