import pytest
from app import app

@pytest.fixture
def client():
    """Fixture to set up the Flask test client."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

# ------------------------
# Unit Tests for Rides Endpoints
# ------------------------

def test_add_ride(client):
    """Test POST /rides (valid request)."""
    # First, create a driver and a rider to associate with the ride.
    driver_response = client.post('/drivers', json={
        "name": "Driver For Ride",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "availability": True,
        "rating": 4.8
    })
    driver_id = driver_response.json["driver_id"]

    rider_response = client.post('/riders', json={
        "name": "Rider For Ride",
        "pickup_latitude": 37.7749,
        "pickup_longitude": -122.4194,
        "dropoff_latitude": 37.7849,
        "dropoff_longitude": -122.4094
    })
    rider_id = rider_response.json["rider_id"]

    # Create a ride.
    response = client.post('/rides', json={
        "driver_id": driver_id,
        "rider_id": rider_id,
        "status": "requested",
        "fare": 25.5
    })
    assert response.status_code == 200
    assert "ride_id" in response.json

def test_list_rides(client):
    """Test GET /rides."""
    response = client.get('/rides')
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_update_ride(client):
    """Test PUT /rides/<ride_id>."""
    # First, create a driver, rider, and a ride.
    driver_response = client.post('/drivers', json={
        "name": "Driver For Update",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "availability": True,
        "rating": 4.8
    })
    driver_id = driver_response.json["driver_id"]

    rider_response = client.post('/riders', json={
        "name": "Rider For Update",
        "pickup_latitude": 37.7749,
        "pickup_longitude": -122.4194,
        "dropoff_latitude": 37.7849,
        "dropoff_longitude": -122.4094
    })
    rider_id = rider_response.json["rider_id"]

    ride_response = client.post('/rides', json={
        "driver_id": driver_id,
        "rider_id": rider_id,
        "status": "requested",
        "fare": 20.0
    })
    ride_id = ride_response.json["ride_id"]

    # Update the ride's status.
    response = client.put(f'/rides/{ride_id}', json={
        "status": "completed"
    })
    assert response.status_code == 200
    assert response.json["message"] == f"Ride {ride_id} updated"

def test_delete_ride(client):
    """Test DELETE /rides/<ride_id>."""
    # First, create a driver, rider, and a ride to delete.
    driver_response = client.post('/drivers', json={
        "name": "Driver For Delete",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "availability": True,
        "rating": 4.8
    })
    driver_id = driver_response.json["driver_id"]

    rider_response = client.post('/riders', json={
        "name": "Rider For Delete",
        "pickup_latitude": 37.7749,
        "pickup_longitude": -122.4194,
        "dropoff_latitude": 37.7849,
        "dropoff_longitude": -122.4094
    })
    rider_id = rider_response.json["rider_id"]

    ride_response = client.post('/rides', json={
        "driver_id": driver_id,
        "rider_id": rider_id,
        "status": "requested",
        "fare": 30.0
    })
    ride_id = ride_response.json["ride_id"]

    # Delete the ride.
    response = client.delete(f'/rides/{ride_id}')
    assert response.status_code == 200
    assert response.json["message"] == f"Ride {ride_id} deleted"
