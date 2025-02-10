import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGeolocated } from "react-geolocated";
import {
    GoogleMap,
    useJsApiLoader,
    Marker,
    DirectionsRenderer,
    TrafficLayer,
} from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const mapContainerStyle = {
    width: "100%",
    height: "500px",
};

// Manually define danger zones for relief agencies to navigate to
const dangerZones = [
    { lat: 35.7766, lng: -78.6610},
    {lat: 35.7721, lng: -78.6500}, 
    {lat: 35.7794, lng: -78.6380 },

];

function ReliefNavigation() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

    const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
        positionOptions: { enableHighAccuracy: true },
        userDecisionTimeout: 5000,
    });

    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        if (isLoaded && coords) {
            const userLocation = { lat: coords.latitude, lng: coords.longitude };

            const fetchDirections = new window.google.maps.DirectionsService();

            const newRoutes = [];

            // Generate routes to all danger zones
            dangerZones.forEach((zone) => {
                fetchDirections.route(
                    {
                        origin: userLocation,
                        destination: { lat: zone.lat, lng: zone.lng },
                        travelMode: "DRIVING",
                    },
                    (result, status) => {
                        if (status === "OK") {
                            newRoutes.push(result);
                            setRoutes([...newRoutes]); // Update state with new routes
                        } else {
                            console.error("Error fetching directions:", status);
                        }
                    }
                );
            });
        }
    }, [coords, isLoaded]);

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
            <div className="header">🚑 Relief Navigation</div>

            {/* User's Location */}
            <div className='coords'>
                <h3>📍 Latitude: {coords.latitude} <br></br> 🌎 Longitude: {coords.longitude}</h3>
            </div>

            {/* Map Container */}
            <div className="map-container">
                <GoogleMap mapContainerStyle={mapContainerStyle} center={{ lat: coords.latitude, lng: coords.longitude }} zoom={13}>
                    <TrafficLayer />
                    <Marker position={{ lat: coords.latitude, lng: coords.longitude }} />

                    {/* Danger Zones as Markers */}
                    {dangerZones.map((zone, index) => (
                        <Marker key={index} position={{ lat: zone.lat, lng: zone.lng }} title={`Danger Zone ${index + 1}`} icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png" />
                    ))}

                    {/* Routes to Danger Zones */}
                    {routes.map((route, index) => (
                        <DirectionsRenderer key={index} directions={route} />
                    ))}
                </GoogleMap>
            </div>

            {/* Bottom Navigation */}
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

export default ReliefNavigation;
