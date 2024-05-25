
# Frontend
This project visualizes flight paths on a map using React and Leaflet. It fetches real-time flight data, displays it on the map, and provides an optimal path for the selected flight. Additionally, it includes a comprehensive Health Dashboard to monitor the status and health of specific flights.

## Features

- **Real-time Flight Data Visualization**: Displays domestic and international flights on a map with distinct icons.
- **Flight Details**: View details such as flight ID, number, altitude, velocity, aircraft model, departure, and arrival airports.
- **Optimal Path Calculation**: Calculate and display the optimal path for a selected flight.
- **Health Dashboard**: A separate dashboard to view the health status of different flights, including maintenance history, emissions data, and nearby assistance information.

## Installation

### Prerequisites

Ensure you have the following installed on your system:
- Node.js (v12 or later)
- npm (v6 or later)

### Steps

1. Clone the repository:

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm start
   ```

This will launch the application and open it in your default browser at `http://localhost:3000`.

## Usage

### Viewing Flights

1. **View Domestic and International Flights**:
   - Domestic flights are marked with a specific icon.
   - International flights have a different icon.
   - Click on any flight marker to see flight details in a popup.

2. **Finding Optimal Path**:
   - In the popup, click the "Find Optimal Path" button.
   - A loading spinner will indicate the processing of the request.
   - Once the optimal path is fetched, it will be displayed on the map.

3. **Searched Flight**:
   - If you search for a specific flight, its details and position will be highlighted on the map.
   - You can also find the optimal path for a searched flight if it's a domestic flight.

### Health Dashboard

1. **Navigate to Health Dashboard**:
   - Go to the Health Dashboard page from the main navigation menu.

2. **Search for Flight Health Information**:
   - Enter a flight number in the search input and press Enter.
   - The dashboard will display the health status and other relevant details of the flight.

3. **Flight Health Information**:
   - The Health Dashboard provides information such as:
     - The dashboard also provides details about the nearest airport to the flight's current position, including the airport's name, latitude, longitude, elevation, GPS code, IATA code, city, and website link.   
     - Detailed emissions data for the flight, including CO2, H2O, SOx, and NOx emissions, is displayed along with corresponding graphs.
     - The maintenance history of the flight is displayed in a table, showing past maintenance events and their details.


### Example Usage of Health Dashboard

- Go to the Health Dashboard page from the main navigation menu.
- Enter a flight number (e.g., "AA123") in the search input and press Enter.
- The dashboard will display the health status and other relevant details of the flight.



## Code Overview

### Main Components

- **MapComponent.jsx**:
  - Handles the rendering of the map using `react-leaflet`.
  - Displays flight markers and paths.
  - Fetches and displays the optimal path for selected flights.

- **HealthDashboard.js**:
  - Manages the state and rendering of the Health Dashboard.
  - Fetches health data for a specific flight and displays it.
  - Displays information such as emissions data, nearby assistance, and maintenance history.

- **App.js**:
  - Main application component that integrates `MapComponent`, `HealthDashboard`, and manages state.


### Example Request for Optimal Path

```json
{
  "src": [latitude, longitude],
  "des": [latitude, longitude],
  "on_air": true
}
```

### Example Response for Optimal Path

```json
{
  "fly_status": "Can Fly",
  "paths": [
    [[lat1, lng1], [lat2, lng2], ...],
    ...
  ]
}
```

## Dependencies

- React
- Leaflet
- Axios
- react-icons

## Understand the UI
https://docs.google.com/document/d/1tK_Lih3fDHWXxiw3JL9phlDDjgW2f2o5RuyHbiVDQQA/edit?usp=sharing
