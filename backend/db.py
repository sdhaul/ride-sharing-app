import os
from dotenv import load_dotenv
import psycopg2

# Load environment variables from .env file
load_dotenv()

# Fetch credentials from environment variables
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")

# Establish a connection to CockroachDB
try:
    connection = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
        sslmode="require"
    )
    cursor = connection.cursor()
    print("Connected to CockroachDB successfully!")
except Exception as e:
    print(f"Error connecting to CockroachDB: {e}")


# ------------------
# Driver Table
# ------------------
# Create
def create_driver(name, latitude, longitude, availability=True, rating=5.0):
    try:
        cursor = connection.cursor()
        query = """
            INSERT INTO Drivers (name, location, availability, rating)
            VALUES (%s, ST_MakePoint(%s, %s)::GEOGRAPHY, %s, %s)
            RETURNING driver_id;
        """
        cursor.execute(query, (name, longitude, latitude, availability, rating))
        driver_id = cursor.fetchone()[0]
        connection.commit()
        print(f"Driver created with ID: {driver_id}")
        return driver_id
    except Exception as e:
        print(f"Error creating driver: {e}")


# Read
def get_all_drivers():
    try:
        cursor = connection.cursor()
        query = "SELECT driver_id, name, ST_AsText(location), availability, rating FROM Drivers;"
        cursor.execute(query)
        drivers = cursor.fetchall()
        for driver in drivers:
            print(driver)
        return drivers
    except Exception as e:
        print(f"Error fetching drivers: {e}")

        
def get_driver_by_id(driver_id):
    try:
        cursor = connection.cursor()
        query = "SELECT driver_id, name, ST_AsText(location), availability, rating FROM Drivers WHERE driver_id = %s;"
        cursor.execute(query, (driver_id,))
        driver = cursor.fetchone()
        print(driver)
        return driver
    except Exception as e:
        print(f"Error fetching driver by ID: {e}")


# Update
def update_driver_availability(driver_id, availability):
    try:
        cursor = connection.cursor()
        query = "UPDATE Drivers SET availability = %s WHERE driver_id = %s;"
        cursor.execute(query, (availability, driver_id))
        connection.commit()
        print(f"Driver {driver_id} availability updated to {availability}")
    except Exception as e:
        print(f"Error updating driver availability: {e}")


# Delete
def delete_driver(driver_id):
    try:
        cursor = connection.cursor()
        query = "DELETE FROM Drivers WHERE driver_id = %s;"
        cursor.execute(query, (driver_id,))
        connection.commit()
        print(f"Driver {driver_id} deleted successfully")
    except Exception as e:
        print(f"Error deleting driver: {e}")


# ------------------
# Riders Table
# ------------------

# Create
def create_rider(name, pickup_latitude, pickup_longitude, dropoff_latitude, dropoff_longitude):
    try:
        cursor = connection.cursor()
        query = """
            INSERT INTO Riders (name, pickup_location, dropoff_location)
            VALUES (%s, ST_MakePoint(%s, %s)::GEOGRAPHY, ST_MakePoint(%s, %s)::GEOGRAPHY)
            RETURNING rider_id;
        """
        cursor.execute(query, (name, pickup_longitude, pickup_latitude,
                               dropoff_longitude, dropoff_latitude))
        rider_id = cursor.fetchone()[0]
        connection.commit()
        print(f"Rider created with ID: {rider_id}")
        return rider_id
    except Exception as e:
        print(f"Error creating rider: {e}")

# Read
def get_all_riders():
    try:
        cursor = connection.cursor()
        query = "SELECT rider_id, name FROM Riders;"
        cursor.execute(query)
        riders = cursor.fetchall()
        return riders
    except Exception as e:
        print(f"Error fetching riders: {e}")

# Update
def update_rider_name(rider_id, new_name):
    try:
        cursor = connection.cursor()
        query = "UPDATE Riders SET name = %s WHERE rider_id = %s;"
        cursor.execute(query, (new_name, rider_id))
        connection.commit()
        print(f"Rider {rider_id} name updated to {new_name}")
    except Exception as e:
        print(f"Error updating rider name: {e}")


# Delete
def delete_rider(rider_id):
    try:
        cursor = connection.cursor()
        query = "DELETE FROM Riders WHERE rider_id = %s;"
        cursor.execute(query, (rider_id,))
        connection.commit()
        print(f"Rider {rider_id} deleted successfully")
    except Exception as e:
        print(f"Error deleting rider: {e}")



# ------------------
# Rides Table
# ------------------

# Create
def create_ride(driver_id, rider_id, status='requested', fare=None):
    try:
        cursor = connection.cursor()
        query = """
            INSERT INTO Rides (driver_id, rider_id, status, fare)
            VALUES (%s, %s, %s, %s)
            RETURNING ride_id;
        """
        cursor.execute(query, (driver_id, rider_id, status, fare))
        ride_id = cursor.fetchone()[0]
        connection.commit()
        print(f"Ride created with ID: {ride_id}")
        return ride_id
    except Exception as e:
        connection.rollback()  # Rollback transaction on error
        print(f"Error creating ride: {e}")


# Read
def get_all_rides():
    try:
        cursor = connection.cursor()
        query = "SELECT ride_id, driver_id, rider_id, status, fare, start_time, end_time FROM Rides;"
        cursor.execute(query)
        rides = cursor.fetchall()
        return rides
    except Exception as e:
        print(f"Error fetching rides: {e}")


# Update
def update_ride_status(ride_id, status):
    try:
        cursor = connection.cursor()
        query = "UPDATE Rides SET status = %s WHERE ride_id = %s;"
        cursor.execute(query, (status, ride_id))
        connection.commit()
        print(f"Ride {ride_id} status updated to {status}")
    except Exception as e:
        print(f"Error updating ride status: {e}")


# Delete
def delete_ride(ride_id):
    try:
        cursor = connection.cursor()
        query = "DELETE FROM Rides WHERE ride_id = %s;"
        cursor.execute(query, (ride_id,))
        connection.commit()
        print(f"Ride {ride_id} deleted successfully")
    except Exception as e:
        print(f"Error deleting ride: {e}")


# ------------------
### Zone table
# ------------------

# Create
def create_zone(region_name, demand_score=0.0):
    try:
        cursor = connection.cursor()
        query = """
            INSERT INTO Zones (region_name, demand_score)
            VALUES (%s, %s)
            RETURNING zone_id;
        """
        cursor.execute(query, (region_name, demand_score))
        zone_id = cursor.fetchone()[0]
        connection.commit()
        print(f"Zone created with ID: {zone_id}")
        return zone_id
    except Exception as e:
        connection.rollback()  # Rollback transaction on error
        print(f"Error creating zone: {e}")


# Read
def get_all_zones():
    try:
        cursor = connection.cursor()
        query = "SELECT zone_id, region_name, demand_score FROM Zones;"
        cursor.execute(query)
        zones = cursor.fetchall()
        return zones
    except Exception as e:
        print(f"Error fetching zones: {e}")

# Update
def update_zone_demand_score(zone_id, demand_score):
    try:
        cursor = connection.cursor()
        query = "UPDATE Zones SET demand_score = %s WHERE zone_id = %s;"
        cursor.execute(query, (demand_score, zone_id))
        connection.commit()
        print(f"Zone {zone_id} demand score updated to {demand_score}")
    except Exception as e:
        print(f"Error updating zone demand score: {e}")


# Delete
def delete_zone(zone_id):
    try:
        cursor = connection.cursor()
        query = "DELETE FROM Zones WHERE zone_id = %s;"
        cursor.execute(query, (zone_id,))
        connection.commit()
        print(f"Zone {zone_id} deleted successfully")
    except Exception as e:
         print(f"Error deleting zone: {e}")
