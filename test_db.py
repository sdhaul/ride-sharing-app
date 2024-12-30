from backend.db import *

# Testing Drivers Table
print("Testing Drivers Table")
driver_id = create_driver("Test Driver", 37.7749, -122.4194)
print(get_all_drivers())
print(get_driver_by_id(driver_id))
update_driver_availability(driver_id, False)

# Testing Riders Table
print("\nTesting Riders Table")
rider_id = create_rider("Test Rider", 37.7749, -122.4194, 37.7849, -122.4094)
print(get_all_riders())
update_rider_name(rider_id, "Jane Doe")

# Testing Rides Table
print("\nTesting Rides Table")
ride_id = create_ride(driver_id=driver_id, rider_id=rider_id, status="requested", fare=20.5)
print(get_all_rides())
update_ride_status(ride_id, "completed")
delete_ride(ride_id)

# Clean up Drivers and Riders after testing Rides
delete_driver(driver_id)
delete_rider(rider_id)

# Testing Zones Table
print("\nTesting Zones Table")
zone_id = create_zone("Downtown", demand_score=50)
print(get_all_zones())
update_zone_demand_score(zone_id, 75)
delete_zone(zone_id)
