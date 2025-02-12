import React, { useState, useEffect } from "react";

function StatusBar() {
    const [time, setTime] = useState(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).replace("AM", "").replace("PM", "").trim()
    );
    const [battery, setBattery] = useState(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).replace("AM", "").replace("PM", "").trim());
        }, 60000); // Updates every minute

        navigator.getBattery?.().then(battery => {
            
            setBattery(Math.round(battery.level * 100) + "%");
        });

        const handleOnlineStatus = () => setIsOnline(navigator.onLine);
        window.addEventListener("online", handleOnlineStatus);
        window.addEventListener("offline", handleOnlineStatus);

        return () => {
            clearInterval(interval);
            window.removeEventListener("online", handleOnlineStatus);
            window.removeEventListener("offline", handleOnlineStatus);
        };
    }, []);

    return (
        <div className="mobile-status-bar">
            <span className="time">{time}</span>
            <div className="status-icons">
                <span className="wifi">{isOnline ? "📶" : "❌"}</span>
                <span className="battery">🔋{battery || "80%"}</span>
            </div>
        </div>
    );
}

export default StatusBar;
