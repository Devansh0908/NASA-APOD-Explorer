# NASA APOD Explorer - FastAPI Backend

Modern Python/FastAPI backend for the NASA APOD Explorer application.

## 🚀 Tech Stack

- **Python 3.11+**
- **FastAPI 0.115.5** - Modern async web framework
- **Uvicorn 0.32.1** - Lightning-fast ASGI server
- **HTTPX 0.27.2** - Async HTTP client for NASA API
- **Pydantic 2.10.3** - Data validation and settings management
- **Python-dotenv 1.0.1** - Environment variable management

## 📁 Project Structure

```
backend-fastapi/
├── src/
│   ├── config/
│   │   └── settings.py          # Application settings
│   ├── models/
│   │   └── apod.py              # Pydantic models
│   ├── routers/
│   │   └── apod.py              # API routes
│   ├── services/
│   │   └── nasa_service.py      # NASA API integration
│   ├── utils/
│   │   └── cache.py             # In-memory caching
│   └── main.py                  # FastAPI application
├── run.py                       # Development server runner
├── requirements.txt             # Python dependencies
├── .env.example                 # Example environment variables
└── README.md                    # This file
```

## 🛠️ Setup Instructions

### 1. Prerequisites
- Python 3.11 or higher
- pip (Python package manager)
- NASA API Key (free from [api.nasa.gov](https://api.nasa.gov/))

### 2. Create Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

```bash
# Copy the example environment file
copy .env.example .env   # Windows
cp .env.example .env     # macOS/Linux

# Edit .env and add your NASA API key
```

Edit `.env` file:
```env
NASA_API_KEY=your_actual_api_key_here
PORT=5000
CACHE_TTL=600
CACHE_MAX_SIZE=100
```

### 5. Run Development Server

**Option 1: Using run.py (recommended)**
```bash
python run.py
```

**Option 2: Using uvicorn directly**
```bash
uvicorn src.main:app --reload --port 5000
```

The API will be available at:
- **API**: http://localhost:5000
- **Interactive Docs (Swagger)**: http://localhost:5000/docs
- **Alternative Docs (ReDoc)**: http://localhost:5000/redoc

## 📡 API Endpoints

### Health Check
- **GET** `/api/health`
  - Returns server status and cache statistics
  - Response:
    ```json
    {
      "status": "ok",
      "cache_size": 5,
      "timestamp": "2025-11-25T12:00:00"
    }
    ```

### APOD Endpoints

All endpoints return normalized JSON responses:

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
- **GET** `/api/apod/today?hd=false`
- **Query Parameters**:
  - `hd` (optional, default: false): Request HD version

#### 2. Get APOD by Date
- **GET** `/api/apod/by-date?date=YYYY-MM-DD&hd=false`
- **Query Parameters**:
  - `date` (required): Date in YYYY-MM-DD format
  - `hd` (optional, default: false): Request HD version

#### 3. Get Recent APODs
- **GET** `/api/apod/recent?days=10`
- **Query Parameters**:
  - `days` (optional, default: 10, range: 1-100): Number of recent days

## 🎯 Features

### Smart Caching System
- **TTL-based**: 10-minute cache expiration (configurable)
- **FIFO Eviction**: Oldest entries removed when cache is full
- **Max Size**: 100 entries (configurable)
- **Performance**: Significantly reduces NASA API calls

### Async Architecture
- **Non-blocking I/O**: All API calls are asynchronous
- **High Performance**: Built on ASGI with uvicorn
- **Concurrent Requests**: Handles multiple requests efficiently

### Data Validation
- **Pydantic Models**: Strong typing and validation
- **Automatic Docs**: Self-documenting API with OpenAPI
- **Error Handling**: Comprehensive error responses

### CORS Support
- Configured for frontend at localhost:3000 and localhost:5173
- Supports credentials and all HTTP methods

## 🔧 Configuration

All configuration is done via environment variables in `.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `NASA_API_KEY` | Your NASA API key | Required |
| `PORT` | Server port | 5000 |
| `CACHE_TTL` | Cache TTL in seconds | 600 |
| `CACHE_MAX_SIZE` | Maximum cache entries | 100 |

## 🚨 Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `400`: Bad Request (invalid date format)
- `404`: Not Found (no APOD for date)
- `500`: Internal Server Error
- `503`: Service Unavailable (NASA API error)

## 📊 Monitoring

Access the interactive API documentation:
- **Swagger UI**: http://localhost:5000/docs
- **ReDoc**: http://localhost:5000/redoc

Both provide:
- Complete API schema
- Try-it-out functionality
- Request/response examples
- Data models documentation

## 🧪 Testing

Test the API using the interactive docs or curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Today's APOD
curl http://localhost:5000/api/apod/today

# Specific date
curl "http://localhost:5000/api/apod/by-date?date=2024-01-01"

# Recent APODs
curl "http://localhost:5000/api/apod/recent?days=5"
```

## 🔄 Migration from Express.js

This FastAPI backend is a drop-in replacement for the Node.js/Express backend:
- ✅ Same API endpoints and responses
- ✅ Same caching behavior
- ✅ Same error handling
- ✅ Compatible with existing frontend
- ✅ Improved performance with async/await
- ✅ Better type safety with Pydantic

## 📝 Development

### Adding New Endpoints

1. Define model in `src/models/`
2. Create service method in `src/services/`
3. Add router in `src/routers/`
4. Include router in `src/main.py`

### Code Structure

```python
# Example endpoint structure
@router.get("/endpoint", response_model=ResponseModel)
async def endpoint_function(param: type = Query(...)):
    try:
        data = await Service.method(param)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## 🎉 Advantages of FastAPI

1. **Performance**: One of the fastest Python frameworks
2. **Type Safety**: Automatic validation and serialization
3. **Documentation**: Auto-generated interactive docs
4. **Async/Await**: Native async support
5. **Modern Python**: Uses Python 3.11+ features
6. **Developer Experience**: Excellent autocomplete and error checking

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details

## 👤 Author

**Devansh0908**
- GitHub: [@Devansh0908](https://github.com/Devansh0908)

---

⭐ Part of the NASA APOD Explorer project
