import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ size = 'medium', animated = true }) => {
  const sizes = {
    small: { icon: 'w-8 h-8', text: 'text-xl' },
    medium: { icon: 'w-10 h-10', text: 'text-2xl' },
    large: { icon: 'w-16 h-16', text: 'text-4xl' },
  };

  const currentSize = sizes[size] || sizes.medium;

  const LogoIcon = () => (
    <motion.div
      className={`${currentSize.icon} relative`}
      whileHover={animated ? { scale: 1.1 } : {}}
      transition={{ duration: 0.3 }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>

        {/* Stylized "P" with arrow path */}
        <path
          d="M 30 20 L 30 80 M 30 20 L 60 20 C 75 20, 75 50, 60 50 L 30 50"
          stroke="url(#logoGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Arrow extending from P */}
        <path
          d="M 60 50 L 85 50 M 75 40 L 85 50 L 75 60"
          stroke="url(#logoGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </motion.div>
  );

  return (
    <div className="flex items-center space-x-2">
      <LogoIcon />
      <div className={`font-display ${currentSize.text} font-bold`}>
        <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Perp
        </span>
        <span className="text-gray-800">Way</span>
      </div>
    </div>
  );
};

export default Logo;
