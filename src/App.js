import React, {useState} from 'react';
import './App.css';
import HealthDashboard from './pages/HealthDashboard';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashBoardmap from './pages/DashBoardMap copy';
import Footer from './components/Footer';

function App() {
  const [flightNumberModel, setFlightNumberModel] = useState([]);

  return (
    <>
    <Router>
      <Navbar />
      <div className="app-content" style={{paddingBottom: "0px "}}>
        <Routes>
          <Route path="/dashboard" element={ <HealthDashboard />} />
          <Route path="/" element={<DashBoardmap flightNumberModel={flightNumberModel} setFlightNumberModel={setFlightNumberModel} />} />

        </Routes>
      </div>
      <Footer  />
    </Router>
    </>
  );
}

export default App;

