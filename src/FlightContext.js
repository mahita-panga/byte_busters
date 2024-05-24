import React, { createContext, useState } from 'react';

export const FlightContext = createContext();

export const FlightProvider = ({ children }) => {
  const [flightNumberModel, setFlightNumberModel] = useState({});

  return (
    <FlightContext.Provider value={{ flightNumberModel, setFlightNumberModel }}>
      {children}
    </FlightContext.Provider>
  );
};
