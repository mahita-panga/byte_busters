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
    <h2>Near By Assistance</h2>
    {nearByAssistance.name && <p>Nearest Airport: {nearByAssistance.name}</p>}
    {nearByAssistance.latitude_deg && <p>Latitude: {nearByAssistance.latitude_deg}</p>}
    {nearByAssistance.longitude_deg && <p>Longitude: {nearByAssistance.longitude_deg}</p>}
    {nearByAssistance.elevation_ft && <p>Elevation of Airport (feet): {nearByAssistance.elevation_ft}</p>}
    {nearByAssistance.gps_code && <p>GPS Code: {nearByAssistance.gps_code}</p>}
    {nearByAssistance.iata_code && <p>IATA code: {nearByAssistance.iata_code}</p>}
    {nearByAssistance.municipality && <p>City: {nearByAssistance.municipality}</p>}
    {nearByAssistance.home_link && (
        <p>
            Website Link: <a href={nearByAssistance.home_link}>{nearByAssistance.home_link}</a>
        </p>
    )}
</div>
      </div>

      <div className="grid-container" style={{ marginBottom: '20px' }}>
        <div className="glass-box" >
          <p>Aircraft Type: {healthData.aircraft_type}</p>
        </div>
        <div className="glass-box">
          <p>Aircraft Mass: {healthData.aircraft_mass} Kg</p>
        </div>
      </div>

      <div className="grid-container">
        <div className="glass-box" >
          <p>Aircraft Fuel: {healthData.aircraft_fuel} Kg</p>
          <img

            src={`https://airbushack.s3.ap-south-1.amazonaws.com/${healthData.filenames[0]}`}

            alt="Fuel Flow Graph"
          />
        </div>
     

        <div className="glass-box" >
          <p>CO2 Emissions: {healthData.aircraft_emissions.co2} g/s </p>
          <img
            src={`https://airbushack.s3.ap-south-1.amazonaws.com/${healthData.filenames[2]}`}
            alt="co2 Emissions Graph"
          />
        </div>
        <div className="glass-box" >
          <p>H2O Emissions: {healthData.aircraft_emissions.h2o} g/s </p>
          <img
            src={`https://airbushack.s3.ap-south-1.amazonaws.com/${healthData.filenames[1]}`}
            alt="H2O Emissions Graph"
          />
        </div>
        <div className="glass-box" >
          <p>SOx Emissions: {healthData.aircraft_emissions.sox} g/s </p>
          <img
            src={`https://airbushack.s3.ap-south-1.amazonaws.com/${healthData.filenames[3]}`}
            alt="SOx Emissions Graph"
          />
        </div>
        <div className="glass-box" >
          <p>NOx Emissions: {healthData.aircraft_emissions.nox} g/s </p>
          <img
           src={`https://airbushack.s3.ap-south-1.amazonaws.com/${healthData.filenames[4]}`}
            alt="NOx Emissions Graph"
          />
        </div>

        </div>
       
      <h1>Maintenance History</h1>
      <MaintenanceTable flightNumber={flightNumber} />
    </div>
  );
};

export default FlightData;

