import React from 'react';
import { useNavigate } from 'react-router-dom';
import mainlogo from "../../assets/mainlogo.png";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#004D36] text-[#DDD9CD] border-t border-[#006039] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <img src={mainlogo} alt="heysharlo logo" className="h-10 object-contain mb-4 filter brightness-0 invert" />
          <p className="text-xs text-[#DDD9CD] opacity-80">
            Secured, Trusted, and Reliable marketplace platform for all your needs. Experience seamless buying and selling with heysharlo.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => navigate('/')} className="hover:text-[#C9A227] transition-colors">Home</button></li>
            <li><button onClick={() => navigate('/profile')} className="hover:text-[#C9A227] transition-colors">My Account</button></li>
            <li><button onClick={() => navigate('/orders')} className="hover:text-[#C9A227] transition-colors">My Orders</button></li>
            <li><button onClick={() => navigate('/seller/become')} className="hover:text-[#C9A227] transition-colors">Become a Seller</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Policies & Info</h4>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => navigate('/about')} className="hover:text-[#C9A227] transition-colors">About Us</button></li>
            <li><button onClick={() => navigate('/contact')} className="hover:text-[#C9A227] transition-colors">Contact Us</button></li>
            <li><button onClick={() => navigate('/terms')} className="hover:text-[#C9A227] transition-colors">Terms & Conditions</button></li>
            <li><button onClick={() => navigate('/privacy')} className="hover:text-[#C9A227] transition-colors">Privacy Policy</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Secured Payments</h4>
          <p className="text-xs text-[#DDD9CD] opacity-80 mb-2">100% Secure Checkout & Buyer Protection Guarantee.</p>
          <div className="flex gap-2 text-xs font-bold text-[#C9A227]">
            <span>[ SSL SECURED ]</span>
            <span>[ ENCRYPTED ]</span>
          </div>
        </div>
      </div>
      <div className="bg-[#003826] py-4 text-center text-xs text-[#DDD9CD] opacity-70">
        © {new Date().getFullYear()} heysharlo. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;