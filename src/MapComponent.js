
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline,Tooltip  } from 'react-leaflet';
//import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from "leaflet";
import axios from "axios";
const airportsData = require('./AirportsData.json');
// Fix default icon issues with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});



const searchedFlightIcon = new L.Icon({
  iconUrl: 'https://cdn.icon-icons.com/icons2/2444/PNG/512/location_map_pin_mark_icon_148684.png',

  iconSize: [44, 44], // Size of the icon
  iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
});


const domesticIcon = new L.Icon({
   iconUrl: 'https://www.freeiconspng.com/uploads/-------------9.png',

 iconSize: [24, 24], // Size of the icon
  iconAnchor: [12, 12], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -12] // Point from which the popup should open relative to the iconAnchor
});

const internationalIcon = new L.Icon({
  iconUrl: 'https://www.freeiconspng.com/uploads/transport-airplane-takeoff-icon--android-iconset--icons8-2.png',
 iconSize: [24, 24], // Size of the icon
  iconAnchor: [12, 12], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -12] // Point from which the popup should open relative to the iconAnchor
});

// Utility function to calculate bearing
// const calculateBearing = (lat1, lng1, lat2, lng2) => {
//   const toRadians = (degrees) => degrees * (Math.PI / 180);
//   const toDegrees = (radians) => radians * (180 / Math.PI);

//   const φ1 = toRadians(lat1);
//   const φ2 = toRadians(lat2);
//   const Δλ = toRadians(lng2 - lng1);

//   const y = Math.sin(Δλ) * Math.cos(φ2);
//   const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

//   const θ = Math.atan2(y, x);

//   return (toDegrees(θ) + 360) % 360; // in degrees
// };


// const getAirportCoordinates = async (airportCode) => {
//   const response = await fetch(`https://api.searoutes.com/geocoding/v2/airport?iataCode=${airportCode}`, {
//     headers: {
//       'x-api-key': 'XutjE1XdwR9AgsMG0ZSz11lN4ltGUIM42LNdel8J'
//     }
//   });
//   const data = await response.json();
//   if (data && data.features && data.features.length > 0) {
//     const { coordinates } = data.features[0].geometry;
//     return { latitude: coordinates[1], longitude: coordinates[0] };
//   }
//   console.log(data);
//   return null;
// };

const formatCoordinates = (coordinates) => {
  let formattedCoordinates = '';
  for (let i = 0; i < coordinates.length; i++) {
    formattedCoordinates += `[${coordinates[i][0].toFixed(4)}, ${coordinates[i][1].toFixed(4)}]`;
    if (i !== coordinates.length - 1) {
      formattedCoordinates += ', ';
    }
    // Insert line break after every 3-4 coordinates
    if ((i + 1) % 3 === 0 && i !== coordinates.length - 1) {
      formattedCoordinates += '<br />';
    }
  }
  return formattedCoordinates;
};

// const handleButtonClick = async(flight)=> {
//   // Print message to console
//   console.log(`Hi! You clicked on the plane button for flight ID: ${flight.id}`);
//   console.log("source", flight.lat, flight.lng);
//   console.log("dest", flight.arrival);

//   // Find the airport with matching IATA code
//   const airport = airportsData.airports.find(airport => airport.iata_code === flight.arrival);
  
//   const sourceCoords = [Number(flight.lat), Number(flight.lng)];
//   const destCoords = [Number(airport.latitude_deg), Number(airport.longitude_deg)];

//   const response = await axios.post('http://127.0.0.1:8000/get_paths', {
//     "src": sourceCoords,
//     "des": destCoords,
//     "on_air": true
//   });
//     console.log(response.data.fly_status);
//     var flyStatus = response.data.fly_status.toLowerCase().replace(/\s/g, "");
// var targetStatus = "cannotfly";

// // Compare the modified strings
// if (flyStatus === targetStatus) {
//     alert("Cannot Fly in this region");
//     return;
// }
//     if (response.data.paths.length > 10) {
//       // Slice the response to keep only the first 5 paths
//       response.data.paths = response.data.paths.slice(0, 10);
//   }
  

// console.log("udti flight ka path",response.data.paths)

// };


const MapComponent = ({ route1, route2, flights ,highlightedFlight ,domesticFlights, internationalFlights, searchedFlightCoordinates,paths, domesticAirports}) => {

  // Default center position
  //let centerPosition = [28.6139, 77.2090]; // Default to New Delhi coordinates


   let centerPosition = [21.0, 78.0]; // Geographic center of India
  // const zoomLevel = 5; // Adjust zoom level to fit the whole country
  const [additionalPaths, setAdditionalPaths] = useState([]);
  const displayPaths = additionalPaths.length > 0 ? additionalPaths : paths;
  useEffect(() => {
    // Clear additionalPaths when paths change
    setAdditionalPaths([]);
  }, [paths]);
//useEffect(()=>{console.log("map se aaye",paths)},[paths])
  // useEffect(() => {
  //   const fetchCoordinates = async () => {
  //     const uniqueAirports = [...new Set(flights.map(flight => flight.arrival))];
  //     const coords = {};
  //     for (const airportCode of uniqueAirports) {
  //       const result = await getAirportCoordinates(airportCode);
  //       if (result) {
  //         coords[airportCode] = result;
  //       }
  //     }
  //     setAirportCoords(coords);
  //   };
  //   fetchCoordinates();
  // }, [flights]);

  const handleButtonClick = async (flight) => {
    // Your existing logic to fetch paths from the server
    const airport = airportsData.airports.find(airport => airport.iata_code === flight.arrival);
  
  const sourceCoords = [Number(flight.lat), Number(flight.lng)];
  const destCoords = [Number(airport.latitude_deg), Number(airport.longitude_deg)];

  const response = await axios.post('http://65.2.161.206:8000/get_paths', {
    "src": sourceCoords,
    "des": destCoords,
    "on_air": true
  });
    // Check fly_status and handle accordingly
    // if (response.data.fly_status.toLowerCase().replace(/\s/g, "") === "cannotfly") {
    //   alert("Cannot Fly in this region");
    //   return;
    // }
    if (response.data.paths === null) {
      alert( `${response.data.fly_status}`);
      return;
    }
    setAdditionalPaths(response.data.paths.length > 10 ? response.data.paths.slice(0, 10) : response.data.paths);
    // Update additional paths state
    if (response.data.paths.length > 10) {
      // Slice the response to keep only the first 10 paths
      setAdditionalPaths(response.data.paths.slice(0, 10));
   
    } else {
      setAdditionalPaths(response.data.paths);
    }
  };

  
  return (
    <MapContainer center={centerPosition} zoom={4.5} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
     
   {/* {paths[0] && paths[0].length> 0 && (
    <>
      <Marker position={[paths[0][0][0], paths[0][0][1]]}>
        <Popup>Start</Popup>
      </Marker>
      <Marker position={[paths[0][paths[0].length - 1][0], paths[0][paths[0].length - 1][1]]}>
        <Popup>End</Popup>
      </Marker>
    </>
  )}

{paths && paths[0] && paths[0].length > 0 && (
        <>
          <Marker position={[paths[0][0][0], paths[0][0][1]]}>
            <Popup>Start</Popup>
          </Marker>
          <Marker position={[paths[0][paths[0].length - 1][0], paths[0][paths[0].length - 1][1]]}>
            <Popup>End</Popup>
          </Marker>
        </>
      )}

    
      {paths && paths.slice(1).map((coordinates, index) => (
        <Polyline
          key={index + 1}
          positions={coordinates}
          color="grey"
        />
      ))}

      {paths && paths[0] && (
        <Polyline
          positions={paths[0]}
          color="blue"
          weight={5}
        >
          <Tooltip direction="center" offset={[0, -20]} opacity={1} className="custom-tooltip">
            <div style={{ textAlign: 'center' }}>
              <strong style={{ color: "blue" }}>Coordinates for optimal path:</strong><br />
              <div dangerouslySetInnerHTML={{ __html: formatCoordinates(paths[0]) }} />
            </div>
          </Tooltip>
        </Polyline>
      )}

     

{(additionalPaths && additionalPaths.length > 0 ? additionalPaths : paths)[0] && (
  <>
    <Marker position={[(additionalPaths.length > 0 ? additionalPaths : paths)[0][0][0], (additionalPaths.length > 0 ? additionalPaths : paths)[0][0][1]]}>
      <Popup>Start</Popup>
    </Marker>
    <Marker position={[(additionalPaths.length > 0 ? additionalPaths : paths)[0][(additionalPaths.length > 0 ? additionalPaths : paths)[0].length - 1][0], (additionalPaths.length > 0 ? additionalPaths : paths)[0][(additionalPaths.length > 0 ? additionalPaths : paths)[0].length - 1][1]]}>
      <Popup>End</Popup>
    </Marker>
  </>
)}

{(additionalPaths && additionalPaths.length > 0 ? additionalPaths : paths).slice(1).map((coordinates, index) => (
  <Polyline
    key={index + 1}
    positions={coordinates}
    color="grey"
  />
))}

{(additionalPaths && additionalPaths.length > 0 ? additionalPaths : paths)[0] && (
  <Polyline
    positions={(additionalPaths.length > 0 ? additionalPaths : paths)[0]}
    color="blue"
    weight={5}
  >
    <Tooltip direction="center" offset={[0, -20]} opacity={1} className="custom-tooltip">
      <div style={{ textAlign: 'center' }}>
        <strong style={{ color: "blue" }}>Coordinates for optimal path:</strong><br />
        <div dangerouslySetInnerHTML={{ __html: formatCoordinates((additionalPaths.length > 0 ? additionalPaths : paths)[0]) }} />
      </div>
    </Tooltip>
  </Polyline>
)}
 */}


{displayPaths[0] && (
        <>
          <Marker position={[displayPaths[0][0][0], displayPaths[0][0][1]]}>
            <Popup>Source</Popup>
          </Marker>
          <Marker position={[displayPaths[0][displayPaths[0].length - 1][0], displayPaths[0][displayPaths[0].length - 1][1]]}>
            <Popup>Destination</Popup>
          </Marker>
        </>
      )}

      {/* Display grey Polylines */}
      {displayPaths.slice(1).map((coordinates, index) => (
        <Polyline
          key={index + 1}
          positions={coordinates}
          color="grey"
          z-index="-1"
        />
      ))}

      {displayPaths[0] && (
        <Polyline
          positions={displayPaths[0]}
          color="blue"
          weight={5}
          opacity={1}
         
        >
          <Tooltip direction="center" offset={[0, -20]} opacity={1} className="custom-tooltip">
            <div style={{ textAlign: 'center' }}>
              <strong style={{ color: "blue" }}>Coordinates for optimal path:</strong><br />
              <div dangerouslySetInnerHTML={{ __html: formatCoordinates(displayPaths[0]) }} />
            </div>
          </Tooltip>
        </Polyline>
      )}








{domesticFlights.map(flight => (
        <Marker
          key={flight.id}
          position={[flight.lat, flight.lng]}
          icon={domesticIcon}
        >
          <Popup>
            <strong>Flight Details:</strong><br />
            Flight ID: {flight.id} <br />
            Flight Number: {flight.number}<br/>
            Altitude: {flight.altitude} <br />
            Velocity: {flight.velocity}<br/>
            Aircraft Model: {flight.model}<br/>
            Departure Airport: {flight.departure}<br/>
            Arrival Airport: {flight.arrival}<br/>
            <button onClick={() => handleButtonClick(flight)}>Find Optimal Path</button>
          </Popup>
        </Marker>
      ))}
      {internationalFlights.map(flight => (
        <Marker
          key={flight.id}
          position={[flight.lat, flight.lng]}
          icon={internationalIcon}
        >
          <Popup>
            <strong>Flight Details:</strong><br />
            Flight ID: {flight.id} <br />
            Flight Number: {flight.number}<br/>
            Altitude: {flight.altitude} <br />
            Velocity: {flight.velocity}<br/>
            Aircraft Model: {flight.model}<br/>
            Departure Airport: {flight.departure}<br/>
            Arrival Airport: {flight.arrival}<br/>
          </Popup>
        </Marker>
      ))}

{searchedFlightCoordinates && (
        <Marker position={searchedFlightCoordinates} icon={searchedFlightIcon}>
        
            <Popup>
           <strong> Searched Flight Details:</strong><br />
            Flight ID: {searchedFlightCoordinates.id} <br />
            Flight Number: {searchedFlightCoordinates.number}<br/>
            Altitude: {searchedFlightCoordinates.altitude} <br />
            Velocity: {searchedFlightCoordinates.velocity}<br/>
            Aircraft Model: {searchedFlightCoordinates.model}<br/>
            Departure Airport: {searchedFlightCoordinates.departure}<br/>
            Arrival Airport: {searchedFlightCoordinates.arrival}<br/>
            {domesticAirports.has(searchedFlightCoordinates.arrival) && (
        <button onClick={() => handleButtonClick(searchedFlightCoordinates)}>Find Optimal Path</button>
      )}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapComponent;


