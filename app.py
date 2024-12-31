from flask import Flask, request, jsonify
from backend.db import (
    create_driver, get_all_drivers, get_driver_by_id,
    update_driver_availability, delete_driver,
    create_rider, get_all_riders, update_rider_name, delete_rider,
    create_ride, get_all_rides, update_ride_status, delete_ride,
    create_zone, get_all_zones, update_zone_demand_score, delete_zone
)

app = Flask(__name__)

# ------------------------
# Drivers Endpoints
# ------------------------

@app.route('/drivers', methods=['POST'])
def add_driver():
    data = request.json
    
    # Validate input fields
    # HERE
    
    driver_id = create_driver(
        data['name'],
        data['latitude'],
        data['longitude'],
        data.get('availability', True),
        data.get('rating', 5.0)
    )
    return jsonify({"driver_id": driver_id})

@app.route('/drivers', methods=['GET'])
def list_drivers():
    drivers = get_all_drivers()
    return jsonify(drivers)

@app.route('/drivers/<driver_id>', methods=['GET'])
def get_driver(driver_id):
    driver = get_driver_by_id(driver_id)
    return jsonify(driver)

@app.route('/drivers/<driver_id>', methods=['PUT'])
def update_driver(driver_id):
    data = request.json
    update_driver_availability(driver_id, data['availability'])
    return jsonify({"message": f"Driver {driver_id} updated"})

@app.route('/drivers/<driver_id>', methods=['DELETE'])
def delete_driver_endpoint(driver_id):
    delete_driver(driver_id)
    return jsonify({"message": f"Driver {driver_id} deleted"})

# ------------------------
# Riders Endpoints
# ------------------------

@app.route('/riders', methods=['POST'])
def add_rider():
    data = request.json
    # Validate input fields
    # HERE
    
    rider_id = create_rider(
        data['name'],
        data['pickup_latitude'],
        data['pickup_longitude'],
        data['dropoff_latitude'],
        data['dropoff_longitude']
    )
    return jsonify({"rider_id": rider_id})

@app.route('/riders', methods=['GET'])
def list_riders():
    riders = get_all_riders()
    return jsonify(riders)

@app.route('/riders/<rider_id>', methods=['PUT'])
def update_rider(rider_id):
    data = request.json
    update_rider_name(rider_id, data['new_name'])
    return jsonify({"message": f"Rider {rider_id} updated"})

@app.route('/riders/<rider_id>', methods=['DELETE'])
def delete_rider_endpoint(rider_id):
    delete_rider(rider_id)
    return jsonify({"message": f"Rider {rider_id} deleted"})

# ------------------------
# Rides Endpoints
# ------------------------

@app.route('/rides', methods=['POST'])
def add_ride():
    data = request.json
    # Validate input fields
    # HERE
    
    ride_id = create_ride(
        data['driver_id'],
        data['rider_id'],
        data.get('status', 'requested'),
        data.get('fare')
    )
    return jsonify({"ride_id": ride_id})

@app.route('/rides', methods=['GET'])
def list_rides():
    rides = get_all_rides()
    return jsonify(rides)

@app.route('/rides/<ride_id>', methods=['PUT'])
def update_ride(ride_id):
    data = request.json
    update_ride_status(ride_id, data['status'])
    return jsonify({"message": f"Ride {ride_id} updated"})

@app.route('/rides/<ride_id>', methods=['DELETE'])
def delete_ride_endpoint(ride_id):
    delete_ride(ride_id)
    return jsonify({"message": f"Ride {ride_id} deleted"})

# ------------------------
# Zones Endpoints
# ------------------------

@app.route('/zones', methods=['POST'])
def add_zone():
    data = request.json
    # Validate input fields
    # HERE
    
    zone_id = create_zone(
        data['region_name'],
        data.get('demand_score', 0.0)
    )
    return jsonify({"zone_id": zone_id})

@app.route('/zones', methods=['GET'])
def list_zones():
    zones = get_all_zones()
    return jsonify(zones)

@app.route('/zones/<zone_id>', methods=['PUT'])
def update_zone(zone_id):
    data = request.json
    update_zone_demand_score(zone_id, data['demand_score'])
    return jsonify({"message": f"Zone {zone_id} updated"})

@app.route('/zones/<zone_id>', methods=['DELETE'])
def delete_zone_endpoint(zone_id):
    delete_zone(zone_id)
    return jsonify({"message": f"Zone {zone_id} deleted"})


if __name__ == '__main__':
    app.run(debug=True)
