import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer, Circle } from "@react-google-maps/api";
import './App.css';

// ✅ Google Maps API Key
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const mapContainerStyle = {
    width: "100%",
    height: "400px",
};

// ✅ Function to extract coordinates from emergency message
const extractCoordinates = (message) => {
    const regex = /(-?\d+\.\d+),\s*(-?\d+\.\d+)/;
    const match = message.match(regex);
    if (match) {
        return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    }
    return null;
};

// ✅ Danger Zones (Avoid These)
const dangerZones = [
    { lat: 35.7780, lng: -78.6500, radius: 300 },
    { lat: 35.7750, lng: -78.6400, radius: 100 },
];

function EmergencyNavigation() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

    const [userLocation, setUserLocation] = useState(null);
    const [shelterLocation, setShelterLocation] = useState(null);
    const [directions, setDirections] = useState(null);
    const [emergencyText, setEmergencyText] = useState(""); // User input message

    // ✅ Get user location
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => console.error("Error getting location:", error),
            { enableHighAccuracy: true }
        );
    }, []);
    
    const [lastUpdate, setLastUpdate] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setLastUpdate(now.toLocaleTimeString()); // Format time
        };

        updateTime(); // Set initial time
    }, []);

    // ✅ Extract Shelter Coordinates from User Input
    const handleExtractCoordinates = () => {
        const extractedShelter = extractCoordinates(emergencyText);
        if (extractedShelter) {
            setShelterLocation(extractedShelter);
            generateRoute(extractedShelter);
        } else {
            alert("⚠️ No valid coordinates found in the message!");
        }
    };

    // ✅ Generate Route (Avoiding Danger Zones)
    const generateRoute = (shelter) => {
        if (isLoaded && userLocation && shelter) {
            const fetchDirections = new window.google.maps.DirectionsService();
            fetchDirections.route(
                {
                    origin: userLocation,
                    destination: shelter,
                    travelMode: "DRIVING",
                    avoidHighways: false,
                    avoidTolls: false,
                    waypoints: dangerZones.map(zone => ({
                        location: { lat: zone.lat + 0.01, lng: zone.lng + 0.01 },
                        stopover: false,
                    })),
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
    };

    if (!isLoaded) return <h2>🔄 Loading Google Maps...</h2>;
    if (!userLocation) return <h2>📍 Fetching Location...</h2>;

    return (
        <div className="phone-container">
            {/* Header */}
            <div className="header">🚧 Offline Navigation Mode</div>

            {/* Emergency Message Input */}
            <div className="input-container">
                <label>Enter Emergency Message:</label>
                <textarea
                    placeholder="Example: 🚨 ALERT: Shelter at 35.7805, -78.6451 due to severe weather."
                    value={emergencyText}
                    onChange={(e) => setEmergencyText(e.target.value)}
                />
                <button className="go-button" onClick={handleExtractCoordinates}>Find Shelter</button>
            </div>
            <p className="last-update">🕒 Last update: {lastUpdate}</p>
            {/* Google Map */}
            <div className="map-container">
                <GoogleMap mapContainerStyle={mapContainerStyle} center={userLocation} zoom={14} mapTypeId="satellite">
                    {/* User's Location */}
                    <Marker position={userLocation} label="🏠" />

                    {/* Emergency Shelter Location */}
                    {shelterLocation && <Marker position={shelterLocation} label="🛑" />}

                    {/* Danger Zones */}
                    {dangerZones.map((zone, index) => (
                        <Circle
                            key={index}
                            center={{ lat: zone.lat, lng: zone.lng }}
                            radius={zone.radius}
                            options={{ fillColor: "rgba(255, 0, 0, 0.4)", strokeColor: "red", strokeOpacity: 1, strokeWeight: 2 }}
                        />
                    ))}

                    {/* Route to Shelter */}
                    {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
            </div>

            {/* Navigation Buttons */}
            <div className="navbar">
                <Link to="/alerts">⚠️</Link>
                <Link to="/Preparedness">ℹ️</Link>
                <Link to="/">🏠</Link>
                <Link to="/ReliefNavigation">☠️</Link>
                <Link to="/finance">💵</Link>
            </div>
        </div>
    );
}

export default EmergencyNavigation;
