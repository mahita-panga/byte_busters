import React, { useState } from 'react';

const FlightSearch = ({ onSearch }) => {
  const [flightNumber, setFlightNumber] = useState('');
  // const [aircraftModel, setAircraftModel] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // onSearch(flightNumber, aircraftModel);
    onSearch(flightNumber);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={flightNumber}
        onChange={(e) => setFlightNumber(e.target.value)}
        placeholder="Enter Flight Number"
      />
      {/* <input
        type="text"
        value={aircraftModel}
        onChange={(e) => setAircraftModel(e.target.value)}
        placeholder="Enter Aircraft Model"
      /> */}
      <button type="submit">Search</button>
    </form>
  );
};

export default FlightSearch;
