// Riskometer.js
import React from 'react';
import ReactSpeedometer from 'react-d3-speedometer';
import { generateFlightHealthConditions } from './MaintanaceData';

const Riskometer = () => {
  // Generate sample flight health conditions
  const flightHealth = generateFlightHealthConditions(1); // Provide a flight ID

  // Map engine health to a numeric value for the speedometer
  let riskLevel;
  switch (flightHealth.engineHealth) {
    case 'Good':
      riskLevel = 33;
      break;
    case 'Fair':
      riskLevel = 66;
      break;
    case 'Poor':
      riskLevel = 100;
      break;
    default:
      riskLevel = 0;
  }

  return (
    <div>
      <h2>Riskometer</h2>
      <ReactSpeedometer
        value={riskLevel}
        minValue={0}
        maxValue={100}
        segments={3}
        segmentColors={['green', 'orange', 'red']}
        needleColor="steelblue"
        textColor="white"
      />
      <p style={{marginTop:'-6rem'}}> Engine Health: {flightHealth.engineHealth}</p>
      <p>System Checks: {flightHealth.systemChecks}</p>
      <p>Sensor Readings: {flightHealth.sensorReadings}</p>
    </div>
  );
};

export default Riskometer;
