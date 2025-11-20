import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-display text-xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Perpway
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your one-stop community hub for Ashesi University. We dey here to make your campus life smooth sotay! 🚀
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/drivers" className="text-gray-300 hover:text-ghana-yellow transition-colors">Find Drivers</a></li>
              <li><a href="/delivery" className="text-gray-300 hover:text-ghana-yellow transition-colors">Request Delivery</a></li>
              <li><a href="/services" className="text-gray-300 hover:text-ghana-yellow transition-colors">Local Services</a></li>
              <li><a href="/rides" className="text-gray-300 hover:text-ghana-yellow transition-colors">Carpool</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Contact Us
            </h3>
            <p className="text-gray-300 text-sm mb-2">
              For business inquiries or support:
            </p>
            <p className="text-indigo-400 font-semibold">
              info@perpway.com
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors text-2xl">📱</a>
              <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors text-2xl">💬</a>
              <a href="#" className="text-gray-300 hover:text-fuchsia-400 transition-colors text-2xl">📧</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>© 2024 Perpway. Made with ❤️ for the Ashesi community. All rights reserved.</p>
          <p className="mt-2 italic">"Small tip go carry you far!" 😄</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
