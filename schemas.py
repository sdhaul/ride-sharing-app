from marshmallow import Schema, fields, validate, ValidationError

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
    status = fields.String(required=False, validate=validate.OneOf(["requested", "ongoing", "completed", "canceled"]))
    fare = fields.Float(required=False, validate=validate.Range(min=0.0))

class ZoneSchema(Schema):
    region_name = fields.String(required=True, validate=validate.Length(min=1))
    demand_score = fields.Float(required=False, validate=validate.Range(min=0.0))
