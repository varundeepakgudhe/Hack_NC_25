import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create Context
export const DataContext = createContext();

// Provider Component
export const DataProvider = ({ children }) => {
    const [shelters, setShelters] = useState([]);
    const [dangerZones, setDangerZones] = useState([]);
    const [restrictedRoads, setRestrictedRoads] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [shelterRes, dangerRes, roadRes] = await Promise.all([
                    axios.get("http://127.0.0.1:5001/api/shelters"),
                    axios.get("http://127.0.0.1:5001/api/danger_zones"),
                    axios.get("http://127.0.0.1:5001/api/restricted_roads"),
                ]);
                setShelters(shelterRes.data);
                setDangerZones(dangerRes.data);
                setRestrictedRoads(roadRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []); // Runs only once on mount

    return (
        <DataContext.Provider value={{ shelters, dangerZones, restrictedRoads }}>
            {children}
        </DataContext.Provider>
    );
};
