from flask import Flask, request, jsonify
from marshmallow import Schema, fields, validate, ValidationError
from flask_cors import CORS

from backend.db import (
    create_driver, get_all_drivers, get_driver_by_id,
    update_driver_availability, delete_driver,
    create_rider, get_all_riders, update_rider_name, delete_rider,
    create_ride, get_all_rides, update_ride_status, delete_ride,
    create_zone, get_all_zones, update_zone_demand_score, delete_zone
)

# Initialize Flask App
app = Flask(__name__)
CORS(app)
# ------------------------
# Marshmallow Schemas
# ------------------------

class DriverSchema(Schema):
    name = fields.String(required=True, validate=validate.Length(min=1))
    latitude = fields.Float(required=True)
    longitude = fields.Float(required=True)
    availability = fields.Boolean(required=False)
    rating = fields.Float(required=False, validate=validate.Range(min=0.0, max=5.0))


class RiderSchema(Schema):
    name = fields.String(required=True, validate=validate.Length(min=1))
    pickup_latitude = fields.Float(required=True)
    pickup_longitude = fields.Float(required=True)
    dropoff_latitude = fields.Float(required=True)
    dropoff_longitude = fields.Float(required=True)

class RideSchema(Schema):
    driver_id = fields.String(required=True)
    rider_id = fields.String(required=True)
    status = fields.String(validate=validate.OneOf(["requested", "ongoing", "completed", "canceled"]))
    fare = fields.Float(validate=validate.Range(min=0.0))

class ZoneSchema(Schema):
    region_name = fields.String(required=True, validate=validate.Length(min=1))
    demand_score = fields.Float(validate=validate.Range(min=0.0))


# ------------------------
# Drivers Endpoints
# ------------------------

@app.route('/drivers', methods=['POST'])
def add_driver():
    data = request.json
    schema = DriverSchema()
    
    # Validate input
    try:
        validated_data = schema.load(data)
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400

    # Create driver using validated data
    driver_id = create_driver(
        validated_data['name'],
        validated_data['latitude'],
        validated_data['longitude'],
        validated_data.get('availability', True),
        validated_data.get('rating', 5.0)
    )
    return jsonify({"driver_id": driver_id})

@app.route('/drivers', methods=['GET'])
def list_drivers():
    drivers = get_all_drivers()
    return jsonify(drivers)

@app.route('/drivers/<driver_id>', methods=['GET'])
def get_driver(driver_id):
    driver = get_driver_by_id(driver_id)
    if not driver:
        return jsonify({"error": "Driver not found"}), 404
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
    schema = RiderSchema()
    
    try:
        validated_data = schema.load(data)
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400

    rider_id = create_rider(
        validated_data['name'],
        validated_data['pickup_latitude'],
        validated_data['pickup_longitude'],
        validated_data['dropoff_latitude'],
        validated_data['dropoff_longitude']
    )
    return jsonify({"rider_id": rider_id})

@app.route('/riders', methods=['GET'])
def list_riders():
    riders = get_all_riders()
    return jsonify(riders)

@app.route('/riders/<rider_id>', methods=['PUT'])
def update_rider(rider_id):
    data = request.json
    try:
        new_name = data['new_name']
        
        if not isinstance(new_name, str) or len(new_name) < 1:
            raise ValidationError("Name must be a non-empty string.")
        
        update_rider_name(rider_id, new_name)
        return jsonify({"message": f"Rider {rider_id} updated"})
    
    except KeyError:
        return jsonify({"error": "Missing 'new_name' field"}), 400

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
    schema = RideSchema()
    
    try:
        validated_data = schema.load(data)
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400

    ride_id = create_ride(
        validated_data['driver_id'],
        validated_data['rider_id'],
        validated_data.get('status', 'requested'),
        validated_data.get('fare')
    )
    
    return jsonify({"ride_id": ride_id})

@app.route('/rides', methods=['GET'])
def list_rides():
    rides = get_all_rides()
    return jsonify(rides)

@app.route('/rides/<ride_id>', methods=['PUT'])
def update_ride(ride_id):
    data = request.json
    try:
        status = data['status']
        
        if status not in ["requested", "ongoing", "completed", "canceled"]:
            raise ValidationError("Invalid status value.")
        
        update_ride_status(ride_id, status)
        return jsonify({"message": f"Ride {ride_id} updated"})
    
    except KeyError:
        return jsonify({"error": "Missing 'status' field"}), 400

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
    schema = ZoneSchema()

    # Validate input
    try:
        validated_data = schema.load(data)
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400

    # Create zone using validated data
    zone_id = create_zone(
        validated_data['region_name'],
        validated_data.get('demand_score', 0.0)
    )
    return jsonify({"zone_id": zone_id})

@app.route('/zones', methods=['GET'])
def list_zones():
    zones = get_all_zones()
    return jsonify(zones)

@app.route('/zones/<zone_id>', methods=['PUT'])
def update_zone(zone_id):
    data = request.json

    try:
        demand_score = data['demand_score']
        
        if not isinstance(demand_score, (int, float)):
            raise ValidationError("Demand score must be a number.")
        
        update_zone_demand_score(zone_id, demand_score)
        return jsonify({"message": f"Zone {zone_id} updated"})
    
    except KeyError:
        return jsonify({"error": "Missing 'demand_score' field"}), 400

@app.route('/zones/<zone_id>', methods=['DELETE'])
def delete_zone_endpoint(zone_id):
    delete_zone(zone_id)
    return jsonify({"message": f"Zone {zone_id} deleted"})

if __name__ == '__main__':
    app.run(debug=True)