import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const features = [
    {
      title: 'Driver Finder',
      description: 'Connect with trusted local drivers for your transport needs. Small tip den you go fit move chale! 🚗',
      icon: '🚗',
      path: '/drivers',
      color: 'from-red-500 to-red-600',
    },
    {
      title: 'Delivery Service',
      description: 'Need something delivered to campus? We got you covered with instant, next-day, and weekly options! 📦',
      icon: '📦',
      path: '/delivery',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      title: 'Local Services',
      description: 'Find the best barbers, tailors, fruit vendors, and more around Berekuso. All your needs, one place! 🛍️',
      icon: '🛍️',
      path: '/services',
      color: 'from-green-600 to-green-700',
    },
    {
      title: 'Ride Pairing',
      description: 'Going somewhere? Find others heading the same way and share the ride. Save money, make friends! 🚙',
      icon: '🚙',
      path: '/rides',
      color: 'from-blue-500 to-blue-600',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-ghana-red via-ghana-yellow to-ghana-green py-20 px-4">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto text-center text-white">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
              Welcome to The Ashway! 🇬🇭
            </h1>
            <p className="text-xl md:text-2xl mb-4 font-medium">
              Your Ashesi Community Hub
            </p>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              E be like say you dey find driver? You need delivery? Want local services? We dey here for you!
              Everything wey you need, all for one place. Make we help you! 💪
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="#features"
                className="inline-block bg-white text-ashesi-primary font-bold py-4 px-8 rounded-full shadow-2xl hover:shadow-xl transition-all duration-300"
              >
                Explore Services 🚀
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              What We Offer
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              All the services wey go make your campus life sweet pass! Choose what you need below 👇
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="card"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-4xl mb-4 mx-auto`}>
                  {feature.icon}
                </div>
                <h3 className="font-display text-xl font-bold mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 text-center leading-relaxed">
                  {feature.description}
                </p>
                <Link
                  to={feature.path}
                  className="block w-full text-center bg-ashesi-primary text-white py-3 rounded-lg font-semibold hover:bg-ashesi-primary/90 transition-all duration-300"
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-ashesi-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Join the Ashway Community! 🎉
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Whether you dey look for ride, need delivery, or want connect with local vendors,
              we get you covered. Make we help you navigate campus life with ease!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/drivers"
                className="btn-secondary"
              >
                Find a Driver Now
              </Link>
              <Link
                to="/rides"
                className="bg-white text-ashesi-primary font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300"
              >
                Start Carpooling
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fun Facts Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6"
            >
              <div className="text-5xl mb-3">🚗</div>
              <h3 className="font-display text-3xl font-bold text-ashesi-primary mb-2">20+</h3>
              <p className="text-gray-600">Trusted Drivers</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6"
            >
              <div className="text-5xl mb-3">📦</div>
              <h3 className="font-display text-3xl font-bold text-ashesi-primary mb-2">100+</h3>
              <p className="text-gray-600">Deliveries Made</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6"
            >
              <div className="text-5xl mb-3">😊</div>
              <h3 className="font-display text-3xl font-bold text-ashesi-primary mb-2">500+</h3>
              <p className="text-gray-600">Happy Students</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
