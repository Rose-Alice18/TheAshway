import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Delivery = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    itemDescription: '',
    pickupPoint: '',
    dropoffPoint: '',
    deliveryType: 'instant',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const deliveryTypes = [
    {
      id: 'instant',
      name: 'Instant Delivery',
      icon: '⚡',
      description: 'Same day delivery (2-4 hours)',
      price: 'GHS 15-25',
    },
    {
      id: 'next-day',
      name: 'Next-Day Delivery',
      icon: '📅',
      description: 'Delivered tomorrow',
      price: 'GHS 10-15',
    },
    {
      id: 'weekly-station',
      name: 'Weekly Station Pickup',
      icon: '📦',
      description: 'Pickup from campus station weekly',
      price: 'GHS 5-8',
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Send delivery request to backend
      await axios.post('http://localhost:5000/api/delivery/request', formData);

      // Show success animation
      setTimeout(() => {
        setSubmitting(false);
        setShowSuccess(true);

        // Reset form after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
          setFormData({
            name: '',
            contact: '',
            itemDescription: '',
            pickupPoint: '',
            dropoffPoint: '',
            deliveryType: 'instant',
            notes: '',
          });
        }, 3000);
      }, 1500);
    } catch (error) {
      console.error('Delivery request error:', error);
      setSubmitting(false);
      alert('Failed to submit request. Please try again!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Delivery Service 📦
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Need something delivered to campus? No wahala! Fill the form below
            and we go sort you out! 🚚
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Delivery Types */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <h2 className="font-display text-xl font-bold mb-4">
              Choose Delivery Type
            </h2>
            <div className="space-y-3">
              {deliveryTypes.map((type) => (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, deliveryType: type.id })}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    formData.deliveryType === type.id
                      ? 'border-ashesi-primary bg-ashesi-primary/5 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="text-3xl mr-3">{type.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{type.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                      <p className="text-sm font-semibold text-ashesi-primary">
                        {type.price}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-ghana-yellow/10 border-2 border-ghana-yellow rounded-xl p-4">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                <span className="mr-2">💡</span> Pro Tip
              </h3>
              <p className="text-sm text-gray-700">
                Weekly station pickup dey save money pass! If e no dey urgent,
                e fit wait small. Your parcel go dey safe! 📦
              </p>
            </div>
          </motion.div>

          {/* Delivery Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="card">
              <h2 className="font-display text-xl font-bold mb-6">
                Delivery Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Kwame Mensah"
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      placeholder="0XX XXX XXXX"
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                {/* Item Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Item Description *
                  </label>
                  <textarea
                    name="itemDescription"
                    value={formData.itemDescription}
                    onChange={handleChange}
                    placeholder="Describe what you want delivered (e.g., Books, Food, Electronics)"
                    className="input-field min-h-[100px] resize-none"
                    required
                  />
                </div>

                {/* Locations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pickup Point *
                    </label>
                    <input
                      type="text"
                      name="pickupPoint"
                      value={formData.pickupPoint}
                      onChange={handleChange}
                      placeholder="e.g., Madina Market"
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Drop-off Point *
                    </label>
                    <input
                      type="text"
                      name="dropoffPoint"
                      value={formData.dropoffPoint}
                      onChange={handleChange}
                      placeholder="e.g., Ashesi Campus - Volta Hall"
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special instructions? E.g., 'Call me when you reach gate'"
                    className="input-field min-h-[80px] resize-none"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting Request...
                    </span>
                  ) : (
                    'Submit Delivery Request 🚀'
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
            >
              <motion.div
                animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="text-7xl mb-4"
              >
                ✅
              </motion.div>
              <h3 className="font-display text-3xl font-bold text-green-600 mb-3">
                Request Received!
              </h3>
              <p className="text-lg text-gray-700 mb-2">
                Your parcel dey on road already! 🚚💨
              </p>
              <p className="text-gray-600">
                We go contact you shortly to confirm the delivery details.
              </p>
              <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 font-semibold">
                  Check your phone for updates! 📱
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Delivery;
