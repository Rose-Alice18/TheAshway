import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = localStorage.getItem('userAuthenticated');
      const name = localStorage.getItem('userName');
      const email = localStorage.getItem('userEmail');
      const role = localStorage.getItem('userRole');

      setIsAuthenticated(authenticated === 'true');
      setUserName(name || email || 'User');
      setUserRole(role || 'user');
    };

    checkAuth();
    // Check auth status on every route change
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('userAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('authTime');
    setIsAuthenticated(false);
    setShowUserMenu(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/', emoji: '🏠' },
    { name: 'Drivers', path: '/drivers', emoji: '🚗' },
    { name: 'Delivery', path: '/delivery', emoji: '📦' },
    { name: 'Services', path: '/services', emoji: '🛍️' },
    { name: 'Ride Pairing', path: '/rides', emoji: '🚙' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="text-3xl"
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2L35 12V28L20 38L5 28V12L20 2Z" fill="url(#perpGradient)" stroke="#4F46E5" strokeWidth="2"/>
                <path d="M20 10L28 15V25L20 30L12 25V15L20 10Z" fill="white" fillOpacity="0.3"/>
                <defs>
                  <linearGradient id="perpGradient" x1="5" y1="2" x2="35" y2="38" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366F1"/>
                    <stop offset="0.5" stopColor="#8B5CF6"/>
                    <stop offset="1" stopColor="#A855F7"/>
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
            <span className="font-display text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              Perpway
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'bg-ashesi-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-1">{link.emoji}</span>
                {link.name}
              </Link>
            ))}

            {/* User Menu or Sign In Button */}
            {isAuthenticated ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:shadow-lg transition-all"
                >
                  <span>{userRole === 'admin' ? '👨‍💼' : '👤'}</span>
                  <span>{userName}</span>
                  <span>{showUserMenu ? '▲' : '▼'}</span>
                </button>

                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                  >
                    {userRole === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-colors border-b border-gray-100"
                      >
                        <span className="mr-2">🛠️</span>
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                      <span className="mr-2">🚪</span>
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <Link
                to="/signin"
                className="ml-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:shadow-lg transition-all"
              >
                <span className="mr-1">🔐</span>
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 my-1 ${
                  isActive(link.path)
                    ? 'bg-ashesi-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{link.emoji}</span>
                {link.name}
              </Link>
            ))}

            {/* Mobile User Menu */}
            {isAuthenticated ? (
              <>
                <div className="border-t border-gray-200 my-2 pt-2">
                  <div className="px-4 py-2 text-gray-600 text-sm font-medium">
                    <span className="mr-2">{userRole === 'admin' ? '👨‍💼' : '👤'}</span>
                    {userName}
                  </div>
                  {userRole === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-indigo-50 transition-all my-1"
                    >
                      <span className="mr-2">🛠️</span>
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all my-1"
                  >
                    <span className="mr-2">🚪</span>
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/signin"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition-all my-1 mt-2"
              >
                <span className="mr-2">🔐</span>
                Sign In
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
