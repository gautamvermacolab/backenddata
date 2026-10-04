import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import BottomNav from '../../components/layout/BottomNav';
import { API_BASE } from '../../services/api';

const LoyaltyTokensPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Guest', email: '', phone: '' });
  const [loyaltyData, setLoyaltyData] = useState({ loyaltyTokens: 0, rupeeValue: '0.00' });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tokens');
  const [expandedTc, setExpandedTc] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchLoyaltyData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token || !userId) { navigate('/register'); return; }

        const res = await fetch(`${API_BASE}/api/users/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          const userData = data.user || data;
          setUser({ name: userData.fullname, email: userData.email, phone: userData.phone });
        }

        const tokenRes = await fetch(`${API_BASE}/api/users/${userId}/loyalty-tokens`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const tokenData = await tokenRes.json();
        if (tokenRes.ok) {
          setLoyaltyData({
            loyaltyTokens: tokenData.loyaltyTokens,
            rupeeValue: tokenData.rupeeValue
          });
        }
      } catch (err) {
        console.error("Error fetching loyalty tokens:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLoyaltyData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/register');
  };

  const accountMenu = [
    { id: 'profile', label: 'My Details', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'addresses', label: 'Saved Address Book', path: '/addresses', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
    { id: 'orders', label: 'My Orders', path: '/orders', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { id: 'coupons', label: 'Coupons', path: '/coupons', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
    { id: 'seller', label: 'Become Seller', path: '/seller/become', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'tokens', label: 'Loyalty Token', path: '/loyalty-tokens', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'bidding', label: 'List Bidding', path: '/bidding/list', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'wishlist', label: 'Wishlist', path: '/wishlist', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { id: 'settings', label: 'Account Settings', path: '/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
  ];

  const rewardSlabs = [
  { range: '1,000 - 50,000', tokens: '10 Tokens / 1,000', valueRate: '10 Tokens = 1', benefit: 'Standard Tier Rewards & Free Delivery Eligibility' },

  { range: '50,001 - 5,00,000', tokens: '12 Tokens / 1,000', valueRate: '10 Tokens = 1', benefit: 'Silver Tier + Priority Bidding Entries' },

  { range: '5,00,001 - 25,00,000', tokens: '15 Tokens / 1,000', valueRate: '10 Tokens = 1', benefit: 'Gold Tier + Exclusive Cashback Offers' },

  { range: '25,00,001 - 1,00,00,000+', tokens: '20 Tokens / 1,000', valueRate: '10 Tokens = 1', benefit: 'Platinum Tier + VIP Concierge & Mega Bidding Access' }
];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F6EF] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#006039] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-[#006039] font-bold text-sm">Loading Loyalty Wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6EF] font-sans flex flex-col">
      <Header user={user} handleLogout={handleLogout} />
      <Navbar />

      <div className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        <div className="text-xs text-gray-500 mb-6 flex items-center gap-2">
          <span className="cursor-pointer hover:text-[#006039]" onClick={() => navigate('/')}>Homepage</span>
          <span>/</span>
          <span className="text-[#006039] font-bold">My Account</span>
        </div>

        <div className="flex justify-between items-center mb-6 relative">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171A17]">My Account</h1>
          
          {/* Mobile Hamburger Toggle Button */}
          <div className="relative md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center gap-2 bg-[#006039] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Menu
            </button>

            {/* Absolute Dropdown Menu for Mobile so it floats above without pushing content down */}
            {isMobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white p-3 rounded-xl shadow-xl border border-[#DDD9CD] z-50 max-h-80 overflow-y-auto space-y-1">
                {accountMenu.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { 
                      setActiveTab(item.id); 
                      setIsMobileMenuOpen(false);
                      navigate(item.path); 
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === item.id ? 'bg-[#006039] text-white shadow-md' : 'text-[#171A17] hover:bg-[#F8F6EF]'
                    }`}
                  >
                    <svg className={`w-4 h-4 ${activeTab === item.id ? 'text-[#C9A227]' : 'text-[#006039]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Desktop Sidebar (Hidden on Mobile) */}
          <div className="hidden md:block md:col-span-1 bg-white p-4 rounded-xl shadow-sm border border-[#DDD9CD] h-fit">
            <div className="space-y-1">
              {accountMenu.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { 
                    setActiveTab(item.id); 
                    navigate(item.path); 
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === item.id ? 'bg-[#006039] text-white shadow-md' : 'text-[#171A17] hover:bg-[#F8F6EF]'
                  }`}
                >
                  <svg className={`w-5 h-5 ${activeTab === item.id ? 'text-[#C9A227]' : 'text-[#006039]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Loyalty Content Area */}
          <div className="md:col-span-3 bg-white p-4 sm:p-8 rounded-xl shadow-sm border border-[#DDD9CD]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-100 mb-6 gap-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#171A17]">Loyalty Tokens Wallet</h2>
              <div className="w-full sm:w-auto bg-[#006039]/10 border border-[#006039]/30 px-4 sm:px-5 py-3 rounded-xl flex items-center justify-between sm:justify-start gap-4">
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Available Tokens</p>
                  <p className="text-lg sm:text-xl font-extrabold text-[#006039]">{loyaltyData.loyaltyTokens} Tokens</p>
                </div>
                <div className="border-l border-[#006039]/30 pl-4">
                  <p className="text-xs text-gray-600 font-semibold">Equivalent Value</p>
                  <p className="text-base sm:text-lg font-bold text-[#C9A227]">â‚¹{loyaltyData.rupeeValue}</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Earn tokens on every purchase! Every 1,000 spent earns you 10 tokens (proportional calculated for any amount like 700 = 7 tokens). Conversion rate: <strong>10 Tokens = 1</strong>.
            </p>

            {/* Slabs & Benefits Table */}
            <div className="mb-8 overflow-x-auto">
              <h3 className="text-sm font-bold text-[#171A17] mb-3">Shopping Slabs & Reward Benefits</h3>
              <div className="min-w-[600px] sm:min-w-full">
                <table className="w-full text-left border-collapse border border-[#DDD9CD]">
                  <thead>
                    <tr className="bg-[#F8F6EF] text-xs text-[#171A17]">
                      <th className="border border-[#DDD9CD] p-3 font-bold">Shopping Range</th>
                      <th className="border border-[#DDD9CD] p-3 font-bold">Token Earnings</th>
                      <th className="border border-[#DDD9CD] p-3 font-bold">Redemption Rate</th>
                      <th className="border border-[#DDD9CD] p-3 font-bold">Additional Benefits</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-gray-700">
                    {rewardSlabs.map((slab, index) => (
                      <tr key={index} className="hover:bg-[#F8F6EF]/40">
                        <td className="border border-[#DDD9CD] p-3 font-semibold">{slab.range}</td>
                        <td className="border border-[#DDD9CD] p-3 text-[#006039] font-bold">{slab.tokens}</td>
                        <td className="border border-[#DDD9CD] p-3">{slab.valueRate}</td>
                        <td className="border border-[#DDD9CD] p-3">{slab.benefit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Terms & Conditions Section */}
            <div className="pt-4 border-t border-gray-100">
              <button 
                onClick={() => setExpandedTc(!expandedTc)}
                className="text-xs text-[#006039] font-semibold hover:underline flex items-center gap-1"
              >
                {expandedTc ? 'Hide Terms & Conditions' : 'View Terms & Conditions'}
              </button>

              {expandedTc && (
                <div className="mt-3 p-4 bg-[#F8F6EF] rounded-lg text-xs text-gray-600 border border-[#DDD9CD] space-y-2">
                  <p><strong>1. Validity:</strong> Loyalty tokens are valid for 12 months from the date of credit.</p>
                  <p><strong>2. Redemption:</strong> Tokens can be redeemed during checkout or converted into wallet cash/bidding entries.</p>
                  <p><strong>3. Non-Transferable:</strong> Tokens cannot be transferred to other user accounts or exchanged directly for cash.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default LoyaltyTokensPage;