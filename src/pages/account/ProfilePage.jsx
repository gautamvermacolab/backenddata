import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import BottomNav from '../../components/layout/BottomNav';
import { API_BASE } from '../../services/api';

const ProfilePage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: 'Guest',
    location: 'Ludhiana 141008',
    email: '',
    phone: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile Menu Toggle State

  // Fetch User Data on Load
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
          navigate('/register');
          return;
        }

        const dbResponse = await fetch(`${API_BASE}/api/users/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (dbResponse.ok) {
          const dbData = await dbResponse.json();
          const userData = dbData.user || dbData;
          
          setUser({
            name: userData.fullname || "Guest",
            email: userData.email || "",
            phone: userData.phone || "",
            location: userData.location || "Ludhiana 141008"
          });
        } else if (dbResponse.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          navigate('/register');
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle Real-Time Profile Update
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      const response = await fetch(`${API_BASE}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullname: user.name,
          phone: user.phone
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: 'Profile updated successfully! ðŸŽ‰', type: 'success' });
        if (data.user?.fullname) {
          setUser(prev => ({ ...prev, name: data.user.fullname }));
        }
      } else {
        setMessage({ text: data.message || 'Failed to update profile.', type: 'error' });
      }
    } catch (error) {
      console.error('Update error:', error);
      setMessage({ text: 'Server connection error.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F6EF] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#006039] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-[#006039] font-bold text-sm">Loading your profile...</p>
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

          {/* Mobile Hamburger Menu Toggle Button */}
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

            {/* Absolute Dropdown Menu for Mobile */}
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
          {/* Desktop Sidebar Menu */}
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
                    activeTab === item.id 
                      ? 'bg-[#006039] text-white shadow-md' 
                      : 'text-[#171A17] hover:bg-[#F8F6EF]'
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

          {/* Main Details Form */}
          <div className="md:col-span-3 bg-white p-4 sm:p-8 rounded-xl shadow-sm border border-[#DDD9CD]">
            <h2 className="text-xl font-bold text-[#171A17] pb-4 border-b border-gray-100 mb-6">
              My details
            </h2>

            {message.text && (
              <div className={`p-3 mb-6 rounded-lg text-xs font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSaveChanges} className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-[#171A17] mb-1">Personal Information</h3>
                <p className="text-xs text-gray-500 mb-6">Manage your personal identification details and contact numbers securely.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[#171A17] uppercase tracking-wider mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={user.name} 
                      onChange={(e) => setUser({...user, name: e.target.value})}
                      className="w-full bg-[#F8F6EF] border border-[#DDD9CD] rounded-lg px-4 py-3 text-sm text-[#171A17] outline-none focus:border-[#006039]" 
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171A17] uppercase tracking-wider mb-2">Phone Number</label>
                    <input 
                      type="text" 
                      value={user.phone} 
                      onChange={(e) => setUser({...user, phone: e.target.value})}
                      placeholder="Enter phone number"
                      className="w-full bg-[#F8F6EF] border border-[#DDD9CD] rounded-lg px-4 py-3 text-sm text-[#171A17] outline-none focus:border-[#006039]" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="mt-6 bg-[#006039] hover:bg-[#004D36] text-white font-bold px-8 py-3 rounded-lg text-sm transition-all shadow-md disabled:opacity-50"
                >
                  {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <h3 className="text-sm font-bold text-[#171A17] mb-1">E-mail Address</h3>
                <p className="text-xs text-gray-500 mb-4">Your primary email address used for login and notifications.</p>

                <div className="max-w-md">
                  <label className="block text-xs font-bold text-[#171A17] uppercase tracking-wider mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={user.email} 
                    disabled 
                    className="w-full bg-gray-100 border border-[#DDD9CD] rounded-lg px-4 py-3 text-sm text-gray-600 cursor-not-allowed" 
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default ProfilePage;