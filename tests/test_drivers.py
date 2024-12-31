import pytest
from app import app

@pytest.fixture
def client():
    """Fixture to set up the Flask test client."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

# ------------------------
# Unit Tests for Drivers Endpoints
# ------------------------

def test_add_driver(client):
    """Test POST /drivers (valid request)."""
    response = client.post('/drivers', json={
        "name": "John Doe",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "availability": True,
        "rating": 4.8
    })
    assert response.status_code == 200
    assert "driver_id" in response.json

def test_add_driver_invalid(client):
    """Test POST /drivers (invalid request)."""
    response = client.post('/drivers', json={
        "latitude": 37.7749,
        "longitude": -122.4194,
        "rating": 6.0  # Invalid rating (greater than 5)
    })
    assert response.status_code == 400
    assert "error" in response.json

def test_list_drivers(client):
    """Test GET /drivers."""
    response = client.get('/drivers')
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_get_driver(client):
    """Test GET /drivers/<driver_id>."""
    # First, create a driver to retrieve.
    post_response = client.post('/drivers', json={
        "name": "Jane Doe",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "availability": True,
        "rating": 4.5
    })
    driver_id = post_response.json["driver_id"]

    # Retrieve the driver by ID.
    get_response = client.get(f'/drivers/{driver_id}')
    assert get_response.status_code == 200
    assert get_response.json["driver_id"] == driver_id

def test_update_driver(client):
    """Test PUT /drivers/<driver_id>."""
    # First, create a driver to update.
    post_response = client.post('/drivers', json={
        "name": "Driver To Update",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "availability": True,
        "rating": 4.0
    })
    driver_id = post_response.json["driver_id"]

    # Update the driver's availability.
    put_response = client.put(f'/drivers/{driver_id}', json={
        "availability": False
    })
    assert put_response.status_code == 200
    assert put_response.json["message"] == f"Driver {driver_id} updated"

def test_delete_driver(client):
    """Test DELETE /drivers/<driver_id>."""
    # First, create a driver to delete.
    post_response = client.post('/drivers', json={
        "name": "Driver To Delete",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "availability": True,
        "rating": 3.5
    })
    driver_id = post_response.json["driver_id"]

    # Delete the driver.
    delete_response = client.delete(f'/drivers/{driver_id}')
    assert delete_response.status_code == 200
    assert delete_response.json["message"] == f"Driver {driver_id} deleted"
    
    
    
# ------------------------
# Unit Tests for Riders Endpoints
# ------------------------

def test_add_rider(client):
    """Test POST /riders (valid request)."""
    response = client.post('/riders', json={
        "name": "Jane Smith",
        "pickup_latitude": 37.7749,
        "pickup_longitude": -122.4194,
        "dropoff_latitude": 37.7849,
        "dropoff_longitude": -122.4094
    })
    assert response.status_code == 200
    assert "rider_id" in response.json

def test_add_rider_invalid(client):
    """Test POST /riders (invalid request)."""
    response = client.post('/riders', json={
        "pickup_latitude": 37.7749,
        "pickup_longitude": -122.4194,
        # Missing required fields like 'name' and dropoff coordinates.
    })
    assert response.status_code == 400
    assert "error" in response.json

def test_list_riders(client):
    """Test GET /riders."""
    response = client.get('/riders')
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_update_rider(client):
    """Test PUT /riders/<rider_id>."""
    # First, create a rider to update.
    post_response = client.post('/riders', json={
        "name": "Rider To Update",
        "pickup_latitude": 37.7749,
        "pickup_longitude": -122.4194,
        "dropoff_latitude": 37.7849,
        "dropoff_longitude": -122.4094
    })
    rider_id = post_response.json["rider_id"]

    # Update the rider's name.
    put_response = client.put(f'/riders/{rider_id}', json={
        "new_name": "Updated Rider Name"
    })
    assert put_response.status_code == 200
    assert put_response.json["message"] == f"Rider {rider_id} updated"

def test_delete_rider(client):
    """Test DELETE /riders/<rider_id>."""
    # First, create a rider to delete.
    post_response = client.post('/riders', json={
        "name": "Rider To Delete",
        "pickup_latitude": 37.7749,
        "pickup_longitude": -122.4194,
        "dropoff_latitude": 37.7849,
        "dropoff_longitude": -122.4094
    })
    rider_id = post_response.json["rider_id"]

    # Delete the rider.
    delete_response = client.delete(f'/riders/{rider_id}')
    assert delete_response.status_code == 200
    assert delete_response.json["message"] == f"Rider {rider_id} deleted"