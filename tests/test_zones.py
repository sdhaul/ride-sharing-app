import pytest
from app import app

@pytest.fixture
def client():
    """Fixture to set up the Flask test client."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

# ------------------------
# Unit Tests for Zones Endpoints
# ------------------------

def test_add_zone(client):
    """Test POST /zones (valid request)."""
    response = client.post('/zones', json={
        "region_name": "Downtown",
        "demand_score": 50.0
    })
    assert response.status_code == 200
    assert "zone_id" in response.json

def test_list_zones(client):
    """Test GET /zones."""
    response = client.get('/zones')
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_update_zone(client):
    """Test PUT /zones/<zone_id>."""
    # First, create a zone to update.
    post_response = client.post('/zones', json={
        "region_name": "Uptown",
        "demand_score": 30.0
    })
    
