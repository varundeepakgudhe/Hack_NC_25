import React from "react";
import { Link } from "react-router-dom";
import "./App.css"; // Use the same styling

function AlertsPage() {
    return (
        <div className="phone-container">
            {/* Header */}
            <div className="header">📄 Sample Page</div>

            {/* Content */}
            <div style={{ padding: "20px", textAlign: "center" }}>
                <h2>🚀 Welcome to the Sample Page!</h2>
                <p>This is a placeholder page to demonstrate navigation.</p>
            </div>

            {/* Back Button */}
            <div className="navbar">
                <Link to="/" className="btn recalculate-button">⬅️ Back to Home</Link>
            </div>
        </div>
    );
}

export default AlertsPage;
