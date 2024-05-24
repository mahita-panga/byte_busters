// import React, { useEffect,useState, useContext } from "react";
// import FlightSearch from "../components/FlightSearch";
// import FlightData from "../components/FlightData";
// import { FlightContext } from "../FlightContext";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";


// const HealthDashboard = () => {
//   const [flightNumber, setFlightNumber] = useState("");
//   const [showImage, setShowImage] = useState(true);
//   const [error, setError] = useState("");
//   const { flightNumberModel } = useContext(FlightContext);
//   const [healthData, sethealthData] = useState("");
//   const[nearByAssistance,setNearByAssistance]=useState("");
//   const navigate = useNavigate();

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

// const handleSearch = async (number) => {
//     if (number.trim() === "") {
//       setError("Please enter a flight number");
//     } else {
//       setFlightNumber(number);
//       setShowImage(false);
//       setError("");
  
//       // Check if flightNumberModel contains data for the entered flight number
//       if (flightNumberModel && flightNumberModel[number]) {
//         const aircraftModel = flightNumberModel[number].model;
//         console.log("Aircraft Model:", aircraftModel);
  
//         const response = await axios.post("http://127.0.0.1:8000/aircraft", {
//           flight_number: number,
//           aircraft_model: aircraftModel,
//         });
//         sethealthData(response.data);
  
//         const response_nearByAssistance = await axios.post("http://127.0.0.1:8000/nearest_airport", {
//           "current_pos": [
//             flightNumberModel[number].latitude,
//             flightNumberModel[number].longitude
//           ]
//         });
//         console.log(response_nearByAssistance.data.name)
//         setNearByAssistance(response_nearByAssistance.data.name);
//       } else {
//         // Flight data not found
//         console.log("Flight data not found for flight number:", number);
       
//       }
//     }
//   };
  


//   useEffect(() => {
//     console.log("healthData", healthData);
//     const wasReloaded = localStorage.getItem("wasReloaded");

//     if (wasReloaded) {
//       navigate("/");
//     } else {
//       localStorage.setItem("wasReloaded", "true");
//     }

//     // Cleanup function to prevent memory leaks
//     return () => {
//       localStorage.removeItem("wasReloaded");
//     };
//   }, [healthData, navigate]);


//   return (
//     <div className="App">
//       <h1>Flight Health Dashboard</h1>
//       <FlightSearch onSearch={handleSearch} />
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {showImage && (
//         <img
//           className="gif"
//           src="https://ugokawaii.com/wp-content/uploads/2023/04/plane.gif"
//           alt="Plane GIF"
//         />
//       )}
//       {flightNumber && <FlightData flightNumber={flightNumber} healthData={healthData} nearByAssistance={nearByAssistance}/>}
//     </div>
//   );
// };

// export default HealthDashboard;


// import React, { useEffect, useState, useContext } from "react";
// import FlightSearch from "../components/FlightSearch";
// import FlightData from "../components/FlightData";
// import { FlightContext } from "../FlightContext";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const HealthDashboard = () => {
//   const [flightNumber, setFlightNumber] = useState("");
//   const [showImage, setShowImage] = useState(true);
//   const [error, setError] = useState("");
//   const { flightNumberModel } = useContext(FlightContext);
//   const [healthData, sethealthData] = useState("");
//   const [nearByAssistance, setNearByAssistance] = useState("");
//   const navigate = useNavigate();

//   const handleSearch = async (number) => {
//     if (number.trim() === "") {
//       setError("Please enter a flight number");
//     } else {
//       setFlightNumber(number);
//       setShowImage(false);
//       setError("");

//       if (flightNumberModel && flightNumberModel[number]) {
//         const aircraftModel = flightNumberModel[number].model;

//         const response = await axios.post("http://65.2.161.206:8000/aircraft", {
//           flight_number: number,
//           aircraft_model: aircraftModel,
//         });
//         sethealthData(response.data);

//         const response_nearByAssistance = await axios.post(
//           "http://65.2.161.206:8000/nearest_airport",
//           {
//             current_pos: [
//               flightNumberModel[number].latitude,
//               flightNumberModel[number].longitude,
//             ],
//           }
//         );
//         setNearByAssistance(response_nearByAssistance.data.name);
//       } else {
//         console.log("Flight data not found for flight number:", number);
//         // sethealthData(null); 
//       }
//     }
//   };

//   useEffect(() => {
//     console.log("healthData", healthData);
//     const wasReloaded = localStorage.getItem("wasReloaded");

//     if (wasReloaded) {
//       navigate("/");
//     } else {
//       localStorage.setItem("wasReloaded", "true");
//     }

//     // Cleanup function to prevent memory leaks
//     return () => {
//       localStorage.removeItem("wasReloaded");
//     };
//   }, [healthData, navigate]);

//   return (
//     <div className="App">
//       <h1>Flight Health Dashboard</h1>
//       <FlightSearch onSearch={handleSearch} />
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {showImage && (
//         <img
//           className="gif"
//           src="https://ugokawaii.com/wp-content/uploads/2023/04/plane.gif"
//           alt="Plane GIF"
//         />
//       )}
//       {flightNumber && healthData && (
//         <FlightData
//           flightNumber={flightNumber}
//           healthData={healthData}
//           nearByAssistance={nearByAssistance}
//         />
//       )}
//       {flightNumber && !healthData && (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             minHeight: "50vh",
//             fontSize: "24px",
//           }}
//         >
//           Flight data not found.
//         </div>
//       )}
//     </div>
//   );
// };

// export default HealthDashboard;

import React, { useEffect, useState, useContext } from "react";
import FlightSearch from "../components/FlightSearch";
import FlightData from "../components/FlightData";
import { FlightContext } from "../FlightContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HealthDashboard = () => {
  const [flightNumber, setFlightNumber] = useState("");
  const [showImage, setShowImage] = useState(true);
  const [error, setError] = useState("");
  const { flightNumberModel } = useContext(FlightContext);
  const [healthData, sethealthData] = useState("");
  const [nearByAssistance, setNearByAssistance] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const handleSearch = async (number) => {
    if (number.trim() === "") {
      setError("Please enter a flight number");
    } else {
      setFlightNumber(number);
      setShowImage(false);
      setError("");
      setLoading(true); // Set loading to true when starting the fetch

      if (flightNumberModel && flightNumberModel[number]) {
        const aircraftModel = flightNumberModel[number].model;

        try {
          const response = await axios.post("http://65.2.161.206:8000/aircraft", {
            flight_number: number,
            aircraft_model: aircraftModel,
          });
          sethealthData(response.data);

          const response_nearByAssistance = await axios.post(
            "http://65.2.161.206:8000/nearest_airport",
            {
              current_pos: [
                flightNumberModel[number].latitude,
                flightNumberModel[number].longitude,
              ],
            }
          );
          setNearByAssistance(response_nearByAssistance.data.name);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("Error fetching data. Please try again.");
        } finally {
          setLoading(false); // Set loading to false when fetch completes
        }
      } else {
        console.log("Flight data not found for flight number:", number);
        // sethealthData(null); 
      }
    }
  };

  useEffect(() => {
    console.log("healthData", healthData);
    const wasReloaded = localStorage.getItem("wasReloaded");

    if (wasReloaded) {
      navigate("/");
    } else {
      localStorage.setItem("wasReloaded", "true");
    }

    // Cleanup function to prevent memory leaks
    return () => {
      localStorage.removeItem("wasReloaded");
    };
  }, [healthData, navigate]);

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
      {/* Display loading message while loading */}
      {loading && <p
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
        fontSize: "24px",
      }}
      >Loading...</p>}
      {/* Render FlightData component when data is fetched */}
      {flightNumber && healthData && !loading && (
        <FlightData
          flightNumber={flightNumber}
          healthData={healthData}
          nearByAssistance={nearByAssistance}
        />
      )}
      {/* Display error message if fetch fails */}
      {flightNumber && !healthData && !loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
            fontSize: "24px",
          }}
        >
          Flight data not found.
        </div>
      )}
    </div>
  );
};

export default HealthDashboard;
