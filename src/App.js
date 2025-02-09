// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// // export default App;


// new code down

// import React from "react";
// import { useGeolocated } from "react-geolocated";

// function App() {
//     const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
//         positionOptions: {
//             enableHighAccuracy: true,
//         },
//         userDecisionTimeout: 5000,
//     });

//     if (!isGeolocationAvailable) {
//         return <h2>❌ Geolocation is not available on this browser.</h2>;
//     }

//     if (!isGeolocationEnabled) {
//         return <h2>⚠️ Geolocation is disabled. Please enable location access.</h2>;
//     }

//     return (
//         <div style={{ textAlign: "center", padding: "20px" }}>
//             <h1>📍 Disaster Navigation Web App</h1>
//             {coords ? (
//                 <h2>
//                     🌍 Latitude: {coords.latitude} <br />
//                     📍 Longitude: {coords.longitude}
//                 </h2>
//             ) : (
//                 <h2>Fetching location...</h2>
//             )}
//         </div>
//     );
// }

// export default App;


// //new code 2 
// import React from "react";
// import { useGeolocated } from "react-geolocated";
// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// const GOOGLE_MAPS_API_KEY = "AIzaSyBo_OfruLbbmPSaM-H19PD4Givdmes0RgI"; // Replace with your API key

// const mapContainerStyle = {
//     width: "100%",
//     height: "500px",
// };

// function App() {
//     const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
//         positionOptions: { enableHighAccuracy: true },
//         userDecisionTimeout: 5000,
//     });

//     if (!isGeolocationAvailable) {
//         return <h2>❌ Geolocation is not available on this browser.</h2>;
//     }

//     if (!isGeolocationEnabled) {
//         return <h2>⚠️ Geolocation is disabled. Please enable location access.</h2>;
//     }

//     return (
//         <div style={{ textAlign: "center", padding: "20px" }}>
//             <h1>📍 Disaster Navigation Web App</h1>
//             {coords ? (
//                 <>
//                     <h2>
//                         🌍 Latitude: {coords.latitude} <br />
//                         📍 Longitude: {coords.longitude}
//                     </h2>
//                     <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
//                         <GoogleMap
//                             mapContainerStyle={mapContainerStyle}
//                             center={{ lat: coords.latitude, lng: coords.longitude }}
//                             zoom={15}
//                         >
//                             <Marker position={{ lat: coords.latitude, lng: coords.longitude }} />
//                         </GoogleMap>
//                     </LoadScript>
//                 </>
//             ) : (
//                 <h2>Fetching location...</h2>
//             )}
//         </div>
//     );
// }

// export default App;


//new code 3. this searches from google for shelters.

// import React, { useState, useEffect } from "react";
// import { useGeolocated } from "react-geolocated";
// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
// import axios from "axios";

// const GOOGLE_MAPS_API_KEY = "AIzaSyBo_OfruLbbmPSaM-H19PD4Givdmes0RgI"; // Replace with your API Key

// const mapContainerStyle = {
//     width: "100%",
//     height: "500px",
// };

// function App() {
//     const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
//         positionOptions: { enableHighAccuracy: true },
//         userDecisionTimeout: 5000,
//     });

//     const [shelters, setShelters] = useState([]);

//     // Fetch nearby shelters
//     useEffect(() => {
//         if (coords) {
//             const fetchShelters = async () => {
//                 const response = await axios.get(
//                     `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coords.latitude},${coords.longitude}&radius=5000&type=shelter&key=${GOOGLE_MAPS_API_KEY}`
//                 );
//                 setShelters(response.data.results);
//             };

//             fetchShelters();
//         }
//     }, [coords]);

//     if (!isGeolocationAvailable) {
//         return <h2>❌ Geolocation is not available on this browser.</h2>;
//     }

//     if (!isGeolocationEnabled) {
//         return <h2>⚠️ Geolocation is disabled. Please enable location access.</h2>;
//     }

//     return (
//         <div style={{ textAlign: "center", padding: "20px" }}>
//             <h1>📍 Disaster Navigation Web App</h1>
//             {coords ? (
//                 <>
//                     <h2>
//                         🌍 Latitude: {coords.latitude} <br />
//                         📍 Longitude: {coords.longitude}
//                     </h2>
//                     <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
//                         <GoogleMap
//                             mapContainerStyle={mapContainerStyle}
//                             center={{ lat: coords.latitude, lng: coords.longitude }}
//                             zoom={14}
//                         >
//                             {/* User's Location */}
//                             <Marker position={{ lat: coords.latitude, lng: coords.longitude }} />

//                             {/* Shelter Locations */}
//                             {shelters.map((shelter, index) => (
//                                 <Marker
//                                     key={index}
//                                     position={{
//                                         lat: shelter.geometry.location.lat,
//                                         lng: shelter.geometry.location.lng,
//                                     }}
//                                     title={shelter.name}
//                                     icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
//                                 />
//                             ))}
//                         </GoogleMap>
//                     </LoadScript>
//                 </>
//             ) : (
//                 <h2>Fetching location...</h2>
//             )}
//         </div>
//     );
// }

// export default App;



//new code 4
import React from "react";
import { useGeolocated } from "react-geolocated";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = "AIzaSyBo_OfruLbbmPSaM-H19PD4Givdmes0RgI"; // Replace with your API Key

const mapContainerStyle = {
    width: "100%",
    height: "500px",
};

// 🔹 Manually define shelter locations
const manualShelters = [
    { name: "Shelter 1", lat: 35.7796, lng: -78.6382 },
    { name: "Shelter 2", lat: 35.7746, lng: -78.6400 },
    { name: "Shelter 3", lat: 35.7721, lng: -78.6500 },
];

function App() {
    const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
        positionOptions: { enableHighAccuracy: true },
        userDecisionTimeout: 5000,
    });

    if (!isGeolocationAvailable) {
        return <h2>❌ Geolocation is not available on this browser.</h2>;
    }

    if (!isGeolocationEnabled) {
        return <h2>⚠️ Geolocation is disabled. Please enable location access.</h2>;
    }

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>📍 Disaster Navigation Web App</h1>
            {coords ? (
                <>
                    <h2>
                        🌍 Latitude: {coords.latitude} <br />
                        📍 Longitude: {coords.longitude}
                    </h2>
                    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={{ lat: coords.latitude, lng: coords.longitude }}
                            zoom={14}
                        >
                            {/* User's Location */}
                            <Marker position={{ lat: coords.latitude, lng: coords.longitude }} />

                            {/* Manually Added Shelters */}
                            {manualShelters.map((shelter, index) => (
                                <Marker
                                    key={index}
                                    position={{ lat: shelter.lat, lng: shelter.lng }}
                                    title={shelter.name}
                                    icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                                />
                            ))}
                        </GoogleMap>
                    </LoadScript>
                </>
            ) : (
                <h2>Fetching location...</h2>
            )}
        </div>
    );
}

export default App;
