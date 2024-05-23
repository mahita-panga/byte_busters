
import React, { useState } from 'react';
import FlightSearch from '../components/FlightSearch';
import FlightData from '../components/FlightData';

const HealthDashboard = () => {
    const [flightNumber, setFlightNumber] = useState('');
    const [showImage, setShowImage] = useState(true);
    const [error, setError] = useState('');

    const handleSearch = (number) => {
        if (number.trim() === '') {
            setError('Please enter a flight number');
        } else {
            setFlightNumber(number);
            setShowImage(false); 
            setError(''); 
        }
    }

    return (
        <div className="App">
            <h1>Flight Health Dashboard</h1>
            <FlightSearch onSearch={handleSearch} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {showImage && (
                <img className='gif' src='https://ugokawaii.com/wp-content/uploads/2023/04/plane.gif' alt="Plane GIF" />
            )}
            {flightNumber && <FlightData flightNumber={flightNumber} />}
        </div>
    );
}

export default HealthDashboard;


// import React, { useState, useContext } from 'react';
// import FlightSearch from '../components/FlightSearch';
// import FlightData from '../components/FlightData';
// import { FlightContext } from '../FlightContext';

// const HealthDashboard = () => {
//     const [flightNumber, setFlightNumber] = useState('');
//     const [showImage, setShowImage] = useState(true);
//     const [error, setError] = useState('');
//     const { flightNumberModel } = useContext(FlightContext);

//     const handleSearch = (number) => {
//         if (number.trim() === '') {
//             setError('Please enter a flight number');
//         } else {
//             setFlightNumber(number);
//             setShowImage(false); 
//             setError('');

//             // Search for flight number in flightNumberModel and print its aircraft model
//             const aircraftModel = flightNumberModel[number];
//             if (aircraftModel) {
//                 console.log('Flight Number:', number);
//                 console.log('Aircraft Model:', aircraftModel);
//             } else {
//                 console.log('Flight data not found.');
//             }
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

