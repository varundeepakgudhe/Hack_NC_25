import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
const InsuranceRecommendation = () => {
    const [scenario, setScenario] = useState('');
    const [location, setLocation] = useState('');
    const [insuranceRecommendation, setInsuranceRecommendation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleScenarioChange = (e) => {
        setScenario(e.target.value);
    };

    const handleLocationChange = (e) => {
        setLocation(e.target.value);
    };

    const fetchInsuranceRecommendations = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:5001/recommend_insurance', {
                scenario: scenario,
                location: location
            });
            // The backend returns a single recommendation text in insurance_recommendations
            setInsuranceRecommendation(response.data.insurance_recommendations);
        } catch (error) {
            setError('Failed to fetch insurance recommendations');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Insurance Recommendation for Disaster Scenarios</h1>

            <div>
                <label>
                    Scenario Description:
                    <textarea
                        value={scenario}
                        onChange={handleScenarioChange}
                        placeholder="Describe the disaster scenario"
                    />
                </label>
            </div>

            <div>
                <label>
                    Location:
                    <input
                        type="text"
                        value={location}
                        onChange={handleLocationChange}
                        placeholder="Enter your location"
                    />
                </label>
            </div>

            <button onClick={fetchInsuranceRecommendations} disabled={loading}>
                {loading ? 'Loading...' : 'Get Insurance Recommendations'}
            </button>

            {error && <p>{error}</p>}

            {insuranceRecommendation && (
                <div>
                    <h2>Recommended Insurance Policies:</h2>
                    <p>{insuranceRecommendation}</p>
                </div>
            )}
           
        </div>
    );
};

export default InsuranceRecommendation;
