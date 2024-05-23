// // FlightContext.js
// import React, { createContext, useState } from 'react';

// export const FlightContext = createContext();

// export const FlightProvider = ({ children }) => {
//   const {flightNumbers, setFlightNumbers} = useState({});

//   return (
//     <FlightContext.Provider value={{ flightNumbers, setFlightNumbers}}>
//       {children}
//     </FlightContext.Provider>
//   );
// };

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
