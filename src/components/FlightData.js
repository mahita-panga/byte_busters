import React, { useEffect, useState, useContext } from 'react';
import MaintenanceTable from './MaintenanceTable';
import Riskometer from './Riskometer';
import { FlightContext } from '../FlightContext';

const FlightData = ({ flightNumber,healthData, nearByAssistance }) => {
  const { flightNumberModel } = useContext(FlightContext);
  const [flightData, setFlightData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlightData = async () => {
      setLoading(true);
      setError(null);

      try {
        const foundFlight = flightNumberModel[flightNumber];
        if (foundFlight) {
          setFlightData(foundFlight);
        } else {
          throw new Error('Flight data not found.');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (flightNumber) {
      fetchFlightData();
    }

  }, [flightNumber, flightNumberModel]);



  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!healthData) return null;

  return (
    <div>
      <h2>Flight Data for {flightNumber}</h2>
      <div className="grid-container" style={{ marginBottom: '20px' }}>
        <div className="glass-box">
          <Riskometer flightID={flightNumber} />
        </div>
        <div className="glass-box">
        <p>Near By Assistance: {nearByAssistance}</p>
        </div>
      </div>

      <div className="grid-container" style={{ marginBottom: '20px' }}>
        <div className="glass-box" >
          <p>Aircraft Type: {healthData.aircraft_type}</p>
        </div>
        <div className="glass-box">
          <p>Aircraft Mass: {healthData.aircraft_mass}</p>
        </div>
      </div>

      <div className="grid-container">
        <div className="glass-box" >
          <p>Aircraft Fuel: {healthData.aircraft_fuel}</p>
          <img
            src={'images/3d_co_emissions.png'}
            alt="Fuel Flow Graph"
          />
        </div>
        {/* Additional boxes with aircraft emissions data */}

        <div className="glass-box" >
          <p>CO2 Emissions: {healthData.aircraft_emissions.co2}</p>
          {/* <img
            src={flightData.filenames[1]}
            alt="H2O Emissions Graph"
          /> */}
        </div>
        <div className="glass-box" >
          <p>H2O Emissions: {healthData.aircraft_emissions.h2o}</p>
          {/* <img
            src={flightData.filenames[1]}
            alt="H2O Emissions Graph"
          /> */}
        </div>
        </div>
        <div className="grid-container" style={{ marginTop: '20px' }}>
        <div className="glass-box" style={{ width: '420px' }}>
          <p>SOx Emissions: {healthData.aircraft_emissions.sox}</p>
          {/* <img
            src={flightData.filenames[3]}
            alt="SOx Emissions Graph"
          /> */}
        </div>
        <div className="glass-box">
          <p>NOx Emissions: {healthData.aircraft_emissions.nox}</p>
          {/* <img
            src={flightData.filenames[4]}
            alt="NOx Emissions Graph"
          /> */}
        </div>

      </div>
      <h1>Maintenance History</h1>
      <MaintenanceTable flightNumber={flightNumber} />
    </div>
  );
};

export default FlightData;

