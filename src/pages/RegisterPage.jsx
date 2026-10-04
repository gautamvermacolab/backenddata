import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE } from '../services/api';

const AnimatedBoxInput = ({ id, label, type, iconSvg, value, onChange, error }) => (
  <div className="w-full">
    <div className={`relative group transition-all duration-300 ease-out p-3 pt-5 rounded-xl border ${error ? 'border-red-400 bg-red-50/50' : 'border-transparent border-b-[#DDD9CD] bg-transparent'} 
                    focus-within:bg-white focus-within:border-[#006039] focus-within:shadow-[0_10px_25px_-5px_rgba(0,96,57,0.15)] focus-within:scale-[1.03] focus-within:z-10`}>
      <div className="flex items-center">
        <div className={`transition-colors duration-300 mr-3 ${error ? 'text-red-400' : 'text-[#6B716B] group-focus-within:text-[#C9A227]'}`}>
          {iconSvg}
        </div>
        <div className="relative w-full">
          <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            className="peer w-full bg-transparent outline-none text-[#171A17] font-medium placeholder-transparent"
            placeholder={label} 
          />
          <label
            htmlFor={id}
            className={`absolute left-0 -top-5 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-text
                       peer-placeholder-shown:top-0 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal
                       peer-focus:-top-5 peer-focus:text-[10px] sm:peer-focus:text-xs peer-focus:font-bold
                       ${error ? 'text-red-500 peer-placeholder-shown:text-red-400 peer-focus:text-red-500' : 'text-[#006039] peer-placeholder-shown:text-[#6B716B] peer-focus:text-[#006039]'}`}
          >
            {label}
          </label>
        </div>
      </div>
    </div>
    {error && <p className="text-[10px] text-red-500 ml-3 mt-1 leading-tight">{error}</p>}
  </div>
);

const RegisterPage = () => {
  const navigate = useNavigate();

  // ðŸŒŸ Agar user pehle se logged in hai, toh register page mat dikhao, seedha /home par bhejo
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.fullname.trim()) newErrors.fullname = "Name is required";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = "Please enter a valid email address";

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) newErrors.phone = "Phone number must be exactly 10 digits";

    // Unnecessary escape character '\%' has been fixed to '%' here:
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Must contain 8+ chars, 1 uppercase, 1 lowercase, 1 number, and 1 special char";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setIsSubmitting(true);
      const finalName = formData.fullname.toLowerCase();

      try {
        const response = await fetch(`${API_BASE}/api/send-verification`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: formData.email, 
            phone: formData.phone, 
            fullname: finalName 
          })
        });

        const data = await response.json();

        if (response.ok) {
          const regData = { 
            email: formData.email, 
            phone: formData.phone,
            fullname: finalName,
            password: formData.password 
          };
          
          localStorage.setItem('pendingRegistration', JSON.stringify(regData));
          navigate('/verify', { state: regData });
        } else {
          alert(data.message || "Failed to send OTP. Please try again.");
        }
      } catch (error) {
        console.error("Error connecting to server:", error);
        alert("Server error. Check if backend is running on port 5000.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6EF] flex items-center justify-center p-4 font-sans overflow-hidden">
      <div className="bg-[#FFFFFF] w-full max-w-sm sm:max-w-md rounded-[2.5rem] shadow-xl relative overflow-hidden pb-8">
        
        <div 
          className="absolute top-[-30px] right-[-30px] w-56 h-56 bg-gradient-to-br from-[#006039] to-[#004D36] opacity-90 transition-transform hover:scale-105 duration-700 pointer-events-none"
          style={{ borderRadius: '35% 65% 55% 45% / 40% 45% 55% 60%' }}
        ></div>
        <div className="absolute top-16 right-36 text-[#C9A227] text-xl font-bold">+</div>
        <div className="absolute top-32 right-12 text-[#6B716B] text-lg font-bold">+</div>
        <div className="absolute top-24 right-48 w-2 h-2 rounded-full bg-[#006039]"></div>
        <div className="absolute top-10 right-40 w-1.5 h-1.5 rounded-full bg-[#C9A227]"></div>

        <div className="px-8 pt-12 relative z-10">
          <button type="button" className="text-[#6B716B] hover:text-[#171A17] transition mb-6" onClick={() => navigate(-1)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>

          <h1 className="text-3xl font-extrabold text-[#171A17] mb-4">Create Account</h1>

          <form onSubmit={handleSubmit} className="space-y-1.5" noValidate>
            <AnimatedBoxInput id="fullname" label="Full Name" type="text" value={formData.fullname} onChange={handleChange} error={errors.fullname} iconSvg={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>} />
            <AnimatedBoxInput id="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} error={errors.email} iconSvg={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>} />
            <AnimatedBoxInput id="phone" label="Phone Number" type="tel" value={formData.phone} onChange={handleChange} error={errors.phone} iconSvg={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>} />
            <AnimatedBoxInput id="password" label="Password" type="password" value={formData.password} onChange={handleChange} error={errors.password} iconSvg={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>} />
            <AnimatedBoxInput id="confirmPassword" label="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} iconSvg={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>} />

            <div className="flex justify-end pt-5">
              <button disabled={isSubmitting} type="submit" className="bg-gradient-to-r from-[#006039] to-[#004D36] hover:shadow-lg hover:shadow-[#006039]/40 disabled:opacity-70 text-white font-bold py-3 px-8 rounded-full flex items-center transition-all duration-300">
                {isSubmitting ? 'SENDING OTP...' : 'SIGN UP'}
                {!isSubmitting && <svg className="w-5 h-5 ml-2 text-[#C9A227]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-[#6B716B]">
            Already have an account? <Link to="/login" className="text-[#006039] font-bold hover:text-[#C9A227] transition-colors">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;