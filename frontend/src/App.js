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
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white dark:bg-[#0f172a] transition-colors duration-300">
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
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
