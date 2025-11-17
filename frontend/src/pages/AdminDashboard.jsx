import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedRider, setSelectedRider] = useState({});
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [currentDelivery, setCurrentDelivery] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    const authTime = localStorage.getItem('adminAuthTime');

    // Check if authenticated and session hasn't expired (24 hours)
    const isSessionValid = isAuthenticated && authTime &&
      (Date.now() - parseInt(authTime)) < 24 * 60 * 60 * 1000;

    if (!isSessionValid) {
      navigate('/admin');
    }
  }, [navigate]);

  // Mock riders - you can fetch this from backend later
  const riders = [
    'Kwame Mensah',
    'Kofi Asante',
    'Akosua Boateng',
    'Yaw Osei',
    'Ama Serwaa'
  ];

  useEffect(() => {
    fetchDeliveries();
  }, []);

  useEffect(() => {
    filterDeliveries();
  }, [activeFilter, deliveries]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/delivery/admin/all');
      setDeliveries(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      console.error('Error details:', error.response || error.message);
      setLoading(false);
      alert(`Failed to load deliveries: ${error.response?.data?.error || error.message || 'Network error'}`);
    }
  };

  const filterDeliveries = () => {
    if (activeFilter === 'all') {
      setFilteredDeliveries(deliveries);
    } else {
      setFilteredDeliveries(deliveries.filter(d => d.status === activeFilter));
    }
  };

  const handleAuthorize = async (deliveryId) => {
    try {
      await axios.put(`http://localhost:5000/api/delivery/admin/${deliveryId}/authorize`, {
        authorizedBy: 'Admin' // You can add admin name from auth later
      });
      alert('Delivery authorized successfully!');
      fetchDeliveries();
    } catch (error) {
      console.error('Error authorizing delivery:', error);
      alert('Failed to authorize delivery');
    }
  };

  const openAssignModal = (delivery) => {
    setCurrentDelivery(delivery);
    setShowAssignModal(true);
  };

  const handleAssignRider = async () => {
    if (!selectedRider[currentDelivery._id]) {
      alert('Please select a rider');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/delivery/admin/${currentDelivery._id}/assign`, {
        riderName: selectedRider[currentDelivery._id]
      });
      alert('Rider assigned successfully!');
      setShowAssignModal(false);
      setCurrentDelivery(null);
      fetchDeliveries();
    } catch (error) {
      console.error('Error assigning rider:', error);
      alert('Failed to assign rider');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      authorized: 'bg-blue-100 text-blue-800 border-blue-300',
      assigned: 'bg-purple-100 text-purple-800 border-purple-300',
      'in-progress': 'bg-orange-100 text-orange-800 border-orange-300',
      delivered: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getFilterButtonColor = (filter) => {
    if (activeFilter === filter) {
      return 'bg-ghana-green text-white';
    }
    return 'bg-white text-gray-700 hover:bg-gray-100';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminAuthTime');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ghana-yellow/20 via-white to-ghana-green/20 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 flex justify-between items-start"
        >
          <div>
            <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">
              Admin Dashboard 🛠️
            </h1>
            <p className="text-gray-600 text-lg">
              Manage delivery requests, authorize orders, and assign riders
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all flex items-center gap-2"
          >
            <span>🚪</span>
            Logout
          </motion.button>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-wrap gap-2"
        >
          {['all', 'pending', 'authorized', 'assigned', 'in-progress', 'delivered', 'cancelled'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg font-semibold border-2 transition-all ${getFilterButtonColor(filter)}`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
              <span className="ml-2 bg-white/30 px-2 py-0.5 rounded-full text-sm">
                {filter === 'all' ? deliveries.length : deliveries.filter(d => d.status === filter).length}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Deliveries List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-ghana-green border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading deliveries...</p>
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <p className="text-gray-500 text-xl">No deliveries found for this filter</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredDeliveries.map((delivery, index) => (
              <motion.div
                key={delivery._id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-ghana-green transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Delivery Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-1">
                          {delivery.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          📞 {delivery.contact}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(delivery.status)}`}>
                        {delivery.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">📦 Item</p>
                        <p className="text-sm text-gray-800">{delivery.itemDescription}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">🚚 Delivery Type</p>
                        <p className="text-sm text-gray-800 capitalize">{delivery.deliveryType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">📍 Pickup</p>
                        <p className="text-sm text-gray-800">{delivery.pickupPoint}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">📍 Dropoff</p>
                        <p className="text-sm text-gray-800">{delivery.dropoffPoint}</p>
                      </div>
                    </div>

                    {delivery.notes && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 font-semibold mb-1">📝 Notes</p>
                        <p className="text-sm text-gray-800 italic">{delivery.notes}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span>📅 Created: {formatDate(delivery.createdAt)}</span>
                      {delivery.authorizedBy && (
                        <span>✅ Authorized by: {delivery.authorizedBy} at {formatDate(delivery.authorizedAt)}</span>
                      )}
                      {delivery.assignedRider && (
                        <span>🏍️ Rider: {delivery.assignedRider} (assigned {formatDate(delivery.assignedAt)})</span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 lg:min-w-[180px]">
                    {delivery.status === 'pending' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAuthorize(delivery._id)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
                      >
                        ✅ Authorize
                      </motion.button>
                    )}

                    {delivery.status === 'authorized' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openAssignModal(delivery)}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
                      >
                        🏍️ Assign Rider
                      </motion.button>
                    )}

                    {delivery.status === 'assigned' && (
                      <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-3 text-center">
                        <p className="text-xs text-purple-700 font-semibold">Assigned to:</p>
                        <p className="text-sm text-purple-900 font-bold">{delivery.assignedRider}</p>
                      </div>
                    )}

                    {delivery.status === 'in-progress' && (
                      <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-3 text-center">
                        <p className="text-xs text-orange-700 font-semibold">In Progress</p>
                        <p className="text-sm text-orange-900 font-bold">{delivery.assignedRider}</p>
                      </div>
                    )}

                    {delivery.status === 'delivered' && (
                      <div className="bg-green-50 border-2 border-green-300 rounded-xl p-3 text-center">
                        <p className="text-xs text-green-700 font-semibold">✅ Delivered</p>
                      </div>
                    )}

                    {delivery.status === 'cancelled' && (
                      <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3 text-center">
                        <p className="text-xs text-red-700 font-semibold">❌ Cancelled</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Assign Rider Modal */}
      {showAssignModal && currentDelivery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowAssignModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-ghana-green"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
              Assign Motorcycle Rider 🏍️
            </h2>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Delivery:</strong> {currentDelivery.itemDescription}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>From:</strong> {currentDelivery.pickupPoint} → <strong>To:</strong> {currentDelivery.dropoffPoint}
              </p>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Rider *
              </label>
              <select
                value={selectedRider[currentDelivery._id] || ''}
                onChange={(e) => setSelectedRider({ ...selectedRider, [currentDelivery._id]: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-ghana-green transition-colors"
              >
                <option value="">-- Choose a rider --</option>
                {riders.map((rider) => (
                  <option key={rider} value={rider}>
                    {rider}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAssignModal(false)}
                className="flex-1 bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl hover:bg-gray-400 transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAssignRider}
                className="flex-1 bg-gradient-to-r from-ghana-green to-ghana-green/90 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Assign 🚀
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;
