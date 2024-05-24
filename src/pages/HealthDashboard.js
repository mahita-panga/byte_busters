
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
//   const [loading, setLoading] = useState(false); // New loading state
//   const navigate = useNavigate();

//   // const handleSearch = async (number) => {
//   //   if (number.trim() === "") {
//   //     setError("Please enter a flight number");
//   //   } else {
//   //     setFlightNumber(number);
//   //     setShowImage(false);
//   //     setError("");
//   //     setLoading(true); // Set loading to true when starting the fetch

//   //     if (flightNumberModel && flightNumberModel[number]) {
//   //       const aircraftModel = flightNumberModel[number].model;

//   //       try {
//   //         const response = await axios.post("http://65.2.161.206:8000/aircraft", {
//   //           flight_number: number,
//   //           aircraft_model: aircraftModel,
//   //         });
//   //         sethealthData(response.data);

//   //       const response_nearByAssistance = await axios.post(
//   //         "http://65.2.161.206:8000/nearest_airport",
//   //         {
//   //           current_pos: [
//   //             flightNumberModel[number].latitude,
//   //             flightNumberModel[number].longitude,
//   //           ],
//   //         }
//   //       );
//   //       setNearByAssistance(response_nearByAssistance.data.name);
//   //     } else {
//   //       console.log("Flight data not found for flight number:", number);
//   //       // sethealthData(null); 
//   //     }
//   //   }
//   // };

//   const handleSearch = async (number) => {
//     if (number.trim() === "") {
//       setError("Please enter a flight number");
//     } else {
//       setFlightNumber(number);
//       setShowImage(false);
//       setError("");
//       setLoading(true);

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
//         setNearByAssistance(response_nearByAssistance.data);
//       } else {
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
//       {/* Display loading message while loading */}
//       {loading && <p
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         minHeight: "50vh",
//         fontSize: "24px",
//       }}
//       >Loading...</p>}
//       {/* Render FlightData component when data is fetched */}
//       {flightNumber && healthData && !loading && (
//         <FlightData
//           flightNumber={flightNumber}
//           healthData={healthData}
//           nearByAssistance={nearByAssistance}
//         />
//       )}
//       {/* Display error message if fetch fails */}
//       {flightNumber && !healthData && !loading && (
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
  const [healthData, setHealthData] = useState(null);
  const [nearByAssistance, setNearByAssistance] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (number) => {
    if (number.trim() === "") {
      setError("Please enter a flight number");
      return;
    }

    setFlightNumber(number);
    setShowImage(false);
    setError("");
    setLoading(true);

    if (flightNumberModel && flightNumberModel[number]) {
      const aircraftModel = flightNumberModel[number].model;

      try {
        const response = await axios.post("http://65.2.161.206:8000/aircraft", {
          flight_number: number,
          aircraft_model: aircraftModel,
        });
        setHealthData(response.data);

        const response_nearByAssistance = await axios.post(
          "http://65.2.161.206:8000/nearest_airport",
          {
            current_pos: [
              flightNumberModel[number].latitude,
              flightNumberModel[number].longitude,
            ],
          }
        );
        setNearByAssistance(response_nearByAssistance.data);
      } catch (error) {
        console.log("Error fetching data:", error);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Flight data not found for flight number:", number);
      setError("Flight data not found.");
      setLoading(false);
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
      {loading && (
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            fontSize: "24px",
          }}
        >
          Loading...
        </p>
      )}
      {flightNumber && healthData && !loading && (
        <FlightData
          flightNumber={flightNumber}
          healthData={healthData}
          nearByAssistance={nearByAssistance}
        />
      )}
      {flightNumber && !healthData && !loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
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
