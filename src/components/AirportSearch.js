
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./AirportSearch.css";
const AirportSearch = ({ onSelect }) => {
  const [airports, setAirports] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [placeholder, setPlaceholder] = useState('Enter airport name');

  useEffect(() => {
    if (query.length > 2) {
      const fetchAirports = async () => {
        try {
          const response = await axios.get(`https://autocomplete.travelpayouts.com/places2?locale=en&types[]=airport&types[]=city&term=${query}`);
          setAirports(response.data);
        } catch (error) {
          console.error('Error fetching airports:', error);
        }
      };

      fetchAirports();
    } else {
      setAirports([]);
    }
  }, [query]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    setSelectedAirport(null);
  };

  const handleSelect = (airport) => {
    onSelect(airport);
    setSelectedAirport(airport);
    setQuery('');
    setAirports([]);
  };

  return (
    <div className="airport-search-container">
      <input type="text" value={selectedAirport ? `${selectedAirport.name}${selectedAirport.city_name ? ` (${selectedAirport.city_name})` : ''}${selectedAirport.main_airport_name ? ` (${selectedAirport.main_airport_name})` : ''}` : query} onChange={handleChange} placeholder={placeholder} />
      {query && airports.length > 0 && (
        <ul className="airport-list">
          {airports.map((airport) => (
            <li key={airport.id} onClick={() => handleSelect(airport)}>
              {`${airport.name}${airport.city_name ? ` (${airport.city_name})` : ''}${airport.main_airport_name ? ` (${airport.main_airport_name})` : ''}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AirportSearch;
