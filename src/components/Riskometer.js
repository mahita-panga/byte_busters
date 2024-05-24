// // Riskometer.js
// import React from 'react';
// import ReactSpeedometer from 'react-d3-speedometer';
// import { generateFlightHealthConditions } from './MaintanaceData';

// const Riskometer = () => {
//   // Generate sample flight health conditions
//   const flightHealth = generateFlightHealthConditions(1); // Provide a flight ID

//   // Map engine health to a numeric value for the speedometer
//   let riskLevel;
//   switch (flightHealth.engineHealth) {
//     case 'Good':
//       riskLevel = 33;
//       break;
//     case 'Fair':
//       riskLevel = 66;
//       break;
//     case 'Poor':
//       riskLevel = 100;
//       break;
//     default:
//       riskLevel = 0;
//   }

//   return (
//     <div>
//       <h2>Riskometer</h2>
//       <ReactSpeedometer
//         value={riskLevel}
//         minValue={0}
//         maxValue={100}
//         segments={3}
//         segmentColors={['green', 'orange', 'red']}
//         needleColor="steelblue"
//         textColor="black"
//       />
//       <p style={{marginTop:'-6rem'}}> Engine Health: {flightHealth.engineHealth}</p>
//       <p>System Checks: {flightHealth.systemChecks}</p>
//       <p>Sensor Readings: {flightHealth.sensorReadings}</p>
//     </div>
//   );
// };

// export default Riskometer;

// Riskometer.js
import React, { useEffect, useState } from 'react';
import ReactSpeedometer from 'react-d3-speedometer';
import { generateMaintenanceHistory } from './MaintanaceData';

const Riskometer = ({ flightID }) => {
  const [riskLevel, setRiskLevel] = useState(0);
  const [flightHealth, setFlightHealth] = useState({});

  useEffect(() => {
    // Generate sample flight health conditions
    const flightData = generateMaintenanceHistory(flightID); // Provide a flight ID
    setRiskLevel(flightData.riskLevel);
    setFlightHealth(flightData);
  }, [flightID]);

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
        textColor="black"
      />
      <p style={{ marginTop: '-6rem' }}>Risk Level: {riskLevel.toFixed(2)}</p>
      <p>Maintenance Type: {flightHealth.maintenanceType}</p>
      <p>Parts Replaced: {flightHealth.partsReplaced}</p>
      <p>Next Scheduled Maintenance: {new Date(flightHealth.nextScheduledMaintenance).toLocaleDateString()}</p>
    </div>
  );
};

export default Riskometer;
