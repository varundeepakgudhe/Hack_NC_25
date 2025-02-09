// import React from "react";
// import { Link } from "react-router-dom";
// import "./App.css"; // Use the same styling

// function AlertsPage() {
//     return (
//         <div className="phone-container">
//             {/* Header */}
//             <div className="header_alert">⚠️ ALERTS!!!!</div>

//             {/* Content */}
//             <div style={{ padding: "20px", textAlign: "center" }}>
//                 <h2>🚀 Welcome to the Sample Page!</h2>
//                 <p>This is a placeholder page to demonstrate navigation.</p>
//             </div>

//             {/* Back Button */}
//             <div className="navbar">
//                 <Link to="/alerts">⚠️</Link>
//                 <Link to="/">🏠</Link>
//                 <Link to="/ReliefNavigation">☠️</Link>
//                 <Link to="/finance">💵</Link>
//             </div>
//         </div>
//     );
// }

// export default AlertsPage;

import React from "react";
import { Link } from "react-router-dom";
import "./App.css"; // Add CSS for styling alerts

const alerts = [
    { id: 1, type: "🌪️ Tornado Watch", location: "Raleigh, NC", date: "Feb 15, 2025", message: "A Tornado Watch has been issued for Wake County. Strong winds and potential funnel clouds detected. Seek shelter and stay indoors." },
    { id: 2, type: "🌊 Flash Flood Warning", location: "Durham, NC", date: "Feb 18, 2025", message: "Heavy rainfall expected to exceed 3 inches in the next 24 hours. Flood-prone areas should prepare for evacuation orders." },
    { id: 3, type: "🔥 Wildfire Risk", location: "Asheville, NC", date: "Feb 22, 2025", message: "Dry conditions and high winds increase the risk of wildfires in the Appalachian region. Outdoor burning is prohibited." },
    { id: 4, type: "❄️ Winter Storm Advisory", location: "Charlotte, NC", date: "Feb 25, 2025", message: "Heavy snowfall up to 6 inches expected. Road conditions will be hazardous. Travel only if necessary." },
    { id: 5, type: "⚠️ Hazardous Chemical Spill", location: "Greensboro, NC", date: "Feb 28, 2025", message: "A chemical spill has been detected near industrial zones. Residents within a 5-mile radius should avoid the area and follow emergency instructions." }
];

function AlertsPage() {
    return (
        <div className="phone-container">
            {/* Header */}
            <div className="header-alert">⚠️ Emergency Alerts</div>

            {/* Alerts List */}
            <div className="alerts-list">
                {alerts.map((alert) => (
                    <div key={alert.id} className="alert-box">
                        <h3>{alert.type}</h3>
                        <p><strong>📍 Location:</strong> {alert.location}</p>
                        <p><strong>📅 Expected Date:</strong> {alert.date}</p>
                        <p>{alert.message}</p>
                    </div>
                ))}
            </div>

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

export default AlertsPage;
