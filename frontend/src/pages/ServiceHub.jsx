import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import PaymentModal from '../components/PaymentModal';

const ServiceHub = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [revealedContacts, setRevealedContacts] = useState(new Set());

  const categories = [
    { id: 'all', name: 'All Services', icon: '🛍️' },
    { id: 'fruit', name: 'Fruit Vendors', icon: '🍎' },
    { id: 'tailor', name: 'Tailors', icon: '👗' },
    { id: 'barber', name: 'Barbers', icon: '💈' },
    { id: 'food', name: 'Food Vendors', icon: '🍲' },
  ];

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/vendors');
        setVendors(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vendors:', error);
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const handleViewContact = (vendor) => {
    if (revealedContacts.has(vendor.id)) {
      return;
    }
    setSelectedVendor(vendor);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (vendorId) => {
    setRevealedContacts(new Set([...revealedContacts, vendorId]));
    setShowPayment(false);
    setSelectedVendor(null);
  };

  const filteredVendors = vendors.filter((vendor) => {
    if (selectedCategory === 'all') return true;
    return vendor.category === selectedCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🛍️</div>
          <p className="text-xl font-semibold text-gray-600">Loading services...</p>
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
            Local Service Hub 🛍️
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Find the best local service providers around Berekuso.
            Barbers, tailors, food vendors - we get all of them here! 💯
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-ashesi-primary text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Vendors Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredVendors.map((vendor, index) => {
            const isRevealed = revealedContacts.has(vendor.id);

            return (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="card relative overflow-hidden"
              >
                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-ghana-red via-ghana-yellow to-ghana-green text-white">
                    {categories.find((c) => c.id === vendor.category)?.icon}{' '}
                    {vendor.category.toUpperCase()}
                  </span>
                </div>

                {/* Vendor Image/Icon */}
                <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                  {vendor.image ? (
                    <img
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-6xl">
                      {categories.find((c) => c.id === vendor.category)?.icon || '🏪'}
                    </div>
                  )}
                </div>

                {/* Vendor Info */}
                <h3 className="font-display text-xl font-bold mb-2">
                  {vendor.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <p className="text-gray-600 flex items-center">
                    <span className="mr-2">📍</span>
                    <span className="font-semibold">{vendor.location}</span>
                  </p>

                  {vendor.hours && (
                    <p className="text-gray-600 flex items-center">
                      <span className="mr-2">🕒</span>
                      <span>{vendor.hours}</span>
                    </p>
                  )}

                  {vendor.speciality && (
                    <p className="text-gray-600 flex items-center">
                      <span className="mr-2">⭐</span>
                      <span className="italic">"{vendor.speciality}"</span>
                    </p>
                  )}

                  {vendor.priceRange && (
                    <p className="text-gray-600 flex items-center">
                      <span className="mr-2">💰</span>
                      <span className="font-semibold">{vendor.priceRange}</span>
                    </p>
                  )}

                  {vendor.rating && (
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-2">
                        {'⭐'.repeat(Math.floor(vendor.rating))}
                      </span>
                      <span className="font-semibold text-gray-700">
                        {vendor.rating}/5.0
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {vendor.description && (
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {vendor.description}
                  </p>
                )}

                {/* Contact Button */}
                {isRevealed ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-green-50 border-2 border-green-500 rounded-lg p-4"
                  >
                    <p className="text-green-800 font-semibold mb-2 text-center">
                      Contact Info:
                    </p>
                    <a
                      href={`tel:${vendor.contact}`}
                      className="block text-center text-green-600 hover:text-green-700 font-bold mb-2"
                    >
                      📞 {vendor.contact}
                    </a>
                    {vendor.whatsapp && (
                      <a
                        href={`https://wa.me/${vendor.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center text-green-600 hover:text-green-700 font-semibold"
                      >
                        💬 WhatsApp Chat
                      </a>
                    )}
                  </motion.div>
                ) : (
                  <button
                    onClick={() => handleViewContact(vendor)}
                    className="w-full btn-primary relative group"
                  >
                    <span>View Contact</span>
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-10">
                      Tip small to unlock! 💰
                    </div>
                  </button>
                )}

                {/* Recommend Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-3 py-2 border-2 border-ghana-yellow text-ghana-yellow font-semibold rounded-lg hover:bg-ghana-yellow hover:text-white transition-all duration-300"
                >
                  👍 Recommend ({vendor.recommendations || 0})
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* No Results */}
        {filteredVendors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No vendors found
            </h3>
            <p className="text-gray-600">
              Try changing your category or check back later!
            </p>
          </motion.div>
        )}
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && selectedVendor && (
          <PaymentModal
            driver={selectedVendor}
            onClose={() => {
              setShowPayment(false);
              setSelectedVendor(null);
            }}
            onSuccess={() => handlePaymentSuccess(selectedVendor.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceHub;
