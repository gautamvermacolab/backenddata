import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mainlogo from "../../assets/mainlogo.png";

const Header = ({ user, handleLogout }) => {
  const navigate = useNavigate();
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  return (
    <header className="bg-[#006039] text-[#FFFFFF] relative z-50 shadow-md">
      <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-y-3">
        
        {/* Logo & Location */}
        <div className="flex items-center gap-4 w-1/2 md:w-auto">
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
            <img src={mainlogo} alt="heysharlo logo" className="h-8 md:h-10 object-contain" />
          </div>

          <div className="hidden lg:flex flex-col cursor-pointer hover:text-[#C9A227] transition-all">
            <span className="text-[#DDD9CD] text-[10px] md:text-xs pl-4">
              Deliver to {user.name?.split(' ')[0] || 'Guest'}
            </span>
            <div className="flex items-center font-bold text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {user.location || 'Location Not Found'}
            </div>
          </div>
        </div>

        {/* Mobile Cart Icon */}
        <div className="flex md:hidden items-center justify-end gap-4 w-1/2">
           <div className="cursor-pointer flex items-center relative">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-1 -right-2 bg-[#C9A227] text-[#171A17] rounded-full px-1.5 py-0.5 text-[10px] font-bold">0</span>
           </div>
        </div>

        {/* Search Bar & Trust Badges */}
        <div className="w-full md:flex-1 md:px-6 order-last md:order-none flex flex-col justify-center">
          <div className="flex items-center justify-center gap-3 text-[10px] md:text-xs text-[#C9A227] font-semibold tracking-widest mb-1.5 opacity-90 uppercase">
            <span>Secured</span><span className="text-[8px]">•</span><span>Trusted</span><span className="text-[8px]">•</span><span>Reliable</span>
          </div>

          <div className="flex items-center bg-[#FFFFFF] rounded-md overflow-hidden h-10 border-2 border-transparent focus-within:border-[#C9A227] shadow-sm">
            <input type="text" placeholder="Search for items, brands, or categories..." className="flex-grow h-full px-4 text-[#171A17] outline-none" />
            <button className="bg-[#dbae18] hover:bg-[#A98318] h-full px-6 flex items-center justify-center font-bold text-[#171A17]">Search</button>
          </div>
        </div>

        {/* Account Dropdown & Actions */}
        <div className="hidden md:flex items-center space-x-6 text-sm">
          <div 
            className="relative cursor-pointer py-1"
            onMouseEnter={() => setIsAccountDropdownOpen(true)}
            onMouseLeave={() => setIsAccountDropdownOpen(false)}
          >
            <div className="hover:text-[#C9A227] transition-all">
              <span className="block text-xs text-[#DDD9CD]">Hello, {user.name?.split(' ')[0] || 'Guest'}</span>
              <span className="font-bold flex items-center gap-1">
                My Account 
                <svg className={`w-3 h-3 transition-transform duration-200 ${isAccountDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>

            {/* Account Dropdown */}
            {isAccountDropdownOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-white text-[#171A17] rounded-lg shadow-xl py-2 border border-[#DDD9CD] z-50">
                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="font-bold text-sm truncate">{user.name}</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <button onClick={() => navigate('/profile')} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-[#F8F6EF]">My Profile</button>
                  <button onClick={() => navigate('/orders')} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-[#F8F6EF]">Orders</button>
                  <button onClick={() => navigate('/coupons')} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-[#F8F6EF]">Coupons & Loyalty Token</button>
                  <button onClick={() => navigate('/seller/become')} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-[#F8F6EF]">Become Seller</button>
                  <button onClick={() => navigate('/bidding/list')} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-[#F8F6EF]">List Bidding</button>
                  <button onClick={() => navigate('/wishlist')} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-[#F8F6EF]">Wishlist</button>
                </div>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 text-red-600 hover:bg-red-50 font-semibold">Logout</button>
                </div>
              </div>
            )}
          </div>

          <div className="cursor-pointer hover:text-[#C9A227] transition-all flex items-center relative">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute -top-1 -right-2 bg-[#C9A227] text-[#171A17] rounded-full px-1.5 py-0.5 text-xs font-bold">0</span>
          </div>
          <button onClick={handleLogout} className="text-[#DDD9CD] hover:text-[#FFFFFF] text-xs font-bold ml-2">Logout</button>
        </div>
      </div>
    </header>
  );
};

export default Header;