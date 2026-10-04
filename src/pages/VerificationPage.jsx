import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { API_BASE } from '../services/api';

const VerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ðŸŒŸ Agar user pehle se logged in hai, toh verify page access na karne de, seedha /home par bhejein
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  const storedData = JSON.parse(localStorage.getItem('pendingRegistration')) || {};

  const [email, setEmail] = useState(location.state?.email || storedData.email || '');
  const [emailOtp, setEmailOtp] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [editEmailMode, setEditEmailMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const fullname = location.state?.fullname || storedData.fullname;
  const password = location.state?.password || storedData.password;
  const phone = location.state?.phone || storedData.phone;

  if (!email || !fullname) {
    return <Navigate to="/register" replace />;
  }

  const requestOTP = async (currentEmail) => {
    try {
      await fetch(`${API_BASE}/api/send-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentEmail, fullname })
      });
      alert("New OTP sent to your email!");
    } catch (error) {
      console.error("Failed to send OTP", error);
    }
  };

  const handleEditSave = () => {
    setEditEmailMode(false);
    requestOTP(email);
  };

  const handleVerifyEmail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: emailOtp })
      });
      const data = await res.json();
      if (data.success) {
        setIsEmailVerified(true);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalRegistration = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/register-final`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, fullname, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        
        localStorage.removeItem('pendingRegistration');
        
        alert("Registration Successful! Welcome to Heysharlo");
        
        navigate('/home', { replace: true }); 
      } else {
        alert(data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6EF] flex items-center justify-center p-4 font-sans overflow-hidden">
      <div className="bg-[#FFFFFF] w-full max-w-sm sm:max-w-md rounded-[2.5rem] shadow-xl relative overflow-hidden pb-10">
        
        <div className="absolute top-[-30px] right-[-30px] w-48 h-48 bg-gradient-to-br from-[#006039] to-[#004D36] opacity-90 transition-transform hover:scale-105 duration-700 pointer-events-none" style={{ borderRadius: '35% 65% 55% 45% / 40% 45% 55% 60%' }}></div>
        
        <div className="px-8 pt-12 relative z-10">
          <button type="button" className="text-[#6B716B] hover:text-[#171A17] transition mb-6" onClick={() => navigate(-1)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>

          <h1 className="text-3xl font-extrabold text-[#171A17] mb-2">Verify Email</h1>
          <p className="text-[#6B716B] text-sm mb-1">We've sent a 6-digit code to your email.</p>
          <p className="text-xs text-[#C9A227] font-semibold mb-6">
            âš ï¸ If you did not receive the email in your inbox, please make sure to check your <b>Spam / Junk</b> folder!
          </p>

          <div className="space-y-6">
            
            <div className={`bg-[#F8F6EF]/50 p-4 rounded-2xl border ${isEmailVerified ? 'border-green-500' : 'border-[#DDD9CD]'}`}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-[#006039] uppercase tracking-wider">Email Address</span>
                {!isEmailVerified && (
                  <button onClick={() => editEmailMode ? handleEditSave() : setEditEmailMode(true)} className="text-xs text-[#C9A227] font-bold">
                    {editEmailMode ? 'Save & Resend' : 'Edit'}
                  </button>
                )}
              </div>
              
              {editEmailMode ? (
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white border border-[#DDD9CD] rounded-xl px-4 py-2 mb-2 text-[#171A17] outline-none" />
              ) : (
                <p className="text-sm text-[#6B716B] font-medium mb-3">{email}</p>
              )}

              {!isEmailVerified ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="text" 
                    maxLength="6" 
                    value={emailOtp} 
                    onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))} 
                    placeholder="6-digit code" 
                    className="w-full sm:flex-1 bg-white border border-[#DDD9CD] rounded-xl px-4 py-3 sm:py-2 text-center font-bold tracking-widest text-[#171A17] outline-none" 
                  />
                  <button 
                    onClick={handleVerifyEmail} 
                    disabled={loading} 
                    className="w-full sm:w-auto bg-[#006039] text-white px-6 py-3 sm:py-2 rounded-xl text-sm font-bold disabled:opacity-70 transition-transform active:scale-95"
                  >
                    Verify
                  </button>
                </div>
              ) : (
                <p className="text-sm font-bold text-green-600">âœ… Email Verified Successfully</p>
              )}
            </div>

            {isEmailVerified && (
              <div className="pt-4">
                <button 
                  onClick={handleFinalRegistration}
                  disabled={loading}
                  className="w-full py-4 rounded-xl flex items-center justify-center font-bold transition-all duration-300 bg-gradient-to-r from-[#006039] to-[#004D36] text-white shadow-lg shadow-[#006039]/40 hover:scale-[1.02]"
                >
                  {loading ? 'SAVING ACCOUNT...' : 'COMPLETE REGISTRATION'}
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;