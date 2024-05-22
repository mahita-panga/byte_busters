
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
//import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from "leaflet";
// Fix default icon issues with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});



const searchedFlightIcon = new L.Icon({
  iconUrl: 'https://cdn.icon-icons.com/icons2/1918/PNG/512/iconfinder-documents07-1622836_121949.png',

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




const MapComponent = ({ route1, route2, flights ,highlightedFlight ,domesticFlights, internationalFlights, searchedFlightCoordinates}) => {

  // Default center position
  let centerPosition = [28.6139, 77.2090]; // Default to New Delhi coordinates


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


  // Check if route1 array is not empty
  if (route1.length > 0) {
    centerPosition = [route1[0].lat, route1[0].lng];
  } else if (route2.length > 0) {
    centerPosition = [route2[0].lat, route2[0].lng];
  }

  // Extract lat and lng coordinates for the polylines
  const polylinePositions1 = route1.map((marker) => [marker.lat, marker.lng]);
  const polylinePositions2 = route2.map((marker) => [marker.lat, marker.lng]);

  return (
    <MapContainer center={centerPosition} zoom={5} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    
<Marker position={[route1[0].lat, route1[0].lng]}>
        <Popup>
          {route1[0].name} <br /> [{route1[0].lat}, {route1[0].lng}]
        </Popup>
      </Marker>
      <Marker position={[route1[route1.length - 1].lat, route1[route1.length - 1].lng]}>
        <Popup>
          {route1[route1.length - 1].name} <br /> [{route1[route1.length - 1].lat}, {route1[route1.length - 1].lng}]
        </Popup>
      </Marker>

      {/* Display markers for start and end of route 2 */}
      <Marker position={[route2[0].lat, route2[0].lng]}>
        <Popup>
          {route2[0].name} <br /> [{route2[0].lat}, {route2[0].lng}]
        </Popup>
      </Marker>
      <Marker position={[route2[route2.length - 1].lat, route2[route2.length - 1].lng]}>
        <Popup>
          {route2[route2.length - 1].name} <br /> [{route2[route2.length - 1].lat}, {route2[route2.length - 1].lng}]
        </Popup>
      </Marker>

      <Polyline positions={polylinePositions1} color="blue" />
      <Polyline positions={polylinePositions2} color="red" />
     
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
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapComponent;


