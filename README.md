# Ride-Sharing Optimization Platform

## Project Overview
The Ride-Sharing Optimization Platform is a full-stack application designed to manage drivers, riders, rides, and zones in a distributed environment. The platform leverages **CockroachDB** for distributed database management, **Flask** for backend API development, and **React.js** for the frontend interface. It supports real-time ride requests, driver allocation, and demand-based zone scoring.

---

## Features
- Full CRUD operations for Drivers, Riders, Rides, and Zones.
- Geospatial data handling using `ST_GeogPoint` in CockroachDB.
- RESTful APIs for real-time ride requests and driver allocation.
- Scalable backend with ACID-compliant transactions.
- Dynamic frontend built with React.js for user interaction.

---

## Tech Stack
- **Backend**: Flask, Python
- **Database**: CockroachDB (distributed SQL database)
- **Frontend**: React.js
- **Deployment**: AWS EC2 (backend), CockroachDB Cloud (database)

---

## Prerequisites
Ensure you have the following installed:
1. **Python 3.10+**
2. **Node.js (v16 or higher)**
3. **npm or Yarn**
4. **CockroachDB Cloud Account**

---

## Setup Instructions

### 1. Clone the Repository
```
git clone <repository-url>
cd ride-sharing-app
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend/
   ```

2. Install Python dependencies:
   ```
   pip3 install -r requirements.txt
   ```

3. Create a `.env` file in the `backend/` directory with the following content:
   ```
   DB_NAME=ride_sharing_db
   DB_USER=<your_cockroachdb_username>
   DB_PASSWORD=<your_cockroachdb_password>
   DB_HOST=<your_cockroachdb_host>
   DB_PORT=26257
   ```

4. Run the Flask server:
   ```
   python3 app.py
   ```

The backend will be accessible at `http://127.0.0.1:5000`.

---

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd ../ride-sharing-frontend/
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the React development server:
   ```
   npm start
   ```

The frontend will be accessible at `http://localhost:3000`.

---

## API Documentation

### Drivers Endpoints
1. **Create Driver**  
   `POST /drivers`  
   Request Body:
   ```
   {
       "name": "John Doe",
       "latitude": 37.7749,
       "longitude": -122.4194,
       "availability": true,
       "rating": 4.8
   }
   ```
   
2. **Get All Drivers**  
   `GET /drivers`  

3. **Update Driver Availability**  
   `PUT /drivers/<driver_id>`  
   Request Body:
   ```
   {
       "availability": false
   }
   ```

4. **Delete Driver**  
   `DELETE /drivers/<driver_id>`

---

### Riders Endpoints
1. **Create Rider**  
   `POST /riders`  
   Request Body:
   ```
   {
       "name": "Jane Smith",
       "pickup_latitude": 37.7749,
       "pickup_longitude": -122.4194,
       "dropoff_latitude": 37.7849,
       "dropoff_longitude": -122.4094
   }
   ```

2. **Get All Riders**  
   `GET /riders`  

3. **Update Rider Name**  
   `PUT /riders/<rider_id>`  
   Request Body:
   ```
   {
       "new_name": "Updated Rider Name"
   }
   ```

4. **Delete Rider**  
   `DELETE /riders/<rider_id>`

---

### Rides Endpoints
1. **Create Ride**  
   `POST /rides`  
   Request Body:
   ```
   {
       "driver_id": "<driver_id>",
       "rider_id": "<rider_id>",
       "status": "requested",
       "fare": 25.5
   }
   ```

2. **Get All Rides**  
   `GET /rides`  

3. **Update Ride Status**  
   `PUT /rides/<ride_id>`  
   Request Body:
   ```
   {
       "status": "completed"
   }
   ```

4. **Delete Ride**  
    `DELETE /rides/<ride_id>`

---

### Zones Endpoints
1. **Create Zone**  
    `POST /zones`  
    Request Body:
    ```
    {
        "region_name": "Downtown",
        "demand_score": 50.0
    }
    ```

2. **Get All Zones**  
    `GET /zones`  

3. **Update Zone Demand Score**  
    `PUT /zones/<zone_id>`  
    Request Body:
    ```
    {
        "demand_score": 75.0
    }
    ```

4. **Delete Zone**  
    `DELETE /zones/<zone_id>`

---

## Testing Instructions

### Backend Unit Tests (Pytest)
1. Navigate to the backend directory:
    ```
    cd backend/
    ```

2. Run tests using Pytest:
    ```
    pytest tests/ --disable-warnings
    ```

### Frontend Testing (Manual)
1. Start both the backend (`python3 app.py`) and frontend (`npm start`) servers.
2. Visit the following routes in your browser to test functionality:
    - `/drivers`
    - `/riders`
    - `/rides`
    - `/zones`
3. Test creating, updating, and deleting records through the forms.

---

## Future Enhancements

1. Add authentication using JWT to secure endpoints.
2. Implement real-time ride updates using WebSockets.
3. Enhance frontend UI with mapping libraries like Leaflet.js or Google Maps API to visualize driver and rider locations.

---
