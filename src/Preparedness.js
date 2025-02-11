import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import axios from "axios";
import OpenAI from "openai";

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
            const openai = new OpenAI({
                apiKey: process.env.REACT_APP_OPENAI_API_KEY,dangerouslyAllowBrowser: true});
    
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    {
                        role: "user",
                        content:` Given the following disaster scenario in ${location}:
                        ${scenario}
                        
                        Generate three detailed plans of action, helping users to navigate through the situation and be well prepared. 
                        Give a concise response for each plan, including the steps to take, resources to use, and any other relevant information. 
                        Keep the response within 100 words and ensure there are no hashtags or stars or any symbols in output, making it print-friendly.
                        Give each plan is separated by ##`,
                        
                        
                    },
                ],
                store: true,
            });

            let plansData = response.choices[0].message.content.split("##");//response.data.choices[0].message.content.split("\n\n"); // Convert text into an array
            // if (typeof plansData === "string") {
            //     plansData = plansData.split("\n\n");  // Convert text into an array
            // }
            console.log(plansData);
            setActionPlans(plansData);
            // response.then((result) => console.log(result.choices[0].message));

    
        } catch (err) {
            const errorMessage = `❌ Failed to fetch action plans. ${err.message || err}`;
            setError(errorMessage);
            console.error("Error fetching action plans:", err);
        }
    };

    return (
            <div className="phone-container">
            {/* Header */}
            <div className="header">📌 Disaster Preparedness</div>

            {/* Disaster Scenario Selection */}
            <div style={styles.section}>
                <label style={styles.label}>🌍 Select a Disaster Scenario: </label>
                <select style={styles.select} value={scenario} onChange={(e) => setScenario(e.target.value)}>
                    <option value="">-- Select --</option>
                    {disasterOptions.map((disaster, index) => (
                        <option key={index} value={disaster}>{disaster}</option>
                    ))}
                </select>
                 <br></br><br></br>
                <label style={styles.label}>📍Enter Your Location: </label>
                <input
                    type="text"
                    placeholder="Enter city or coordinates"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={styles.input}
                />
                 <br></br><br></br>
                <button onClick={fetchActionPlans} style={styles.button}>📋 Generate Action Plan</button>

                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
   
            {/* Display Action Plans */}
            {actionPlans.length > 0 && (
                <div className="actionplan-list">
                    <h2 >📋 Your Action Plan:</h2>
                    <ul>
                        {actionPlans.map((plan, index) => (
                            <li key={index} style={styles.listItem}>{plan}</li>
                        ))}
                    </ul>
                </div>
            )}

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

export default Preparedness;
