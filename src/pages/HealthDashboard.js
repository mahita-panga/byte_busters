// import React, { useState } from 'react';
// import FlightSearch from '../components/FlightSearch';
// import FlightData from '../components/FlightData';

// const HealthDashboard = () => {
//     const [flightNumber, setFlightNumber] = useState('');
//     const [showImage, setShowImage] = useState(true);
//     const [error, setError] = useState('');

//     const handleSearch = (number) => {
//         if (number.trim() === '') {
//             setError('Please enter a flight number');
//         } else {
//             setFlightNumber(number);
//             setShowImage(false);
//             setError('');
//         }
//     }

//     return (
//         <div className="App">
//             <h1>Flight Health Dashboard</h1>
//             <FlightSearch onSearch={handleSearch} />
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//             {showImage && (
//                 <img className='gif' src='https://ugokawaii.com/wp-content/uploads/2023/04/plane.gif' alt="Plane GIF" />
//             )}
//             {flightNumber && <FlightData flightNumber={flightNumber} />}
//         </div>
//     );
// }

// export default HealthDashboard;

import React, { useEffect,useState, useContext } from "react";
import FlightSearch from "../components/FlightSearch";
import FlightData from "../components/FlightData";
import { FlightContext } from "../FlightContext";
import axios from "axios";
const HealthDashboard = () => {
  const [flightNumber, setFlightNumber] = useState("");
  const [showImage, setShowImage] = useState(true);
  const [error, setError] = useState("");
  const { flightNumberModel } = useContext(FlightContext);
  const [healthData, sethealthData] = useState("");
  const[nearByAssistance,setNearByAssistance]=useState("");
//   const handleSearch = async (number) => {
//     if (number.trim() === "") {
//       setError("Please enter a flight number");
//     } else {
//       setFlightNumber(number);
//       setShowImage(false);
//       setError("");
//       console.log("list", flightNumberModel);
//       // Search for flight number in flightNumberModel and print its aircraft model
//       const aircraftModel = flightNumberModel[number].model;
//       console.log("aaaaaaa",aircraftModel)
//       if (aircraftModel) {
//         console.log("Flight Number:", number);
//         console.log("Aircraft Model:", aircraftModel);

//         const response = await axios.post("http://127.0.0.1:8000/aircraft", {
//           flight_number: number,
//           aircraft_model: aircraftModel,
//         });
// sethealthData(response.data);

// const response_nearByAssistance=await axios.post("http://127.0.0.1:8000/nearest_airport", {
    
//         "current_pos": [
//             flightNumberModel[number].latitude,flightNumberModel[number].longitude
//         ]
      
//   });
//   console.log(response_nearByAssistance.data.name)
//   setNearByAssistance(response_nearByAssistance.data.name);
//       } else {
//         console.log("Flight data not found.");
//       }

    
//     }
//   };

const handleSearch = async (number) => {
    if (number.trim() === "") {
      setError("Please enter a flight number");
    } else {
      setFlightNumber(number);
      setShowImage(false);
      setError("");
  
      // Check if flightNumberModel contains data for the entered flight number
      if (flightNumberModel && flightNumberModel[number]) {
        const aircraftModel = flightNumberModel[number].model;
        console.log("Aircraft Model:", aircraftModel);
  
        const response = await axios.post("http://127.0.0.1:8000/aircraft", {
          flight_number: number,
          aircraft_model: aircraftModel,
        });
        sethealthData(response.data);
  
        const response_nearByAssistance = await axios.post("http://127.0.0.1:8000/nearest_airport", {
          "current_pos": [
            flightNumberModel[number].latitude,
            flightNumberModel[number].longitude
          ]
        });
        console.log(response_nearByAssistance.data.name)
        setNearByAssistance(response_nearByAssistance.data.name);
      } else {
        // Flight data not found
        console.log("Flight data not found for flight number:", number);
       
      }
    }
  };
  


  useEffect(() => {
    console.log("healthData", healthData);
  }, [healthData]);
  return (
    <div className="App">
      <h1>Flight Health Dashboard</h1>
      <FlightSearch onSearch={handleSearch} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {showImage && (
        <img
          className="gif"
          src="https://ugokawaii.com/wp-content/uploads/2023/04/plane.gif"
          alt="Plane GIF"
        />
      )}
      {flightNumber && <FlightData flightNumber={flightNumber} healthData={healthData} nearByAssistance={nearByAssistance}/>}
    </div>
  );
};

export default HealthDashboard;
