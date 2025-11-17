import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import PaymentModal from '../components/PaymentModal';

const DriverFinder = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [revealedContacts, setRevealedContacts] = useState(new Set());
  const [filter, setFilter] = useState('all');

  // Fetch drivers from backend
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/drivers');
        // Normalize MongoDB _id to id for frontend compatibility
        const normalizedDrivers = response.data.map(driver => ({
          ...driver,
          id: driver._id || driver.id,
        }));
        setDrivers(normalizedDrivers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching drivers:', error);
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const handleViewContact = (driver) => {
    const driverId = driver._id || driver.id;
    if (revealedContacts.has(driverId)) {
      // Already paid, show contact
      return;
    }
    setSelectedDriver(driver);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (driverId) => {
    setRevealedContacts(new Set([...revealedContacts, driverId]));
    setShowPayment(false);
    setSelectedDriver(null);
  };

  const filteredDrivers = drivers.filter((driver) => {
    if (filter === 'all') return true;
    return driver.availability === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🚗</div>
          <p className="text-xl font-semibold text-gray-600">Loading drivers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Find Your Driver 🚗
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Connect with trusted local drivers for your transport needs.
            Small tip den you go fit see their number! 😄
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {['all', 'available', 'busy', 'offline'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  filter === status
                    ? 'bg-ashesi-primary text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Drivers Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredDrivers.map((driver, index) => {
            const isRevealed = revealedContacts.has(driver.id);

            return (
              <motion.div
                key={driver.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="card relative overflow-hidden"
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      driver.availability === 'available'
                        ? 'bg-green-100 text-green-800'
                        : driver.availability === 'busy'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {driver.availability.toUpperCase()}
                  </span>
                </div>

                {/* Driver Photo */}
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-ghana-red via-ghana-yellow to-ghana-green p-1">
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-4xl">
                    {driver.photo || '👨‍✈️'}
                  </div>
                </div>

                {/* Driver Info */}
                <h3 className="font-display text-xl font-bold text-center mb-2">
                  {driver.name}
                </h3>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-600 text-center">
                    <span className="font-semibold">Car:</span> {driver.carType}
                  </p>
                  <p className="text-gray-600 text-center">
                    <span className="font-semibold">Location:</span> {driver.location}
                  </p>
                  {driver.rating && (
                    <p className="text-center text-yellow-500 font-semibold">
                      ⭐ {driver.rating}/5.0
                    </p>
                  )}
                </div>

                {/* Contact Button */}
                {isRevealed ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-green-50 border-2 border-green-500 rounded-lg p-4 text-center"
                  >
                    <p className="text-green-800 font-semibold mb-2">Contact Info:</p>
                    <a
                      href={`tel:${driver.contact}`}
                      className="text-lg font-bold text-green-600 hover:text-green-700"
                    >
                      📞 {driver.contact}
                    </a>
                    {driver.whatsapp && (
                      <a
                        href={`https://wa.me/${driver.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-2 text-green-600 hover:text-green-700 font-semibold"
                      >
                        💬 WhatsApp
                      </a>
                    )}
                  </motion.div>
                ) : (
                  <button
                    onClick={() => handleViewContact(driver)}
                    className="w-full btn-primary relative group"
                    disabled={driver.availability === 'offline'}
                  >
                    <span>View Contact</span>
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                      Small tip den you go fit see number! 💰
                    </div>
                  </button>
                )}

                {/* Quick Info */}
                {driver.note && (
                  <p className="mt-3 text-sm text-gray-500 italic text-center">
                    "{driver.note}"
                  </p>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* No Results */}
        {filteredDrivers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No drivers found
            </h3>
            <p className="text-gray-600">
              Try changing your filter or check back later!
            </p>
          </motion.div>
        )}
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && selectedDriver && (
          <PaymentModal
            driver={selectedDriver}
            onClose={() => {
              setShowPayment(false);
              setSelectedDriver(null);
            }}
            onSuccess={() => handlePaymentSuccess(selectedDriver.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DriverFinder;
