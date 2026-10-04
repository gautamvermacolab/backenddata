import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <Link to="/" className="text-2xl font-extrabold text-rose-600 tracking-wider">
              heysharlo.
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-rose-500 font-medium transition duration-300">Home</Link>
            <Link to="/shop" className="text-gray-700 hover:text-rose-500 font-medium transition duration-300">Shop</Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-rose-500 font-medium transition duration-300">Cart (0)</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;