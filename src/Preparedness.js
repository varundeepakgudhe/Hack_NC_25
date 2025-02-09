import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import axios from "axios";


const styles = {
   
    

};

const disasterOptions = ["Earthquake", "Flood", "Hurricane", "Tornado", "Wildfire"];

function Preparedness() {
    const [scenario, setScenario] = useState("");
    const [location, setLocation] = useState("");
    const [actionPlans, setActionPlans] = useState([]);
    const [error, setError] = useState("");

    const fetchActionPlans = async () => {
        if (!scenario || !location) {
            setError("⚠️ Please select a disaster scenario and enter your location.");
            return;
        }

        setError(""); // Clear any previous errors

        try {
            const response = await axios.post("http://127.0.0.1:5001/api/action_plans", {
                scenario: scenario.toLowerCase(),
                location: location,
            });

            console.log("API Response:", response.data);

            let plansData = response.data.plans;

            // ✅ Ensure plans is an array before setting state
            if (typeof plansData === "string") {
                plansData = plansData.split("\n\n");  // Convert text into an array
            }
            setActionPlans(response.data.plans);
            
        } catch (err) {
            setError("❌ Failed to fetch action plans. Please try again.");
            console.error("Error fetching action plans:", err);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>📌 Disaster Preparedness</div>

            {/* Disaster Scenario Selection */}
            <div style={styles.section}>
                <label style={styles.label}>🌍 Select a Disaster Scenario:</label>
                <select style={styles.select} value={scenario} onChange={(e) => setScenario(e.target.value)}>
                    <option value="">-- Select Scenario --</option>
                    {disasterOptions.map((disaster, index) => (
                        <option key={index} value={disaster}>{disaster}</option>
                    ))}
                </select>

                <label style={styles.label}>📍 Enter Your Location:</label>
                <input
                    type="text"
                    placeholder="Enter city or coordinates"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={styles.input}
                />

                <button onClick={fetchActionPlans} style={styles.button}>📋 Generate Action Plan</button>

                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
   
            {/* Display Action Plans */}
            {actionPlans.length > 0 && (
                <div style={styles.section}>
                    <h2 style={styles.label}>📋 Your Action Plan:</h2>
                    <ul>
                        {actionPlans.map((plan, index) => (
                            <li key={index} style={styles.listItem}>🔹 {plan}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="navbar">
                <Link to="/preparedness">ℹ️</Link>
                <Link to="/alerts">⚠️</Link>
                <Link to="/">🏠</Link>
                <Link to="/ReliefNavigation">☠️</Link>
                <Link to="/finance">💵</Link>
            </div>
        </div>
    );
}

export default Preparedness;
