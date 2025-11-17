import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-display text-xl font-bold mb-4 text-ghana-yellow">
              The Ashway
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your one-stop community hub for Ashesi University. We dey here to make your campus life smooth sotay! 🚀
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-xl font-bold mb-4 text-ghana-yellow">
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
            <h3 className="font-display text-xl font-bold mb-4 text-ghana-yellow">
              Contact Us
            </h3>
            <p className="text-gray-300 text-sm mb-2">
              For business inquiries or support:
            </p>
            <p className="text-ghana-yellow font-semibold">
              info@theashway.com
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-300 hover:text-ghana-yellow transition-colors text-2xl">📱</a>
              <a href="#" className="text-gray-300 hover:text-ghana-yellow transition-colors text-2xl">💬</a>
              <a href="#" className="text-gray-300 hover:text-ghana-yellow transition-colors text-2xl">📧</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>© 2024 The Ashway. Made with ❤️ for the Ashesi community. All rights reserved.</p>
          <p className="mt-2 italic">"Small tip go carry you far!" 😄</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
