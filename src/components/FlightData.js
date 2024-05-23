import React, { useEffect, useState } from 'react';
import MaintenanceTable from './MaintenanceTable';
import Riskometer from './Riskometer'; 


const dummyFlightData = [
  {
    flight_number: 'CA4123',
    aircraft_model: 'A320',
    aircraft_type: 'Airbus A320',
    aircraft_fuel: 8581.967767333903,
    aircraft_mass: 66300,
    aircraft_emissions: {
      co2: 27024616.499334462,
      h2o: 10555820.3538207,
      sox: 7208.852924560478,
      nox: 251610.59548776058
    },
    filenames: [
      "images/3d_fuel_flow.png",
      "images/3d_h2o_emissions.png",
      "images/3d_co2_emissions.png",
      "images/3d_sox_emissions.png",
      "images/3d_nox_emissions.png",
      "images/3d_co_emissions.png",
      "images/3d_hc_emissions.png"
    ],
  }
];

const FlightData = ({ flightNumber }) => {
  const [flightData, setFlightData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!flightNumber) return;

    setLoading(true);
    setError(null);

    setTimeout(() => {
      const foundFlight = dummyFlightData.find(flight => flight.flight_number === flightNumber); 
      if (foundFlight) {
        setFlightData(foundFlight);
        setLoading(false);
        // console.log('hhhhhhh',flightNumbers);
      } else {
        setError('Flight data not found.');
        setLoading(false);
      }
    }, 1000);
  }, [flightNumber]);

  const handleClick = (e) => {
    const box = e.currentTarget;
    box.classList.toggle('active');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!flightData) return null;


  return (
    <div>
      <h2>Flight Data for {flightNumber}</h2>
      <div className="grid-container" style={{marginBottom : '20px'}}>
      <div className="glass-box">
      <Riskometer />
        </div>
      </div>
     
        
      <div className="grid-container" style={{marginBottom : '20px'}}>
      <div className="glass-box">
          <p>Aircraft Type: {flightData.aircraft_type}</p>
        </div>
        <div className="glass-box">
          <p>Aircraft Mass: {flightData.aircraft_mass}</p>
        </div>
      </div>
     
      <div className="grid-container">
     
     
        <div className="glass-box" onClick={handleClick}>
          <p>Aircraft Fuel: {flightData.aircraft_fuel}</p>
          <img
            src={flightData.filenames[0]}
            alt="Fuel Flow Graph"
          />
        </div>
        <div className="glass-box" onClick={handleClick}>
          <p>CO2 Emissions: {flightData.aircraft_emissions.co2}</p>
          <img
            src={flightData.filenames[2]}
            alt="CO2 Emissions Graph"
          />
        </div>
        <div className="glass-box" onClick={handleClick}>
          <p>H2O Emissions: {flightData.aircraft_emissions.h2o}</p>
          <img
            src={flightData.filenames[1]}
            alt="H2O Emissions Graph"
          />
        </div>
        <div className="glass-box" onClick={handleClick}>
          <p>SOx Emissions: {flightData.aircraft_emissions.sox}</p>
          <img
            src={flightData.filenames[3]}
            alt="SOx Emissions Graph"
          />
        </div>
        <div className="glass-box" onClick={handleClick}>
          <p>NOx Emissions: {flightData.aircraft_emissions.nox}</p>
          <img
            src={flightData.filenames[4]}
            alt="NOx Emissions Graph"
          />
        </div>
      </div>
      <h1>Maintenance History</h1>
      <MaintenanceTable />
      
    </div>
  );
};

export default FlightData;

// export default FlightData;

// import React, { useEffect, useState, useContext } from 'react';
// import MaintenanceTable from './MaintenanceTable';
// import Riskometer from './Riskometer';
// import { FlightContext } from '../FlightContext';

// const FlightData = ({ flightNumber }) => {
//   const { flightNumberModel } = useContext(FlightContext);
//   const [flightData, setFlightData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchFlightData = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const foundFlight = flightNumberModel[flightNumber];
//         if (foundFlight) {
//           setFlightData(foundFlight);
//         } else {
//           throw new Error('Flight data not found.');
//         }
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (flightNumber) {
//       fetchFlightData();
//     }

//   }, [flightNumber, flightNumberModel]);

//   const handleClick = (e) => {
//     const box = e.currentTarget;
//     box.classList.toggle('active');
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;
//   if (!flightData) return null;

//   return (
//     <div>
//       <h2>Flight Data for {flightNumber}</h2>
//       <div className="grid-container" style={{ marginBottom: '20px' }}>
//         <div className="glass-box">
//           <Riskometer />
//         </div>
//       </div>

//       <div className="grid-container" style={{ marginBottom: '20px' }}>
//         <div className="glass-box">
//           <p>Aircraft Type: {flightData.aircraft_type}</p>
//         </div>
//         <div className="glass-box">
//           <p>Aircraft Mass: {flightData.aircraft_mass}</p>
//         </div>
//       </div>

//       <div className="grid-container">
//         <div className="glass-box" onClick={handleClick}>
//           <p>Aircraft Fuel: {flightData.aircraft_fuel}</p>
//           <img
//             src={flightData.filenames[0]}
//             alt="Fuel Flow Graph"
//           />
//         </div>
//         {/* Additional boxes with aircraft emissions data */}
//       </div>
//       <h1>Maintenance History</h1>
//       <MaintenanceTable />
//     </div>
//   );
// };

// export default FlightData;

