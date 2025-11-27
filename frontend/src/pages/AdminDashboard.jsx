import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Data states
  const [deliveries, setDeliveries] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [rides, setRides] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [users, setUsers] = useState([]);

  // Filter states
  const [loading, setLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('userAuthenticated');
    const userRole = localStorage.getItem('userRole');
    const authTime = localStorage.getItem('authTime');

    const isSessionValid = isAuthenticated && userRole === 'admin' && authTime &&
      (Date.now() - parseInt(authTime)) < 24 * 60 * 60 * 1000;

    if (!isSessionValid) {
      navigate('/signin');
    }
  }, [navigate]);

  // Mock riders
  const riders = [
    'Kwame Mensah',
    'Kofi Asante',
    'Akosua Boateng',
    'Yaw Osei',
    'Ama Serwaa'
  ];

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Fetch deliveries
      const deliveriesRes = await axios.get('http://localhost:5000/api/delivery/admin/all');
      setDeliveries(deliveriesRes.data);

      // Fetch drivers
      const driversRes = await axios.get('http://localhost:5000/api/drivers');
      setDrivers(driversRes.data);

      // Fetch rides
      const ridesRes = await axios.get('http://localhost:5000/api/rides');
      setRides(ridesRes.data);

      // Fetch vendors
      const vendorsRes = await axios.get('http://localhost:5000/api/vendors');
      setVendors(vendorsRes.data);

      // Get users from localStorage (since we're using localStorage auth)
      const perpwayUsers = JSON.parse(localStorage.getItem('perpwayUsers') || '[]');
      setUsers(perpwayUsers);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('authTime');
    navigate('/signin');
  };

  const exportToCSV = (data, filename, headers) => {
    const csvData = data.map(row => headers.map(h => row[h] || ''));
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getOverviewStats = () => {
    return {
      totalDeliveries: deliveries.length,
      activeDeliveries: deliveries.filter(d => ['pending', 'authorized', 'assigned', 'in-progress'].includes(d.status)).length,
      completedDeliveries: deliveries.filter(d => d.status === 'delivered').length,
      totalDrivers: drivers.length,
      totalRides: rides.length,
      activeRides: rides.filter(r => r.availableSeats > 0).length,
      totalVendors: vendors.length,
      totalUsers: users.length + 1, // +1 for admin
    };
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊', color: 'ashesi-primary' },
    { id: 'deliveries', name: 'Deliveries', icon: '📦', color: 'blue-600' },
    { id: 'drivers', name: 'Drivers', icon: '🚗', color: 'green-600' },
    { id: 'rides', name: 'Rides', icon: '🚙', color: 'purple-600' },
    { id: 'vendors', name: 'Vendors', icon: '🛍️', color: 'orange-600' },
    { id: 'users', name: 'Users', icon: '👥', color: 'pink-600' },
  ];

  const stats = getOverviewStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ghana-yellow/20 via-white to-ghana-green/20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-ghana-green border-t-transparent mb-4"></div>
          <p className="text-xl font-semibold text-gray-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ghana-yellow/20 via-white to-ghana-green/20 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-1">
              Admin Control Center 🛠️
            </h1>
            <p className="text-gray-600">
              Manage all aspects of the Perpway platform
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="bg-ghana-red hover:bg-ghana-red/90 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all flex items-center gap-2"
          >
            <span>🚪</span>
            Logout
          </motion.button>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-2 mb-6 border-2 border-gray-100 overflow-x-auto"
        >
          <div className="flex gap-1 min-w-max">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const colorMap = {
                'overview': isActive ? 'bg-ashesi-primary' : '',
                'deliveries': isActive ? 'bg-blue-600' : '',
                'drivers': isActive ? 'bg-green-600' : '',
                'rides': isActive ? 'bg-purple-600' : '',
                'vendors': isActive ? 'bg-orange-500' : '',
                'users': isActive ? 'bg-pink-600' : '',
              };
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    isActive
                      ? `${colorMap[tab.id]} text-white shadow-lg scale-[1.02]`
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && <OverviewTab stats={stats} />}
          {activeTab === 'deliveries' && <DeliveriesTab deliveries={deliveries} fetchData={fetchAllData} riders={riders} exportToCSV={exportToCSV} />}
          {activeTab === 'drivers' && <DriversTab drivers={drivers} fetchData={fetchAllData} exportToCSV={exportToCSV} />}
          {activeTab === 'rides' && <RidesTab rides={rides} fetchData={fetchAllData} exportToCSV={exportToCSV} />}
          {activeTab === 'vendors' && <VendorsTab vendors={vendors} fetchData={fetchAllData} exportToCSV={exportToCSV} />}
          {activeTab === 'users' && <UsersTab users={users} fetchData={fetchAllData} exportToCSV={exportToCSV} />}
        </motion.div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ stats }) => {
  const statCards = [
    { label: 'Total Deliveries', value: stats.totalDeliveries, icon: '📦', color: 'blue', active: stats.activeDeliveries },
    { label: 'Total Drivers', value: stats.totalDrivers, icon: '🚗', color: 'green' },
    { label: 'Total Rides', value: stats.totalRides, icon: '🚙', color: 'purple', active: stats.activeRides },
    { label: 'Total Vendors', value: stats.totalVendors, icon: '🛍️', color: 'orange' },
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'pink' },
    { label: 'Completed Deliveries', value: stats.completedDeliveries, icon: '✅', color: 'green' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Platform Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-${stat.color}-50 border-2 border-${stat.color}-300 rounded-xl p-6 shadow-md`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">{stat.icon}</span>
              <div className="text-right">
                <p className={`text-xs text-${stat.color}-700 font-semibold mb-1`}>{stat.label}</p>
                <p className={`text-3xl font-bold text-${stat.color}-900`}>{stat.value}</p>
                {stat.active !== undefined && (
                  <p className={`text-xs text-${stat.color}-600 mt-1`}>{stat.active} active</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <button className="px-4 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all">
            📦 View All Deliveries
          </button>
          <button className="px-4 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all">
            🚗 Manage Drivers
          </button>
          <button className="px-4 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-all">
            🚙 View Rides
          </button>
          <button className="px-4 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all">
            🛍️ Manage Vendors
          </button>
          <button className="px-4 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-all">
            👥 View Users
          </button>
          <button className="px-4 py-3 bg-ashesi-primary text-white rounded-lg font-semibold hover:bg-ashesi-primary/90 transition-all">
            📊 Export Reports
          </button>
        </div>
      </div>
    </div>
  );
};

// Deliveries Tab Component
const DeliveriesTab = ({ deliveries, fetchData, riders, exportToCSV }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [selectedRider, setSelectedRider] = useState('');

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    const matchesType = typeFilter === 'all' || delivery.deliveryType === typeFilter;
    const matchesSearch = !searchTerm ||
      delivery.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.itemDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.contact?.includes(searchTerm);
    return matchesStatus && matchesType && matchesSearch;
  });

  const statusColors = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
    authorized: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
    assigned: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
    'in-progress': { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
    delivered: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
  };

  const handleAuthorize = async (deliveryId) => {
    try {
      await axios.put(`http://localhost:5000/api/delivery/${deliveryId}/status`, { status: 'authorized' });
      fetchData();
    } catch (error) {
      console.error('Error authorizing delivery:', error);
      alert('Failed to authorize delivery');
    }
  };

  const handleAssignRider = async () => {
    if (!selectedRider || !selectedDelivery) return;

    try {
      await axios.put(`http://localhost:5000/api/delivery/${selectedDelivery._id}/assign`, {
        assignedRider: selectedRider
      });
      setShowAssignModal(false);
      setSelectedDelivery(null);
      setSelectedRider('');
      fetchData();
    } catch (error) {
      console.error('Error assigning rider:', error);
      alert('Failed to assign rider');
    }
  };

  const handleUpdateStatus = async (deliveryId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/delivery/${deliveryId}/status`, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">📦 Deliveries Management</h2>
            <p className="text-gray-600">Showing {filteredDeliveries.length} / {deliveries.length} deliveries</p>
          </div>
          <button
            onClick={() => exportToCSV(filteredDeliveries, 'deliveries', ['name', 'contact', 'itemDescription', 'pickupLocation', 'dropoffLocation', 'status', 'deliveryType'])}
            className="px-4 py-2 bg-ghana-green text-white rounded-lg font-semibold hover:bg-ghana-green/90 transition-all flex items-center gap-2"
          >
            <span>📥</span>
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name, item, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="authorized">Authorized</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
            >
              <option value="all">All Types</option>
              <option value="instant">Instant Delivery</option>
              <option value="next-day">Next Day Delivery</option>
            </select>
          </div>
        </div>
      </div>

      {/* Deliveries List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredDeliveries.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-lg border-2 border-gray-100 text-center">
            <p className="text-gray-500 text-lg">No deliveries found matching your filters</p>
          </div>
        ) : (
          filteredDeliveries.map((delivery) => (
            <motion.div
              key={delivery._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Delivery Info */}
                <div className="lg:col-span-2">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{delivery.name}</h3>
                      <p className="text-sm text-gray-600">{delivery.contact}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${statusColors[delivery.status]?.bg} ${statusColors[delivery.status]?.text} ${statusColors[delivery.status]?.border}`}>
                      {delivery.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold text-gray-700">Item:</span> {delivery.itemDescription}</p>
                    <p><span className="font-semibold text-gray-700">Pickup:</span> {delivery.pickupLocation}</p>
                    <p><span className="font-semibold text-gray-700">Dropoff:</span> {delivery.dropoffLocation}</p>
                    <p><span className="font-semibold text-gray-700">Type:</span> <span className="capitalize">{delivery.deliveryType}</span></p>
                    {delivery.specialInstructions && (
                      <p><span className="font-semibold text-gray-700">Notes:</span> {delivery.specialInstructions}</p>
                    )}
                  </div>
                </div>

                {/* Rider Info */}
                <div className="lg:col-span-1">
                  {delivery.assignedRider ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs font-semibold text-gray-500 mb-2">Assigned Rider</p>
                      <p className="font-semibold text-gray-900">{delivery.assignedRider}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs font-semibold text-gray-500">No rider assigned</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="lg:col-span-1 flex flex-col gap-2">
                  {delivery.status === 'pending' && (
                    <button
                      onClick={() => handleAuthorize(delivery._id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all text-sm"
                    >
                      ✅ Authorize
                    </button>
                  )}
                  {delivery.status === 'authorized' && (
                    <button
                      onClick={() => {
                        setSelectedDelivery(delivery);
                        setShowAssignModal(true);
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all text-sm"
                    >
                      👤 Assign Rider
                    </button>
                  )}
                  {delivery.status === 'assigned' && (
                    <button
                      onClick={() => handleUpdateStatus(delivery._id, 'in-progress')}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all text-sm"
                    >
                      🚚 Start Delivery
                    </button>
                  )}
                  {delivery.status === 'in-progress' && (
                    <button
                      onClick={() => handleUpdateStatus(delivery._id, 'delivered')}
                      className="px-4 py-2 bg-ghana-green text-white rounded-lg font-semibold hover:bg-ghana-green/90 transition-all text-sm"
                    >
                      ✅ Mark Delivered
                    </button>
                  )}
                  {['pending', 'authorized', 'assigned'].includes(delivery.status) && (
                    <button
                      onClick={() => handleUpdateStatus(delivery._id, 'cancelled')}
                      className="px-4 py-2 bg-ghana-red text-white rounded-lg font-semibold hover:bg-ghana-red/90 transition-all text-sm"
                    >
                      ❌ Cancel
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Assign Rider Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Assign Rider</h3>
            <p className="text-gray-600 mb-6">
              Select a rider for delivery: <span className="font-semibold">{selectedDelivery?.itemDescription}</span>
            </p>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Rider</label>
              <select
                value={selectedRider}
                onChange={(e) => setSelectedRider(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
              >
                <option value="">-- Choose a rider --</option>
                {riders.map((rider, index) => (
                  <option key={index} value={rider}>{rider}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAssignRider}
                disabled={!selectedRider}
                className="flex-1 px-4 py-3 bg-ghana-green text-white rounded-lg font-semibold hover:bg-ghana-green/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
              >
                Assign
              </button>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedDelivery(null);
                  setSelectedRider('');
                }}
                className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Drivers Tab Component
const DriversTab = ({ drivers, fetchData, exportToCSV }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    carType: '',
    location: ''
  });

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = !searchTerm ||
      driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.contact?.includes(searchTerm) ||
      driver.carType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === 'all' || driver.location === locationFilter;
    return matchesSearch && matchesLocation;
  });

  const locations = [...new Set(drivers.map(d => d.location))].filter(Boolean);

  const handleAdd = async () => {
    try {
      await axios.post('http://localhost:5000/api/drivers', formData);
      setShowAddModal(false);
      setFormData({ name: '', contact: '', carType: '', location: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding driver:', error);
      alert('Failed to add driver: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/drivers/${selectedDriver._id}`, formData);
      setShowEditModal(false);
      setSelectedDriver(null);
      setFormData({ name: '', contact: '', carType: '', location: '' });
      fetchData();
    } catch (error) {
      console.error('Error updating driver:', error);
      alert('Failed to update driver: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (driverId) => {
    if (!window.confirm('Are you sure you want to delete this driver?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/drivers/${driverId}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting driver:', error);
      alert('Failed to delete driver: ' + (error.response?.data?.message || error.message));
    }
  };

  const openEditModal = (driver) => {
    setSelectedDriver(driver);
    setFormData({
      name: driver.name,
      contact: driver.contact,
      carType: driver.carType,
      location: driver.location
    });
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">🚗 Drivers Management</h2>
            <p className="text-gray-600">Showing {filteredDrivers.length} / {drivers.length} drivers</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-ashesi-primary text-white rounded-lg font-semibold hover:bg-ashesi-primary/90 transition-all flex items-center gap-2"
            >
              <span>➕</span>
              Add Driver
            </button>
            <button
              onClick={() => exportToCSV(filteredDrivers, 'drivers', ['name', 'contact', 'carType', 'location'])}
              className="px-4 py-2 bg-ghana-green text-white rounded-lg font-semibold hover:bg-ghana-green/90 transition-all flex items-center gap-2"
            >
              <span>📥</span>
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name, contact, or vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
            >
              <option value="all">All Locations</option>
              {locations.map((location, index) => (
                <option key={index} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDrivers.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-12 shadow-lg border-2 border-gray-100 text-center">
            <p className="text-gray-500 text-lg">No drivers found matching your filters</p>
          </div>
        ) : (
          filteredDrivers.map((driver) => (
            <motion.div
              key={driver._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <span className="text-2xl">🚗</span>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold border-2 border-green-300">
                  ACTIVE
                </span>
              </div>

              <h3 className="font-bold text-lg text-gray-900 mb-2">{driver.name}</h3>

              <div className="space-y-2 text-sm mb-4">
                <p className="flex items-center gap-2">
                  <span className="text-gray-500">📱</span>
                  <span className="text-gray-700">{driver.contact}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-gray-500">🚙</span>
                  <span className="text-gray-700">{driver.carType}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-gray-500">📍</span>
                  <span className="text-gray-700">{driver.location}</span>
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(driver)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all text-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(driver._id)}
                  className="flex-1 px-3 py-2 bg-ghana-red text-white rounded-lg font-semibold hover:bg-ghana-red/90 transition-all text-sm"
                >
                  🗑️ Delete
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Driver</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Driver Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter driver name"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="Phone number"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Car Type</label>
                <input
                  type="text"
                  value={formData.carType}
                  onChange={(e) => setFormData({ ...formData, carType: e.target.value })}
                  placeholder="e.g. Toyota Camry, Honda Civic"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Current location"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                className="flex-1 px-4 py-3 bg-ghana-green text-white rounded-lg font-semibold hover:bg-ghana-green/90 transition-all"
              >
                Add Driver
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ name: '', contact: '', carType: '', location: '' });
                }}
                className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Driver Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Driver</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Driver Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle</label>
                <input
                  type="text"
                  value={formData.vehicle}
                  onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleEdit}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedDriver(null);
                  setFormData({ name: '', contact: '', carType: '', location: '' });
                }}
                className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Rides Tab Component
const RidesTab = ({ rides, fetchData, exportToCSV }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);

  const filteredRides = rides.filter(ride => {
    const matchesSearch = !searchTerm ||
      ride.pickup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.creatorName?.toLowerCase().includes(searchTerm.toLowerCase());

    const isActive = new Date(ride.date) >= new Date();
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && isActive) ||
      (statusFilter === 'completed' && !isActive);

    return matchesSearch && matchesStatus;
  });

  const handleDeleteRide = async (rideId) => {
    if (!window.confirm('Are you sure you want to delete this ride?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/rides/${rideId}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting ride:', error);
      alert('Failed to delete ride');
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const isRideActive = (ride) => new Date(ride.date) >= new Date();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">🚙 Rides Management</h2>
            <p className="text-gray-600">Showing {filteredRides.length} / {rides.length} rides</p>
          </div>
          <button
            onClick={() => exportToCSV(filteredRides, 'rides', ['pickup', 'destination', 'date', 'time', 'availableSeats', 'creatorName'])}
            className="px-4 py-2 bg-ghana-green text-white rounded-lg font-semibold hover:bg-ghana-green/90 transition-all flex items-center gap-2"
          >
            <span>📥</span> Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by pickup, destination, or creator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
            >
              <option value="all">All Rides</option>
              <option value="active">Active (Upcoming)</option>
              <option value="completed">Completed (Past)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRides.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-12 shadow-lg border-2 border-gray-100 text-center">
            <p className="text-gray-500 text-lg">No rides found matching your filters</p>
          </div>
        ) : (
          filteredRides.map((ride) => (
            <motion.div
              key={ride._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <span className="text-2xl">🚙</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${
                  isRideActive(ride) ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-100 text-gray-600 border-gray-300'
                }`}>
                  {isRideActive(ride) ? 'ACTIVE' : 'COMPLETED'}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 text-lg">📍</span>
                  <div>
                    <p className="text-xs text-gray-500">From</p>
                    <p className="font-semibold text-gray-900">{ride.pickup}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600 text-lg">🎯</span>
                  <div>
                    <p className="text-xs text-gray-500">To</p>
                    <p className="font-semibold text-gray-900">{ride.destination}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-semibold text-sm">{formatDate(ride.date)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-semibold text-sm">{ride.time}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">Seats</p>
                  <p className="font-semibold text-sm">{ride.availableSeats}</p>
                </div>
              </div>

              {ride.creatorName && (
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-semibold">Created by:</span> {ride.creatorName}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => { setSelectedRide(ride); setShowDetailsModal(true); }}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all text-sm"
                >
                  👁️ View Details
                </button>
                <button
                  onClick={() => handleDeleteRide(ride._id)}
                  className="flex-1 px-3 py-2 bg-ghana-red text-white rounded-lg font-semibold hover:bg-ghana-red/90 transition-all text-sm"
                >
                  🗑️ Delete
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {showDetailsModal && selectedRide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl max-h-[80vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Ride Details</h3>
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Route</p>
                <p className="font-semibold text-gray-900">{selectedRide.pickup} → {selectedRide.destination}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(selectedRide.date)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Time</p>
                  <p className="font-semibold text-gray-900">{selectedRide.time}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Available Seats</p>
                <p className="font-semibold text-gray-900">{selectedRide.availableSeats}</p>
              </div>
              {selectedRide.joinedUsers && selectedRide.joinedUsers.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-2">Joined Passengers ({selectedRide.joinedUsers.length})</p>
                  <div className="space-y-2">
                    {selectedRide.joinedUsers.map((user, index) => (
                      <div key={index} className="flex items-center gap-2 bg-white rounded-lg p-2">
                        <span className="text-lg">👤</span>
                        <span className="font-medium">{user}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => { setShowDetailsModal(false); setSelectedRide(null); }}
              className="w-full px-4 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Vendors Tab Component
const VendorsTab = ({ vendors, fetchData, exportToCSV }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    contact: '',
    category: '',
    location: '',
    description: ''
  });

  const categories = [
    { id: 'fruits', name: 'Fruits & Vegetables', icon: '🍎' },
    { id: 'tailoring', name: 'Tailoring', icon: '🧵' },
    { id: 'barbershop', name: 'Barbershop', icon: '💈' },
    { id: 'salon', name: 'Hair Salon', icon: '💇' },
    { id: 'food', name: 'Food & Snacks', icon: '🍽️' },
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'laundry', name: 'Laundry', icon: '👕' },
    { id: 'other', name: 'Other', icon: '🏪' }
  ];

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = !searchTerm ||
      vendor.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contact?.includes(searchTerm);
    const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = async () => {
    try {
      await axios.post('http://localhost:5000/api/vendors', formData);
      setShowAddModal(false);
      setFormData({ businessName: '', ownerName: '', contact: '', category: '', location: '', description: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding vendor:', error);
      alert('Failed to add vendor');
    }
  };

  const handleEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/vendors/${selectedVendor._id}`, formData);
      setShowEditModal(false);
      setSelectedVendor(null);
      setFormData({ businessName: '', ownerName: '', contact: '', category: '', location: '', description: '' });
      fetchData();
    } catch (error) {
      console.error('Error updating vendor:', error);
      alert('Failed to update vendor');
    }
  };

  const handleDelete = async (vendorId) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/vendors/${vendorId}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting vendor:', error);
      alert('Failed to delete vendor');
    }
  };

  const openEditModal = (vendor) => {
    setSelectedVendor(vendor);
    setFormData({
      businessName: vendor.businessName || '',
      ownerName: vendor.ownerName || '',
      contact: vendor.contact || '',
      category: vendor.category || '',
      location: vendor.location || '',
      description: vendor.description || ''
    });
    setShowEditModal(true);
  };

  const getCategoryIcon = (cat) => categories.find(c => c.id === cat)?.icon || '🏪';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">🛍️ Vendors Management</h2>
            <p className="text-gray-600">Showing {filteredVendors.length} / {vendors.length} vendors</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-ashesi-primary text-white rounded-lg font-semibold hover:bg-ashesi-primary/90 transition-all flex items-center gap-2"
            >
              <span>➕</span> Add Vendor
            </button>
            <button
              onClick={() => exportToCSV(filteredVendors, 'vendors', ['businessName', 'ownerName', 'contact', 'category', 'location'])}
              className="px-4 py-2 bg-ghana-green text-white rounded-lg font-semibold hover:bg-ghana-green/90 transition-all flex items-center gap-2"
            >
              <span>📥</span> Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by business name, owner, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVendors.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-12 shadow-lg border-2 border-gray-100 text-center">
            <p className="text-gray-500 text-lg">No vendors found matching your filters</p>
          </div>
        ) : (
          filteredVendors.map((vendor) => (
            <motion.div
              key={vendor._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-orange-100 rounded-full p-3">
                  <span className="text-2xl">{getCategoryIcon(vendor.category)}</span>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold border-2 border-green-300">
                  ACTIVE
                </span>
              </div>

              <h3 className="font-bold text-lg text-gray-900 mb-1">{vendor.businessName}</h3>
              <p className="text-sm text-gray-600 mb-3">{vendor.ownerName}</p>

              <div className="space-y-2 text-sm mb-4">
                <p className="flex items-center gap-2">
                  <span className="text-gray-500">📱</span>
                  <span className="text-gray-700">{vendor.contact}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-gray-500">🏷️</span>
                  <span className="text-gray-700 capitalize">{vendor.category || 'General'}</span>
                </p>
                {vendor.location && (
                  <p className="flex items-center gap-2">
                    <span className="text-gray-500">📍</span>
                    <span className="text-gray-700">{vendor.location}</span>
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(vendor)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all text-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(vendor._id)}
                  className="flex-1 px-3 py-2 bg-ghana-red text-white rounded-lg font-semibold hover:bg-ghana-red/90 transition-all text-sm"
                >
                  🗑️ Delete
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Vendor</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="Enter business name"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Owner Name</label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  placeholder="Enter owner name"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="Phone number"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Business location"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of services"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                className="flex-1 px-4 py-3 bg-ghana-green text-white rounded-lg font-semibold hover:bg-ghana-green/90 transition-all"
              >
                Add Vendor
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ businessName: '', ownerName: '', contact: '', category: '', location: '', description: '' });
                }}
                className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Vendor Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Vendor</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Owner Name</label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleEdit}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedVendor(null);
                  setFormData({ businessName: '', ownerName: '', contact: '', category: '', location: '', description: '' });
                }}
                className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Users Tab Component
const UsersTab = ({ users, fetchData, exportToCSV }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Admin user to always show
  const adminUser = {
    id: 'admin',
    name: 'Admin',
    email: 'admin@perpway.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
    isAdmin: true
  };

  const allUsers = [adminUser, ...users.map(u => ({ ...u, role: u.role || 'user' }))];

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = !searchTerm ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = (userId) => {
    if (userId === 'admin') {
      alert('Cannot delete admin user');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    const perpwayUsers = JSON.parse(localStorage.getItem('perpwayUsers') || '[]');
    const updatedUsers = perpwayUsers.filter(u => u.id !== userId);
    localStorage.setItem('perpwayUsers', JSON.stringify(updatedUsers));
    fetchData();
  };

  const handleToggleRole = (userId, currentRole) => {
    if (userId === 'admin') {
      alert('Cannot modify admin user');
      return;
    }

    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const perpwayUsers = JSON.parse(localStorage.getItem('perpwayUsers') || '[]');
    const updatedUsers = perpwayUsers.map(u =>
      u.id === userId ? { ...u, role: newRole } : u
    );
    localStorage.setItem('perpwayUsers', JSON.stringify(updatedUsers));
    fetchData();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">👥 Users Management</h2>
            <p className="text-gray-600">Showing {filteredUsers.length} / {allUsers.length} users</p>
          </div>
          <button
            onClick={() => exportToCSV(filteredUsers, 'users', ['name', 'email', 'role', 'createdAt'])}
            className="px-4 py-2 bg-ghana-green text-white rounded-lg font-semibold hover:bg-ghana-green/90 transition-all flex items-center gap-2"
          >
            <span>📥</span> Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ashesi-primary"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">User</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Role</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Joined</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No users found matching your filters
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                          user.isAdmin ? 'bg-ashesi-primary' : 'bg-blue-600'
                        }`}>
                          {user.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <span className="font-semibold text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${
                        user.role === 'admin'
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : 'bg-blue-100 text-blue-800 border-blue-300'
                      }`}>
                        {user.role?.toUpperCase() || 'USER'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(user.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => { setSelectedUser(user); setShowDetailsModal(true); }}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all text-xs"
                        >
                          👁️ View
                        </button>
                        {!user.isAdmin && (
                          <>
                            <button
                              onClick={() => handleToggleRole(user.id, user.role)}
                              className="px-3 py-1.5 bg-ghana-yellow text-gray-900 rounded-lg font-semibold hover:bg-ghana-yellow/90 transition-all text-xs"
                            >
                              🔄 Toggle Role
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="px-3 py-1.5 bg-ghana-red text-white rounded-lg font-semibold hover:bg-ghana-red/90 transition-all text-xs"
                            >
                              🗑️ Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-white text-3xl mx-auto mb-4 ${
                selectedUser.isAdmin ? 'bg-ashesi-primary' : 'bg-blue-600'
              }`}>
                {selectedUser.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h3>
              <p className="text-gray-600">{selectedUser.email}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Role</p>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${
                  selectedUser.role === 'admin'
                    ? 'bg-red-100 text-red-800 border-red-300'
                    : 'bg-blue-100 text-blue-800 border-blue-300'
                }`}>
                  {selectedUser.role?.toUpperCase() || 'USER'}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Member Since</p>
                <p className="font-semibold text-gray-900">{formatDate(selectedUser.createdAt)}</p>
              </div>
              {selectedUser.isAdmin && (
                <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
                  <p className="text-sm text-yellow-800 font-semibold">This is the system admin account</p>
                </div>
              )}
            </div>

            <button
              onClick={() => { setShowDetailsModal(false); setSelectedUser(null); }}
              className="w-full px-4 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
