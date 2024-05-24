import React, { useState, useEffect, useContext } from "react";
import MapComponent from "../MapComponent";
import AirportSearch from "../components/AirportSearch";
import axios from "axios";
import "./DashboardMap.css";
import { FiInfo } from "react-icons/fi";
import { IN } from 'country-flag-icons/react/3x2'
import { FlightContext } from '../FlightContext';

const domesticAirports = new Set([
  "IXA",
  "AGX",
  "AGR",
  "AMD",
  "AJL",
  "ATQ",
  "IXU",
  "IXB",
  "BLR",
  "BHO",
  "BBI",
  "BHJ",
  "BHU",
  "BUP",
  "IXC",
  "MAA",
  "COK",
  "CCJ",
  "DED",
  "DEL",
  "DIB",
  "DMU",
  "DIU",
  "GAY",
  "GOI",
  "GOP",
  "GWL",
  "GAU",
  "HJR",
  "HBX",
  "HYD",
  "IMF",
  "IDR",
  "JLR",
  "JAI",
  "IXJ",
  "JGA",
  "JDH",
  "JRH",
  "IXW",
  "KTU",
  "CNN",
  "CJB",
  "CCU",
  "CCU",
  "BOM",
  "NAG",
  "ISK",
  "PNQ",
  "PAT",
  "RPR",
  "RJA",
  "RJI",
  "VGA",
  "VTZ",
  "MAA",
  "IXM",
  "TRZ",
  "TRV",
  "RAJ",
  "IXA",
  "IXS",
  "IXV",
  "LKO",
  "IXL",
  "IXM",
  "IXE",
  "MYQ",
  "LKO",
  "IXA",
  "LKO",
  "IXI",
  "PBD",
  "IXZ",
  "PUT",
  "RPR",
  "VTZ",
  "STV",
  "TIR",
  "TRV",
  "TRZ",
  "UDR",
  "VGA",
  "VNS",
  "VTZ",
  "DED",
  "GAU",
  "GOP",
  "GWL",
  "HJR",
  "HBX",
  "IXL",
  "IMF",
  "IDR",
  "JLR",
  "JDH",
  "IXJ",
  "IXW",
  "KUU",
  "IXL",
  "ISK",
  "IXM",
  "IXE",
  "MYQ",
  "LKO",
  "IXA",
  "IXI",
  "PBD",
  "IXZ",
  "RPR",
  "SXR",
  "IXC",
  "TEZ",
  "TIR",
  "UDR",
  "VGA",
  "VNS",
  "VTZ",
  "IXU",
  "BEP",
  "BHJ",
  "BHU",
  "IXD",
  "HSS",
  "HYD",
  "IMF",
  "JLR",
  "IXL",
  "IXJ",
  "KTU",
  "CNN",
  "CCJ",
  "IXM",
  "TRV",
  "TRZ",
  "IXR",
]);

const allowedModels = new Set([
  "A19N",
  "A20N",
  "A21N",
  "A319",
  "A320",
  "A321",
  "A332",
  "A333",
  "A343",
  "A359",
  "A388",
  "B37M",
  "B38M",
  "B39M",
  "B3XM",
  "B734",
  "B737",
  "B738",
  "B739",
  "B744",
  "B748",
  "B752",
  "B763",
  "B772",
  "B773",
  "B77W",
  "B788",
  "B789",
  "C550",
  "E145",
  "E170",
  "E190",
  "E195",
  "E75L",
  "GLF6",
]);




const DashBoardmap = () => {
  const route1 = [
    { lat: 28.6139, lng: 77.209, name: "New Delhi" },
    { lat: 22.7196, lng: 75.8577, name: "Indore" },
    { lat: 19.076, lng: 72.8777, name: "Mumbai" },
  ];

  const route2 = [
    { lat: 28.6139, lng: 77.209, name: "New Delhi" },
    { lat: 26.9124, lng: 75.7873, name: "Jaipur" },
    { lat: 19.076, lng: 72.8777, name: "Mumbai" },
  ];

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [flights, setFlights] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [highlightedFlight, setHighlightedFlight] = useState(null);
  const [searchedFlightCoordinates, setSearchedFlightCoordinates] =
    useState(null);
  const [flightNumbers, setFlightNumbers] = useState([]);
  const[paths,setPaths]=useState([]);
  const[fly,setFly]=useState("");
  const { flightNumberModel, setFlightNumberModel } = useContext(FlightContext);

//   const flightContext = useContext(FlightContext);
// const flightNumbers = flightContext.flightNumbers;
// const setFlightNumbers = flightContext.setFlightNumbers;

  const [domesticFlights, setDomesticFlights] = useState([]);
  const [internationalFlights, setInternationalFlights] = useState([]);
  const [selectedFlightNumber, setSelectedFlightNumber] = useState("");

  const handleSourceSelect = (airport) => {
    if (airport && airport.coordinates) {
      setSource({ lat: airport.coordinates.lat, lng: airport.coordinates.lon });
    }
  };

  const handleDestinationSelect = (airport) => {
    if (airport && airport.coordinates) {
      setDestination({
        lat: airport.coordinates.lat,
        lng: airport.coordinates.lon,
      });
    }
  };
  const handleSearchChange = (e) => {
    // const inputValue = e.target.value;
    // if (flightNumbers.includes(inputValue)) {
    //   // If it exists, update the searchInput state
    //   setSearchInput(inputValue);
    // }
    setSearchInput(e.target.value);
  };

  const handleFlightSelect = (e) => {
    const selectedFlight = e.target.value;
    setSelectedFlightNumber(selectedFlight); // Update the selected flight number
    setSearchInput(selectedFlight); // Update the searchInput with the selected flight number
  };

  const handleSearch = () => {
    const flight = flights.find((flight) => flight.number === searchInput);

    if (flight) {
      setHighlightedFlight(flight.number);
      setSearchedFlightCoordinates({
        number: flight.number,
        model: flight.model,
        id: flight.id,
        altitude: flight.altitude,
        lat: flight.lat,
        lng: flight.lng,
        velocity: flight.velocity,
        arrival: flight.arrival,
        departure: flight.departure,
      });
    } else {
      alert("Flight not found");
    }
  };
  const printCoordinates =  async()=> {
    console.log(source, destination);
    if (!source || !destination) {
      alert("Please select source and destination airports");
      return;
    }
    console.log("typeeeeee",typeof(source.lat));
    const response = await axios.post('http://127.0.0.1:8000/get_paths', {
      
        "src": [
          source.lat,source.lng
        ],
        "des": [
          destination.lat,destination.lng
        ],
        "on_air": false
    
    });
    console.log(response.data.fly_status);
    if (response.data.paths === null) {
      alert( `${response.data.fly_status}`);
      return;
    }
    if (response.data.paths.length > 10) {
      // Slice the response to keep only the first 5 paths
      response.data.paths = response.data.paths.slice(0, 10);
  }
  

  

   setPaths( response.data.paths);
    console.log("Source Coordinates:", source);
    console.log("Destination Coordinates:", destination);
    console.log("response for paths", paths);
    // setSource("");
    // setDestination("");
  };

  // const fetchLiveFlights = async () => {
  //   try {
  //     // const response = await axios.get('https://opensky-network.org/api/states/all?lamin=6.7470&lomin=68.1624&lamax=35.6745&lomax=97.3956');
  //     // const allFlights = response.data.states;

  //     var response;

  //     const options = {
  //       method: "GET",
  //       url: "https://flight-radar1.p.rapidapi.com/flights/list-in-boundary",
  //       params: {
  //         bl_lat: "8.066666",
  //         bl_lng: "68.116667",
  //         tr_lat: "37.1",
  //         tr_lng: "97.416667",
  //         limit: "100",
  //       },
  //       headers: {
  //         "X-RapidAPI-Key":
  //           "087b9b7a95msh14b5ae323b36ff7p15b72bjsncad07b6ba875",
  //         "X-RapidAPI-Host": "flight-radar1.p.rapidapi.com",
  //       },
  //     };

  //     try {
  //       response = await axios.request(options);
  //     } catch (error) {
  //       console.error(error);
  //     }

  //     const allFlights = response.data.aircraft;

  //     // Map flight data to required format

  //     const domestic = [];
  //     const international = [];
  //     const flightData = allFlights.map((flight) => ({
  //       id: flight[0],
  //       lat: flight[2],
  //       lng: flight[3],
  //       altitude: flight[4],
  //       velocity: flight[6],
  //       model: flight[9],
  //       arrival: flight[13],
  //       departure: flight[12],
  //       number: flight[14],
  //     }
  //   ));

  //     //console.log("fff",flightData);
  //     setFlights(flightData);
  //     const flightNumbers = flightData.map((flight) => flight.number);
  //     setFlightNumbers(flightNumbers);
  //     console.log("flight numbers list",flightNumbers);
  //   } catch (error) {
  //     console.error("Error fetching live flights:", error);
  //   }
  // };

  const fetchLiveFlights = async () => {
    try {
      const options = {
        method: "GET",
        url: "https://flight-radar1.p.rapidapi.com/flights/list-in-boundary",
        params: {
          bl_lat: "8.066666",
          bl_lng: "68.116667",
          tr_lat: "37.1",
          tr_lng: "97.416667",
          limit: "100",
        },
        headers: {
          "X-RapidAPI-Key": "ad6e9e6a7amsh71758b54b182fd1p139d1djsn237760b8c83e",
          "X-RapidAPI-Host": "flight-radar1.p.rapidapi.com",
        },
        catch (error) {
          console.error("Error fetching live flights:", error);
        }
      };

      const response = await axios.request(options);
      const allFlights = response.data.aircraft;
      const domestic = [];
      const international = [];
      const combined = [];

      const combinedList = allFlights.forEach((flight) => {
        const model = flight[9];
        if (allowedModels.has(model)) {
          const flightData = {
            id: flight[0],
            lat: flight[2],
            lng: flight[3],
            altitude: flight[4],
            velocity: flight[6],
            model: flight[9],
            arrival: flight[13],
            departure: flight[12],
            number: flight[14],
          };

          if (domesticAirports.has(flight[13])) {
            domestic.push(flightData);
            combined.push(flightData);
          } else {
            international.push(flightData);
            combined.push(flightData);
          }
        }
      });
      setFlights(combined);
      setDomesticFlights(domestic);
      setInternationalFlights(international);
      setFlightNumbers(combined.map((flight) => flight.number));
      // console.log(flightNumbers)
      // setFlightNumbers(combined.forEach(flight => {
      //   flightNumbers[flight.number] = flight.model;
      // }));

      
      const updatedFlightNumbers = {};
      combined.forEach(flight => {
        updatedFlightNumbers[flight.number] = {
          model: flight.model,
          latitude: flight.lat,
          longitude: flight.lng
        };
      });
      setFlightNumberModel(updatedFlightNumbers);
    } catch (error) {
      console.error("Error fetching live flights:", error);
    }
  };
  useEffect(() => {
    fetchLiveFlights();
  }, []);

  return (
    <div className="app-container">
      {/* <h1 className="app-title">ByteBusters</h1> */}
      <div className="input-container">
        <div className="input-search">
          <div className="input-group">
            <label className="input-label">Source:</label>
            <AirportSearch onSelect={handleSourceSelect} />
          </div>
          <div className="input-group">
            <label className="input-label">Destination:</label>
            <AirportSearch onSelect={handleDestinationSelect} />
          </div>
          <button className="print-button" onClick={printCoordinates}>
            Find Routes
          </button>
        </div>
        <div className="legends-container">
          <div className="legend" style={{ marginTop: '4px'}}>
            <img
              src="https://www.freeiconspng.com/uploads/-------------9.png"
              alt="Domestic Flight Icon"
              style={{ height: "20px", width: "20px", marginRight: '5px'}}
            />
            <span>Domestic Flight</span>
          </div>
          <div className="legend" style={{marginBottom: '3px'}}>
            <img
              src="https://www.freeiconspng.com/uploads/transport-airplane-takeoff-icon--android-iconset--icons8-2.png"
              alt="International Flight Icon"
              style={{ height: "20px", width: "20px", marginRight: '5px'}}
            />
            <span>International Flight</span>
          </div>
        </div>
      </div>

      <hr className="white-line" />
      <div className="search-container">
        
       <div className="flight-number">
       <label className="input-label">Flight Number:</label>
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Enter Flight Number"
          className="search-input"
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
       </div>
       
        <div className="dropdown-container">
          <div className="iHover">
            <span className="tooltip-text">
              For Now Only These Flight Numbers are Available in our Data
            </span>
            <FiInfo className="info-icon" />
          </div>

          <label className="input-label-AvaNum">Available Flights:</label>
          <select
            value={selectedFlightNumber}
            // onChange={(e) => setSearchInput(e.target.value)}
            onChange={handleFlightSelect}
            className="flight-dropdown"
          >
            <option value="" disabled>
              Select a flight
            </option>
            {flightNumbers.map((number, index) => (
              <option key={index} value={number}>
                {number}
              </option>
            ))}
          </select>
        </div>
        
      </div>
      <div className="waringss" >
      
      <div className="iHover">
            <span className="tooltip-text">
              Due to data constraints we can get the optimal routes only for flights which are fliying over indian tarretay and landing ain india.
            </span>
            <FiInfo className="info-icon" />
          </div>
    Routes are Available only for domestic flights
    <IN title="India" style={{height: '20px', width:'20px', marginLeft:'5px'}} />
</div>

      <MapComponent
        route1={route1}
        route2={route2}
        paths={paths}
        domesticAirports={domesticAirports} 
        //flights={flights}
        domesticFlights={domesticFlights}
        internationalFlights={internationalFlights}
        highlightedFlight={highlightedFlight}
        searchedFlightCoordinates={searchedFlightCoordinates}
      />
      

    

    </div>
  );
};

export default DashBoardmap;
