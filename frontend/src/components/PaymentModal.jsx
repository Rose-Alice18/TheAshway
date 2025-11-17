import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const PaymentModal = ({ driver, onClose, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const tipAmount = 2; // GHS 2 tip

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Simulate payment processing
      const response = await axios.post('http://localhost:5000/api/payments/tip', {
        driverId: driver.id,
        amount: tipAmount,
        method: paymentMethod,
        phoneNumber,
      });

      // Simulate delay for payment processing
      setTimeout(() => {
        setProcessing(false);
        setShowSuccess(true);

        // Show success animation then close
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      setProcessing(false);
      alert('Payment failed. Please try again!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {showSuccess ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="text-7xl mb-4"
            >
              ✅
            </motion.div>
            <h3 className="font-display text-2xl font-bold text-green-600 mb-2">
              Payment Successful!
            </h3>
            <p className="text-gray-600">
              Chale, you fit see the contact now! 🎉
            </p>
          </motion.div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">💰</div>
              <h2 className="font-display text-2xl font-bold mb-2">
                Small Tip First! 😄
              </h2>
              <p className="text-gray-600">
                Support the developer and unlock {driver.name}'s contact
              </p>
            </div>

            {/* Amount */}
            <div className="bg-gradient-to-r from-ghana-red via-ghana-yellow to-ghana-green p-1 rounded-xl mb-6">
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Tip Amount</p>
                <p className="font-display text-3xl font-bold text-ashesi-primary">
                  GHS {tipAmount}.00
                </p>
              </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handlePayment}>
              {/* Payment Method */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('momo')}
                    className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                      paymentMethod === 'momo'
                        ? 'border-ghana-yellow bg-ghana-yellow/10 text-ghana-yellow'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    📱 Mobile Money
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                      paymentMethod === 'card'
                        ? 'border-ashesi-primary bg-ashesi-primary/10 text-ashesi-primary'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    💳 Card
                  </button>
                </div>
              </div>

              {/* Phone Number */}
              {paymentMethod === 'momo' && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Money Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0XX XXX XXXX"
                    className="input-field"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You will receive a prompt on your phone
                  </p>
                </div>
              )}

              {/* Mock Card Input */}
              {paymentMethod === 'card' && (
                <div className="mb-6 space-y-3">
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="input-field"
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="input-field"
                      required
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={processing || (paymentMethod === 'momo' && !phoneNumber)}
                >
                  {processing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Pay Now'
                  )}
                </button>
              </div>
            </form>

            {/* Fun Note */}
            <p className="text-center text-sm text-gray-500 mt-4 italic">
              "E no cost reach! Make we dey support each other!" 💪
            </p>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PaymentModal;
