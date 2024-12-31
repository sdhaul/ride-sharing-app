import pytest
from app import app

@pytest.fixture
def client():
    """Fixture to set up the Flask test client."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

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
