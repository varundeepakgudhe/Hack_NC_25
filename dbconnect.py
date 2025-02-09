from flask import Flask, jsonify, request
from flask_cors import CORS
import pymongo
import sys
app = Flask(__name__)
CORS(app, supports_credentials=True, methods=["GET", "POST", "OPTIONS"], allow_headers=["Content-Type"])  # Fixes CORS issues

# Replace the placeholder data with your Atlas connection string. Be sure it includes
# a valid username and password! Note that in a production environment,
# you should not store your password in plain-text here.

try:
  client = pymongo.MongoClient("mongodb+srv://jahnavi:hackncstate25@cluster0.gq37d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  
# return a friendly error if a URI error is thrown 
except pymongo.errors.ConfigurationError:
  print("An Invalid URI host error was received. Is your Atlas host name correct in your connection string?")
  sys.exit(1)

# use a database named "myDatabase"
db = client.LocationData
# my_collection = db["locationInfo"]

shelters_collection = db["shelters"]  # Shelters collection
danger_zones_collection = db["danger_zones"]  # Danger zones collection
restricted_roads_collection = db["restricted_roads"]  # Restricted roads collection

# Manually define shelters
manualShelters = [
    { "name": "Shelter 1", "lat": 35.7796, "lng": -78.6382, "state": "North Carolina" },
    { "name": "Shelter 2", "lat": 35.7746, "lng": -78.6400, "state": "North Carolina" },
    { "name": "Shelter 3", "lat": 35.7721, "lng": -78.6500, "state": "North Carolina" },
    { "name": "Shelter 4", "lat": 35.7766, "lng": -78.6610, "state": "North Carolina" },
]

# Manually define danger zones (These areas should be avoided)
dangerZones = [
    { "lat": 35.7766, "lng": -78.6610, "radius": 400, "state": "North Carolina" },  # Danger zone with a 400m radius
    { "lat": 35.7721, "lng": -78.6500, "radius": 400, "state": "North Carolina" },  # Danger zone with a 400m radius
    { "lat": 35.7790, "lng": -78.6400, "radius": 130, "state": "North Carolina" },  # Danger zone with a 130m radius
]

# Manually define restricted roads to avoid
restrictedRoads = [
    { "lat": 35.776, "lng": -78.6610, "state": "North Carolina" },  # Blocked road location
    { "lat": 35.7766, "lng": -78.6610, "state": "North Carolina" },
    { "lat": 35.7721, "lng": -78.6500, "state": "North Carolina" },
    { "lat": 35.7790, "lng": -78.6403, "state": "North Carolina" },
]

# Insert shelters into MongoDB
shelters_collection.insert_many(manualShelters)

# Insert danger zones into MongoDB
danger_zones_collection.insert_many(dangerZones)

# Insert restricted roads into MongoDB
restricted_roads_collection.insert_many(restrictedRoads)


location_documents = [
  {
    "latitude": 40.712776,
    "longitude": -74.005974,
    "cityname": "New York",
    "state": "New York",
    "zoneType": "safe",
    "description": "Emergency Shelter at Manhattan Community Center"
  },
  {
    "latitude": 40.730610,
    "longitude": -73.935242,
    "cityname": "New York",
    "state": "New York",
    "zoneType": "danger",
    "description": "Flooded area near Brooklyn Bridge"
  },
  {
    "latitude": 34.052235,
    "longitude": -118.243683,
    "cityname": "Los Angeles",
    "state": "California",
    "zoneType": "danger",
    "description": "Wildfire risk near Griffith Park"
  },
  {
    "latitude": 34.040713,
    "longitude": -118.246769,
    "cityname": "Los Angeles",
    "state": "California",
    "zoneType": "safe",
    "description": "Safe zone at Los Angeles Convention Center"
  },
  {
    "latitude": 41.878113,
    "longitude": -87.629799,
    "cityname": "Chicago",
    "state": "Illinois",
    "zoneType": "danger",
    "description": "Heavy snowstorm affecting downtown roads"
  },
  {
    "latitude": 41.881832,
    "longitude": -87.623177,
    "cityname": "Chicago",
    "state": "Illinois",
    "zoneType": "safe",
    "description": "Public shelter at Millennium Park"
  },
  {
    "latitude": 29.760427,
    "longitude": -95.369804,
    "cityname": "Houston",
    "state": "Texas",
    "zoneType": "safe",
    "description": "Safe shelter at George R. Brown Convention Center"
  },
  {
    "latitude": 29.749907,
    "longitude": -95.358421,
    "cityname": "Houston",
    "state": "Texas",
    "zoneType": "danger",
    "description": "Flood-prone zone near Buffalo Bayou"
  },
  {
    "latitude": 33.448376,
    "longitude": -112.074036,
    "cityname": "Phoenix",
    "state": "Arizona",
    "zoneType": "danger",
    "description": "Extreme heat advisory for downtown area"
  },
  {
    "latitude": 33.441792,
    "longitude": -112.073437,
    "cityname": "Phoenix",
    "state": "Arizona",
    "zoneType": "safe",
    "description": "Cooling station at Phoenix Public Library"
  },
  {
    "latitude": 37.774929,
    "longitude": -122.419418,
    "cityname": "San Francisco",
    "state": "California",
    "zoneType": "safe",
    "description": "Earthquake shelter at Moscone Center"
  },
  {
    "latitude": 37.804363,
    "longitude": -122.271111,
    "cityname": "San Francisco",
    "state": "California",
    "zoneType": "danger",
    "description": "Tsunami-prone area near Oakland Bay"
  },
  {
    "latitude": 39.739236,
    "longitude": -104.990251,
    "cityname": "Denver",
    "state": "Colorado",
    "zoneType": "safe",
    "description": "Evacuation center at Colorado Convention Center"
  },
  {
    "latitude": 39.755543,
    "longitude": -104.986486,
    "cityname": "Denver",
    "state": "Colorado",
    "zoneType": "danger",
    "description": "Blizzard-affected region near Union Station"
  },
  {
    "latitude": 47.606209,
    "longitude": -122.332069,
    "cityname": "Seattle",
    "state": "Washington",
    "zoneType": "safe",
    "description": "Emergency shelter at Seattle Convention Center"
  },
  {
    "latitude": 47.615947,
    "longitude": -122.335525,
    "cityname": "Seattle",
    "state": "Washington",
    "zoneType": "danger",
    "description": "Landslide-prone area near Queen Anne"
  },
  {
    "latitude": 32.776665,
    "longitude": -96.796989,
    "cityname": "Dallas",
    "state": "Texas",
    "zoneType": "danger",
    "description": "Tornado warning for downtown Dallas"
  },
  {
    "latitude": 32.780140,
    "longitude": -96.800451,
    "cityname": "Dallas",
    "state": "Texas",
    "zoneType": "safe",
    "description": "Reinforced shelter at Kay Bailey Hutchison Center"
  },
  {
    "latitude": 35.779591,
    "longitude": -78.638179,
    "cityname": "Raleigh",
    "state": "North Carolina",
    "zoneType": "safe",
    "description": "Evacuation shelter at Raleigh Convention Center"
  },
  {
    "latitude": 35.595058,
    "longitude": -82.551487,
    "cityname": "Asheville",
    "state": "North Carolina",
    "zoneType": "danger",
    "description": "Landslide-prone area near Blue Ridge Parkway"
  },
  {
    "latitude": 36.099859,
    "longitude": -80.244217,
    "cityname": "Winston-Salem",
    "state": "North Carolina",
    "zoneType": "safe",
    "description": "Emergency shelter at Benton Convention Center"
  },
  {
    "latitude": 35.227085,
    "longitude": -80.843124,
    "cityname": "Charlotte",
    "state": "North Carolina",
    "zoneType": "danger",
    "description": "Flood-prone area near Catawba River"
  },
  {
    "latitude": 34.225726,
    "longitude": -77.944710,
    "cityname": "Wilmington",
    "state": "North Carolina",
    "zoneType": "safe",
    "description": "Hurricane shelter at Wilmington Convention Center"
  }
]

def add_location_documents(documents, collection):
    """
    Insert a list of documents into the given collection.
    """
    try:
        collection.drop()  # Clear existing data
    except pymongo.errors.OperationFailure as e:
        print(f"An error occurred while dropping the collection: {e}")
        sys.exit(1)
    try:
        result = collection.insert_many(documents)
    except pymongo.errors.OperationFailure:
        print("An authentication error was received. Are you sure your database user is authorized to perform write operations?")
        sys.exit(1)
    else:
        inserted_count = len(result.inserted_ids)
        print(f"I inserted {inserted_count} documents.")

def get_state_from_location(latitude, longitude, collection):
    """
    Find the state of a given (latitude, longitude) by querying the database.
    Assumes all locations in the same city share the same state.
    """
    location = collection.find_one({
        "latitude": latitude,
        "longitude": longitude
    })

    if location:
        return location["state"]
    else:
        return None

def get_zones_by_state(state, collection):
    """
    Retrieve all safe and danger zones in the same state as the given location.
    """
    # state = get_state_from_location(state)
    print("Inside get_zones_by_state")
    if state:
        zones = collection.find({"state": state}, {"latitude": 1, "longitude": 1, "zoneType": 1, "_id": 0})
        return list(zones)
    else:
        return []
    
# @app.route('/api/zones', methods=['POST', 'OPTIONS'])
# def get_zones():
#     if request.method == 'OPTIONS':
#         # Return response for OPTIONS (preflight) request
#         response = jsonify({'message': 'Preflight request successful'})
#         response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
#         response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
#         response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
#         response.headers.add('Access-Control-Allow-Credentials', 'true')  # Add credentials support
#         return response
#     else:
#       data = request.json
#       state = data.get('state')
#       # longitude = data.get('longitude')
#       # print(latitude)
#       # print(longitude)
#       zones = get_zones_by_state(state)
#       return jsonify(zones)

@app.route('/api/shelters', methods=['GET'])
def get_shelters():
    shelters = list(shelters_collection.find({}, {"_id": 0, "name": 1, "lat": 1, "lng": 1, "state": 1}))
    return jsonify(shelters)

@app.route('/api/danger_zones', methods=['GET'])
def get_danger_zones():
    danger_zones = list(danger_zones_collection.find({}, {"_id": 0, "lat": 1, "lng": 1, "radius": 1, "state": 1}))
    return jsonify(danger_zones)

@app.route('/api/restricted_roads', methods=['GET'])
def get_restricted_roads():
    restricted_roads = list(restricted_roads_collection.find({}, {"_id": 0, "lat": 1, "lng": 1, "state": 1}))
    return jsonify(restricted_roads)

if __name__ == '__main__':
    # add_location_documents(location_documents)
    add_location_documents(manualShelters, shelters_collection)
    add_location_documents(dangerZones, danger_zones_collection)
    add_location_documents(restrictedRoads, restricted_roads_collection)
    app.run(debug=True)

# # Example: Query for locations based on a given latitude & longitude
# latitude = 34.052235
# longitude = -118.243683  # Los Angeles, CA

# add_location_documents(location_documents)
# get_zones_by_state(latitude, longitude)
