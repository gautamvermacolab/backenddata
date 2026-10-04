import React, { useState } from 'react';
import { categoriesWithSub } from '../../data/navigationData';

const Navbar = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryClick = (id) => {
    // Mobile tap toggle support
    setActiveCategory(activeCategory === id ? null : id);
  };

  return (
    <div className="bg-[#004D36] border-t border-[#006039] relative w-full z-40">
      <div 
        className="max-w-7xl mx-auto flex items-center text-sm font-medium overflow-x-auto whitespace-nowrap px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <button className="px-3 md:px-4 py-3 text-[#FFFFFF] font-extrabold flex items-center gap-2 hover:bg-[#006039] flex-shrink-0">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
          </span>
          LIVE
        </button>

        {categoriesWithSub.map((category) => (
          <div 
            key={category.id} 
            className="relative group flex-shrink-0"
            onMouseEnter={() => setActiveCategory(category.id)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <button 
              onClick={() => handleCategoryClick(category.id)}
              className="px-3 md:px-4 py-3 text-[#DDD9CD] hover:text-[#FFFFFF] lg:hover:bg-[#006039] outline-none"
            >
              {category.label}
            </button>

            {/* Subcategories Dropdown */}
            {activeCategory === category.id && category.subcategories && (
              <div className="absolute left-0 top-full w-48 bg-white text-[#171A17] shadow-xl rounded-b-md py-2 border border-gray-200 z-50 animate-fadeIn">
                {category.subcategories.map((sub, index) => (
                  <a 
                    key={index} 
                    href={`#${sub.toLowerCase()}`} 
                    className="block px-4 py-2 text-sm hover:bg-[#F8F6EF] hover:text-[#006039] transition-colors"
                  >
                    {sub}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;