import React from 'react';

const ProductCard = ({ name, price, description }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 p-5 flex flex-col items-center text-center">
      <div className="w-48 h-48 bg-rose-100 rounded-xl mb-4 flex items-center justify-center">
        <span className="text-rose-400 text-sm font-medium">Product Image</span>
      </div>
      <h3 className="text-lg font-bold text-gray-800">{name}</h3>
      <p className="text-sm text-gray-500 mt-1 mb-3">{description}</p>
      <span className="text-xl font-extrabold text-rose-600">₹{price}</span>
      <button className="mt-4 w-full py-2 border-2 border-rose-500 text-rose-500 font-semibold rounded-full hover:bg-rose-500 hover:text-white transition-colors duration-300">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;