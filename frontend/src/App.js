import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import DriverFinder from './pages/DriverFinder';
import Delivery from './pages/Delivery';
import ServiceHub from './pages/ServiceHub';
import RidePairing from './pages/RidePairing';
import SignIn from './pages/SignIn';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/drivers" element={<DriverFinder />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/services" element={<ServiceHub />} />
            <Route path="/rides" element={<RidePairing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/admin" element={<SignIn />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
