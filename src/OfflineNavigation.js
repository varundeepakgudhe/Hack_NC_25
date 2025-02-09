//code1, just inputs, no maps
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { GoogleMap, LoadScript, Marker, Circle, Polyline } from "@react-google-maps/api";

// const mapContainerStyle = {
//     width: "100%",
//     height: "400px",
// };

// const defaultCenter = { lat: 35.7796, lng: -78.6382 }; // Default center in Raleigh, NC

// // Default Start & Destination Values
// const defaultStart = { lat: 35.775, lng: -78.640 };
// const defaultDestination = { lat: 35.785, lng: -78.620 };

// // Stored Danger Zones
// const dangerZones = [
//     { lat: 35.770, lng: -78.650, radius: 500 },
//     { lat: 35.775, lng: -78.630, radius: 400 },
// ];

// function OfflineNavigation() {
//     const [start, setStart] = useState(defaultStart);
//     const [destination, setDestination] = useState(defaultDestination);
//     const [route, setRoute] = useState([]);

//     // Function to simulate route calculation while avoiding danger zones
//     const calculateRoute = () => {
//         const newRoute = [start]; // Start with the origin
//         const middlePoint = {
//             lat: (start.lat + destination.lat) / 2 + 0.005, // Adjust mid-point to avoid direct danger zones
//             lng: (start.lng + destination.lng) / 2,
//         };
//         newRoute.push(middlePoint); // Add adjusted mid-point
//         newRoute.push(destination); // End at destination
//         setRoute(newRoute);
//     };

//     useEffect(() => {
//         calculateRoute();
//     }, [start, destination]);

//     // Handle input changes
//     const handleStartChange = (e, type) => {
//         const value = parseFloat(e.target.value);
//         setStart((prev) => ({ ...prev, [type]: value || prev[type] }));
//     };

//     const handleDestinationChange = (e, type) => {
//         const value = parseFloat(e.target.value);
//         setDestination((prev) => ({ ...prev, [type]: value || prev[type] }));
//     };

//     return (
//         <div className="phone-container">
//             <h2>🚧 Offline Navigation Mode</h2>
//             <p>⚠️ No live updates. Using pre-saved map data.</p>

//             {/* Google Map */}
//             <LoadScript googleMapsApiKey="AIzaSyBo_OfruLbbmPSaM-H19PD4Givdmes0RgI">
//                 <GoogleMap mapContainerStyle={mapContainerStyle} center={defaultCenter} zoom={14}>
//                     {/* Markers */}
//                     <Marker position={start} label="A" />
//                     <Marker position={destination} label="B" />

//                     {/* Danger Zones */}
//                     {dangerZones.map((zone, index) => (
//                         <Circle
//                             key={index}
//                             center={{ lat: zone.lat, lng: zone.lng }}
//                             radius={zone.radius}
//                             options={{
//                                 fillColor: "rgba(255, 0, 0, 0.3)",
//                                 strokeColor: "red",
//                                 strokeOpacity: 1,
//                                 strokeWeight: 1,
//                             }}
//                         />
//                     ))}

//                     {/* Route Line */}
//                     {route.length > 1 && (
//                         <Polyline
//                             path={route}
//                             options={{
//                                 strokeColor: "blue",
//                                 strokeOpacity: 1,
//                                 strokeWeight: 3,
//                             }}
//                         />
//                     )}
//                 </GoogleMap>
//             </LoadScript>

//             {/* Manual Inputs for Offline Navigation */}
//             <div>
//                 <label>Start Location: </label>
//                 <input
//                     type="number"
//                     placeholder="Latitude"
//                     defaultValue={defaultStart.lat}
//                     onChange={(e) => handleStartChange(e, "lat")}
//                 />
//                 <input
//                     type="number"
//                     placeholder="Longitude"
//                     defaultValue={defaultStart.lng}
//                     onChange={(e) => handleStartChange(e, "lng")}
//                 />
//                 <br />
//                 <label>Destination: </label>
//                 <input
//                     type="number"
//                     placeholder="Latitude"
//                     defaultValue={defaultDestination.lat}
//                     onChange={(e) => handleDestinationChange(e, "lat")}
//                 />
//                 <input
//                     type="number"
//                     placeholder="Longitude"
//                     defaultValue={defaultDestination.lng}
//                     onChange={(e) => handleDestinationChange(e, "lng")}
//                 />
//             </div>

//             {/* Navigation Buttons */}
//             <div className="navbar">
//                 <Link to="/">🏠 Home</Link>
//             </div>
//         </div>
//     );
// }

// export default OfflineNavigation;




//code 2,map offline but not showing map properly
// import React from "react";
// import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from "react-leaflet";

// const defaultCenter = { lat: 35.7796, lng: -78.6382 };

// const defaultStart = { lat: 35.775, lng: -78.640 };
// const defaultDestination = { lat: 35.785, lng: -78.620 };

// const dangerZones = [
//     { lat: 35.770, lng: -78.650, radius: 500 },
//     { lat: 35.775, lng: -78.630, radius: 400 },
// ];

// function OfflineNavigation() {
//     return (
//         <div className="phone-container">
//             <h2>🛰️ Offline Navigation</h2>
//             <p>⚠️ Using OpenStreetMap for Offline Mode</p>

//             <MapContainer center={defaultCenter} zoom={13} style={{ width: "100%", height: "400px" }}>
//                 {/* Offline Map Tiles from OpenStreetMap */}
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//                 {/* Markers */}
//                 <Marker position={defaultStart}>
//                     <Popup>Start Location</Popup>
//                 </Marker>
//                 <Marker position={defaultDestination}>
//                     <Popup>Destination</Popup>
//                 </Marker>

//                 {/* Danger Zones */}
//                 {dangerZones.map((zone, index) => (
//                     <Circle
//                         key={index}
//                         center={{ lat: zone.lat, lng: zone.lng }}
//                         radius={zone.radius}
//                         pathOptions={{ color: "red" }}
//                     />
//                 ))}

//                 {/* Route Line */}
//                 <Polyline positions={[defaultStart, defaultDestination]} color="blue" />
//             </MapContainer>

//             <div className="navbar">
//                 <a href="/">🏠 Home</a>
//             </div>
//         </div>
//     );
// }

// export default OfflineNavigation;



import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from "react-leaflet";

const defaultCenter = { lat: 35.7796, lng: -78.6382 };

// Cached routes (simulated)
const cachedRoutes = JSON.parse(localStorage.getItem("savedRoutes")) || [];

// Danger Zones
const dangerZones = [
    { lat: 35.770, lng: -78.650, radius: 500 },
    { lat: 35.775, lng: -78.630, radius: 400 },
];
const cacheRoads = async () => {
    if (!navigator.onLine) return;

    try {
        const response = await fetch("https://api.openstreetmap.org/api/0.6/map?bbox=-78.65,35.77,-78.62,35.79");
        const roadData = await response.json();
        localStorage.setItem("savedRoads", JSON.stringify(roadData));
        console.log("✅ Roads Cached Successfully!");
    } catch (error) {
        console.error("❌ Error Caching Roads:", error);
    }
};
const cacheShelters = () => {
    const shelters = [
        { lat: 35.765, lng: -78.625, name: "Shelter A" },
        { lat: 35.782, lng: -78.615, name: "Shelter B" }
    ];
    localStorage.setItem("savedShelters", JSON.stringify(shelters));
    console.log("✅ Shelters Cached!");
};

function OfflineNavigation() {
    const [shelters, setShelters] = useState([]);
    const [route, setRoute] = useState(cachedRoutes); // Load from cache
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

// Detect offline status
    useEffect(() => {
    const handleOfflineStatus = () => setIsOffline(!navigator.onLine);

    window.addEventListener("online", handleOfflineStatus);
    window.addEventListener("offline", handleOfflineStatus);

    return () => {
        window.removeEventListener("online", handleOfflineStatus);
        window.removeEventListener("offline", handleOfflineStatus);
    };
}, []);

    useEffect(() => {
        // Simulated Emergency Broadcast Shelters (from SMS)
        const emergencyShelters = [
            { lat: 35.765, lng: -78.625, name: "Shelter A" },
            { lat: 35.782, lng: -78.615, name: "Shelter B" },
        ];
        setShelters(emergencyShelters);

        // If no cached route, generate a new one
        if (!cachedRoutes.length) {
            generateOfflineRoute(emergencyShelters);
        }
        if (navigator.onLine) {
            cacheRoads();
            cacheShelters();
        }
    }, []);
    const emergencyShelterInput = (lat, lng) => {
        const newShelter = { lat: parseFloat(lat), lng: parseFloat(lng), name: "Emergency Shelter" };
        setShelters([...shelters, newShelter]);
        generateOfflineRoute([...shelters, newShelter]);
    };

    // Generate Offline Route
    const generateOfflineRoute = (shelters) => {
        if (shelters.length === 0) return;

        const routePath = [
            { lat: 35.775, lng: -78.640 }, // Fixed starting point
            { lat: 35.780, lng: -78.630 }, // Midpoint to avoid danger
            shelters[0], // First emergency shelter
        ];

        setRoute(routePath);
        localStorage.setItem("savedRoutes", JSON.stringify(routePath)); // Cache route
    };
    
    

    return (
        <div className="phone-container">
            <h2>🛰️ Offline Mode</h2>
            <p>⚠️ Emergency Broadcast Shelters Loaded</p>

            <MapContainer center={defaultCenter} zoom={13}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Shelter Locations */}
                {shelters.map((shelter, index) => (
                    <Marker key={index} position={{ lat: shelter.lat, lng: shelter.lng }}>
                        <Popup>{shelter.name}</Popup>
                    </Marker>
                ))}

                {/* Danger Zones */}
                {dangerZones.map((zone, index) => (
                    <Circle key={index} center={{ lat: zone.lat, lng: zone.lng }} radius={zone.radius} pathOptions={{ color: "red" }} />
                ))}

                {/* Offline Route */}
                {route.length > 1 && <Polyline positions={route} color="blue" />}
            </MapContainer>
            <div>
    <button onClick={() => emergencyShelterInput(35.78, -78.62)}>📡 Add Emergency Shelter</button>
</div>

            <div className="navbar">
                <Link to="/">🏠 Home</Link>
            </div>
        </div>
    );
}

export default OfflineNavigation;
