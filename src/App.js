import React, { useState, useEffect } from "react";
import './App.css';
import { useGeolocated } from "react-geolocated";
import {
    GoogleMap,
    useJsApiLoader,
    Marker,
    DirectionsRenderer,
    TrafficLayer,
    Circle
} from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = "AIzaSyBo_OfruLbbmPSaM-H19PD4Givdmes0RgI"; 

const mapContainerStyle = {
    width: "100%",
    height: "100%",
};

// Manually define shelters
const manualShelters = [
    { name: "Shelter 1", lat: 35.7796, lng: -78.6382 },
    { name: "Shelter 2", lat: 35.7746, lng: -78.6400 },
    { name: "Shelter 3", lat: 35.7721, lng: -78.6500 },
    { name: "Shelter 4", lat: 35.7766, lng: -78.6610 },
];

// Manually define danger zones (These areas should be avoided)
const dangerZones = [
    { lat: 35.7766, lng: -78.6610, radius: 400 },
    {lat: 35.7721, lng: -78.6500, radius: 400 },
    {lat: 35.7790, lng: -78.6400 , radius: 130},
];

// Manually define restricted roads to avoid
const restrictedRoads = [
    { lat: 35.776, lng: -78.6610 },
    { lat: 35.7766, lng: -78.6610 },
    {lat: 35.7721, lng: -78.6500 },
    {lat: 35.7790, lng: -78.6403},
];

function App() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

    const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
        positionOptions: { enableHighAccuracy: true },
        userDecisionTimeout: 5000,
    });

    const [directions, setDirections] = useState(null);

    useEffect(() => {
        if (isLoaded && coords) {
            const userLocation = { lat: coords.latitude, lng: coords.longitude };

            const nearestShelter = manualShelters
                .filter(shelter => !isInsideDangerZone(shelter.lat, shelter.lng))
                .reduce((prev, curr) => {
                    const prevDistance = Math.hypot(prev.lat - userLocation.lat, prev.lng - userLocation.lng);
                    const currDistance = Math.hypot(curr.lat - userLocation.lat, curr.lng - userLocation.lng);
                    return prevDistance < currDistance ? prev : curr;
                });

            if (!nearestShelter) {
                console.error("No safe shelter available!");
                return;
            }

            const waypoints = generateWaypoints(userLocation, nearestShelter);

            const fetchDirections = new window.google.maps.DirectionsService();
            fetchDirections.route(
                {
                    origin: userLocation,
                    destination: { lat: nearestShelter.lat, lng: nearestShelter.lng },
                    travelMode: "DRIVING",
                    avoidHighways: false,
                    avoidTolls: false,
                    waypoints: waypoints,
                },
                (result, status) => {
                    if (status === "OK") {
                        setDirections(result);
                    } else {
                        console.error("Error fetching directions:", status);
                    }
                }
            );
        }
    }, [coords, isLoaded]);

    const isInsideDangerZone = (lat, lng) => {
        return dangerZones.some(zone => {
            const distance = Math.hypot(lat - zone.lat, lng - zone.lng) * 111000;
            return distance < zone.radius;
        });
    };

    const generateWaypoints = (start, end) => {
        const waypoints = [];

        restrictedRoads.forEach(road => {
            const detourLat = road.lat + 0.02;
            const detourLng = road.lng + 0.02;
            
            waypoints.push({
                location: { lat: detourLat, lng: detourLng },
                stopover: false,
            });
        });

        return waypoints;
    };

    if (!isGeolocationAvailable) {
        return <h2>❌ Geolocation is not available on this browser.</h2>;
    }

    if (!isGeolocationEnabled) {
        return <h2>⚠️ Geolocation is disabled. Please enable location access.</h2>;
    }

    if (!isLoaded) {
        return <h2>🔄 Loading Google Maps...</h2>;
    }

    return (
        <div className="phone-container">
            <h1>📍 Disaster Navigation Web App</h1>
            {coords ? (
                <>
                    <h2>
                        🌍 Latitude: {coords.latitude} <br />
                        📍 Longitude: {coords.longitude}
                    </h2>
                    <div className="map-container">
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={{ lat: coords.latitude, lng: coords.longitude }}
                            zoom={14}
                        >
                            <TrafficLayer />
                            <Marker position={{ lat: coords.latitude, lng: coords.longitude }} />
                            {manualShelters.map((shelter, index) => (
                                <Marker
                                    key={index}
                                    position={{ lat: shelter.lat, lng: shelter.lng }}
                                    title={shelter.name}
                                    icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                                />
                            ))}
                            {dangerZones.map((zone, index) => (
                                <Circle
                                    key={index}
                                    center={{ lat: zone.lat, lng: zone.lng }}
                                    radius={zone.radius}
                                    options={{
                                        fillColor: "rgba(255, 0, 0, 0.4)",
                                        strokeColor: "red",
                                        strokeOpacity: 1,
                                        strokeWeight: 2,
                                    }}
                                />
                            ))}
                            {directions && <DirectionsRenderer directions={directions} />}
                        </GoogleMap>
                    </div>
                </>
            ) : (
                <h2>Fetching location...</h2>
            )}
        </div>
    );
}

export default App;
