import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE } from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [queueMessage, setQueueMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setQueueMessage('');
    setErrorMessage('');

    try {
      const executeLogin = async () => {
        const res = await fetch(`${API_BASE}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (res.status === 229 || data.queued) {
          setQueueMessage(data.message || "Server busy hai, queue mein hain...");
          setTimeout(executeLogin, 3000);
          return;
        }

        if (data.success) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.userId);
          navigate('/home', { replace: true });
        } else {
          setErrorMessage(data.message || "Login failed. Please check your credentials.");
          setLoading(false);
        }
      };

      await executeLogin();
    } catch (err) {
      console.error(err);
      setErrorMessage("Server error or connection failed. Backend server check karein.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6EF] flex items-center justify-center p-4 font-sans overflow-hidden">
      <div className="bg-[#FFFFFF] w-full max-w-sm sm:max-w-md rounded-[2.5rem] shadow-xl relative overflow-hidden pb-10">
        
        <div className="absolute top-[-30px] right-[-30px] w-48 h-48 bg-gradient-to-br from-[#006039] to-[#004D36] opacity-90 transition-transform hover:scale-105 duration-700 pointer-events-none" style={{ borderRadius: '35% 65% 55% 45% / 40% 45% 55% 60%' }}></div>
        
        <div className="px-8 pt-12 relative z-10">
          <h1 className="text-3xl font-extrabold text-[#171A17] mb-2">Welcome Back</h1>
          <p className="text-[#6B716B] text-sm mb-6">Sign in to your Heysharlo account.</p>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold text-center">
              ⚠️ {errorMessage}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#006039] uppercase tracking-wider mb-1">Email Address</label>
              <input 
                type="email" 
                name="email" 
                required
                value={formData.email} 
                onChange={handleChange} 
                placeholder="name@example.com" 
                className="w-full bg-[#F8F6EF]/50 border border-[#DDD9CD] rounded-xl px-4 py-3 text-[#171A17] outline-none focus:border-[#006039] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#006039] uppercase tracking-wider mb-1">Password</label>
              <input 
                type="password" 
                name="password" 
                required
                value={formData.password} 
                onChange={handleChange} 
                placeholder="Password" 
                className="w-full bg-[#F8F6EF]/50 border border-[#DDD9CD] rounded-xl px-4 py-3 text-[#171A17] outline-none focus:border-[#006039] transition"
              />
            </div>

            {queueMessage && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-xs text-yellow-800 font-medium text-center animate-pulse">
                ⏳ {queueMessage}
              </div>
            )}

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 rounded-xl flex items-center justify-center font-bold transition-all duration-300 bg-gradient-to-r from-[#006039] to-[#004D36] text-white shadow-lg shadow-[#006039]/40 hover:scale-[1.02] disabled:opacity-70"
              >
                {loading ? 'SIGNING IN...' : 'LOGIN'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-[#6B716B]">
            Don't have an account? <Link to="/register" className="text-[#006039] font-bold hover:text-[#C9A227] transition-colors">Sign up</Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;