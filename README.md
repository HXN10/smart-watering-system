# Smart Watering System

Full-stack web application for managing plants and monitoring soil moisture levels with ESP32 sensor integration.

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Database**: MongoDB (with in-memory fallback)
- **Development**: Nodemon, Docker Compose

## Project Structure

```
Watering system web/
├── frontend/                    # Frontend application
│   ├── dashboard.html          # Main dashboard
│   ├── login.html              # Authentication page
│   ├── admin.html              # Database viewer
│   ├── frontend/assets/js/     # JavaScript modules
│   └── styles/main.css         # Stylesheet
│
├── smart-watering-system/
│   ├── backend/                # Express API server
│   │   ├── src/
│   │   │   ├── models/         # Mongoose schemas
│   │   │   ├── controllers/    # Business logic
│   │   │   ├── routes/         # API endpoints
│   │   │   ├── app.js          # Express configuration
│   │   │   └── server.js       # Server entry point
│   │   └── package.json
│   └── docker-compose.yml      # MongoDB service
│
└── start-dev.sh                # Development startup script
```

## Prerequisites

- Node.js 18+
- Python 3 (for frontend server)
- Docker (optional, for MongoDB)
- MongoDB (optional, can use Docker)

## Installation

### 1. Install Dependencies

```bash
cd smart-watering-system/backend
npm install
```

### 2. Configure Environment

Create `smart-watering-system/backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/watering
```

**Note:** MongoDB connection is required. The server will exit if MongoDB is unavailable.

### 3. Start MongoDB (Optional)

Using Docker:
```bash
cd smart-watering-system
docker-compose up mongo -d
```

Or install MongoDB locally and ensure it's running on port 27017.

## Usage

### Development Mode

Start both servers:
```bash
./start-dev.sh
```

Or manually:

**Terminal 1 - Frontend:**
```bash
cd frontend
python3 -m http.server 8000
```

**Terminal 2 - Backend:**
```bash
cd smart-watering-system/backend
npm run dev
```

### Access Points

- Frontend: http://localhost:8000/login.html
- Backend API: http://localhost:3001/health
- Admin Dashboard: http://localhost:8000/admin.html

### Default Credentials

- Email: `demo@demo.com`
- Password: `123456`

## API Endpoints

### Authentication

- `POST /api/login` - User login
- `POST /api/signup` - User registration

### Plants

- `GET /api/plants` - Get all plants for authenticated user
- `POST /api/plants` - Create new plant
- `PUT /api/plants/:id` - Update plant (name, autoWater, sensorData)
- `DELETE /api/plants/:id` - Delete plant

### Admin

- `GET /api/admin/db` - View database contents (development only)

## Data Models

### User

```javascript
{
  email: String (unique, lowercase),
  password: String (minlength: 6),
  createdAt: Date
}
```

### Plant

```javascript
{
  userId: String (indexed),
  name: String,
  autoWater: Boolean,
  sensorData: {
    soilMoisture: Number (0-100, nullable),
    tankLevel: Number (0-100, nullable),
    lastUpdated: Date
  },
  createdAt: Date
}
```

## ESP32 Integration

Update sensor data for a plant:

```bash
PUT /api/plants/:id
Authorization: token-{email}-{timestamp}
Content-Type: application/json

{
  "sensorData": {
    "soilMoisture": 65,
    "tankLevel": 80
  }
}
```

## Architecture

### Authentication

Tokens are embedded with user email: `token-{email}-{timestamp}`. The backend extracts the email from the token to identify the user. Tokens are stored in browser localStorage.

### Data Persistence

MongoDB is required. The server will not start without a valid MongoDB connection. All data is persisted to the database.

### CORS Configuration

CORS is configured to allow all origins in development. For production, restrict to specific domains.

## Development

### Backend

```bash
cd smart-watering-system/backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend

Static files served via Python HTTP server. Edit files and refresh browser.

### Database Access

```bash
mongosh mongodb://localhost:27017/watering
```

Or use MongoDB Compass GUI.

## Deployment

### Docker Compose

```bash
cd smart-watering-system
docker-compose up -d
```

Starts MongoDB, backend, and frontend services.

### Production Considerations

- Implement password hashing (bcrypt)
- Use JWT tokens instead of simple token strings
- Add input validation and sanitization
- Configure CORS for specific origins
- Use environment variables for secrets
- Add rate limiting
- Implement proper error handling
- Use HTTPS

## Troubleshooting

**Backend not responding:**
```bash
curl http://localhost:3001/health
# Should return: {"status":"OK","service":"Smart Watering Backend"}
```

**Frontend not loading:**
```bash
curl http://localhost:8000/login.html
# Should return HTML content
```

**Server won't start:**
- MongoDB connection is required
- Verify MongoDB is running: `docker-compose ps mongo` or `mongosh mongodb://localhost:27017`
- Check `.env` file has `MONGO_URI` set
- Server will exit with error if MongoDB is unavailable

**"Failed to fetch" errors:**
- Clear browser localStorage token
- Log out and log back in
- Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)

See `TROUBLESHOOTING.md` for detailed solutions.

## License

MIT License
