import './App.css';
// import DeviceFrame from "react-device-frame";
// import  {DeviceFrameset}  from "react-device-frameset";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import AlertsPage from "./alerts";
import OfflineNavigation from "./Offline";
import ReliefNavigation from "./ReliefNavigation";
import Preparedness from './Preparedness';
// // code 9
import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { useGeolocated } from "react-geolocated";
import {
    GoogleMap,
    useJsApiLoader,
    Marker,
    DirectionsRenderer,
    TrafficLayer,
    Circle
} from "@react-google-maps/api";
import { DataProvider, DataContext } from './DataContext';

const GOOGLE_MAPS_API_KEY = "AIzaSyBo_OfruLbbmPSaM-H19PD4Givdmes0RgI"; 

const mapContainerStyle = {
    width: "100%",
    height: "500px",
};

// Manually define shelters

// const manualShelters = [
//     { name: "Shelter 1", lat: 35.7796, lng: -78.6382 },
//     { name: "Shelter 2", lat: 35.7746, lng: -78.6400 },
//     { name: "Shelter 3", lat: 35.7721, lng: -78.6500 },
//     { name: "Shelter 4", lat: 35.7766, lng: -78.6610 },
// ];

// // Manually define danger zones (These areas should be avoided)
// const dangerZones = [
//     // { lat: 35.7760, lng: -78.6400, radius: 50 }, // 5 km
//     { lat: 35.7766, lng: -78.6610, radius: 400 },
//     {lat: 35.7721, lng: -78.6500,radius: 400 }, // 3 km
//     {lat: 35.7790, lng: -78.6400 , radius: 130},
// ];

// // Manually define restricted roads to avoid
// const restrictedRoads = [
//     { lat: 35.776, lng: -78.6610 }, // Example blocked road inside danger zone
//     { lat: 35.7766, lng: -78.6610 },
//     {lat: 35.7721, lng: -78.6500 },
//     {lat: 35.7790, lng: -78.6403},
// ];

function App() {
        return (
            <DataProvider>

      <div className="iphone-container">
        <div className="iphone-notch"></div>
        {/* Toggle Button for Online/Offline Mode */}
        {/* <ModeToggle /> */}
        <div className="iphone-screen">
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/preparedness" element={<Preparedness />} />
                <Route path="/offline" element={<OfflineNavigation />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/ReliefNavigation" element={<ReliefNavigation />} />
                <Route path="/finance" element={<h2>💵 Financial Aid Info Coming Soon</h2>} />
            </Routes>
        </Router>
        </div>
        </div>
        </DataProvider>

        );
    
}


function HomePage() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

    const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
        positionOptions: { enableHighAccuracy: true },
        userDecisionTimeout: 5000,
    });

    const [directions, setDirections] = useState(null);
    // const [shelters, setShelters] = useState([]);
    // const [dangerZones, setDangerZones] = useState([]);
    // const [restrictedRoads, setRestrictedRoads] = useState([]);

    const { shelters, dangerZones, restrictedRoads } = useContext(DataContext); // Get data from context
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {

        if (shelters.length > 0 && dangerZones.length > 0 && restrictedRoads.length > 0) {
            setLoading(false); // Set loading to false once data is available
        }
    }, [shelters, dangerZones, restrictedRoads]);

    useEffect(() => {
        // const fetchShelters = async () => {
        //     try {
        //         const response = await axios.get('http://127.0.0.1:5001/api/shelters');
        //         setShelters(response.data);
        //     } catch (error) {
        //         console.error("Error fetching shelters:", error);
        //     }
        // };

        // const fetchDangerZones = async () => {
        //     try {
        //         const response = await axios.get('http://127.0.0.1:5001/api/danger_zones');
        //         setDangerZones(response.data);
        //     } catch (error) {
        //         console.error("Error fetching danger zones:", error);
        //     }
        // };

        // const fetchRestrictedRoads = async () => {
        //     try {
        //         const response = await axios.get('http://127.0.0.1:5001/api/restricted_roads');
        //         setRestrictedRoads(response.data);
        //     } catch (error) {
        //         console.error("Error fetching restricted roads:", error);
        //     }
        // };

        // fetchShelters();
        // fetchDangerZones();
        // fetchRestrictedRoads();

        if (isLoaded && coords && shelters.length > 0) {
            const userLocation = { lat: coords.latitude, lng: coords.longitude };

            // Find the nearest shelter that is NOT in a danger zone
            const nearestShelter = shelters
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

            // Generate waypoints to avoid restricted roads
            const waypoints = generateWaypoints(userLocation, nearestShelter);

            // Request route from Google Directions API avoiding restricted roads
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

    // Check if location is inside a danger zone
    const isInsideDangerZone = (lat, lng) => {
        return dangerZones.some(zone => {
            const distance = Math.hypot(lat - zone.lat, lng - zone.lng) * 111000;
            return distance < zone.radius;
        });
    };

    // Generate waypoints to force rerouting around blocked roads
    const generateWaypoints = (start, end) => {
        const waypoints = [];

        restrictedRoads.forEach(road => {
            const detourLat = road.lat + 0.01;
            const detourLng = road.lng + 0.01;

            waypoints.push({
                location: { lat: detourLat, lng: detourLng },
                stopover: false,
            });
        });

        return waypoints.slice(0, 2);
    };

    if (!isGeolocationAvailable) {
        return <h2>❌ Geolocation is not available on this browser.</h2>;
    }

    if (!isGeolocationEnabled) {
        return <h2>⚠️ Geolocation is disabled. Please enable location access.</h2>;
    }

    if (!isLoaded || !coords) {
        return <h2>🔄 Loading Google Maps...</h2>;
    }

    return (
        <div className="phone-container">
            {/* Header */}
            <div className="header">🚨 Disaster Navigator</div>

            {/* User's Location */}
            <div className='coords'>
            <h3>
                📍 Latitude: {coords.latitude} <br />
                🌎 Longitude: {coords.longitude}
            </h3>
            </div>
            {/* Map Container */}
            <div className="map-container">
                <GoogleMap mapContainerStyle={mapContainerStyle} center={{ lat: coords.latitude, lng: coords.longitude }} zoom={14}>
                    <TrafficLayer />
                    <Marker position={{ lat: coords.latitude, lng: coords.longitude }} />

                    {/* Shelter Locations */}
                    {shelters.map((shelter, index) => (
                        <Marker key={index} position={{ lat: shelter.lat, lng: shelter.lng }} title={shelter.name} icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" />
                    ))}

                    {/* Danger Zones */}
                    {dangerZones.map((zone, index) => (
                        <Circle
                            key={index}
                            center={{ lat: zone.lat, lng: zone.lng }}
                            radius={zone.radius}
                            options={{ fillColor: "rgba(255, 0, 0, 0.4)", strokeColor: "red", strokeOpacity: 1, strokeWeight: 2 }}
                        />
                    ))}

                    {/* Route to the nearest safe shelter */}
                    {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
            </div>

            {/* Action Buttons */}
            {/* <button className="btn sos-button">🚨 SOS Emergency</button> */}
            {/* <button className="btn recalculate-button">🔄 Recalculate Route</button> */}
            
            <Link to="/offline" className="offbtn">📵</Link>
           
            {/* Bottom Navigation */}
            <div className="navbar">
                <Link to="/preparedness">ℹ️</Link>
                <Link to="/alerts">⚠️</Link>
                <Link to="/">🏠</Link>
                <Link to="/ReliefNavigation">🚑</Link>
                <Link to="/finance">💵</Link>
            </div>
        </div>
    );
}

export default App;