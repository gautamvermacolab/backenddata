import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import BottomNav from '../components/layout/BottomNav';
import { API_BASE } from '../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Fetching...', location: 'Ludhiana 141008' });
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/register');
  }, [navigate]);

  useEffect(() => {
    const fetchUserDataAndLocation = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        if (!token || !userId) {
          navigate('/register');
          return;
        }

        let fetchedName = "Guest";

        try {
          const dbResponse = await fetch(`${API_BASE}/api/users/${userId}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
          });
          
          if (dbResponse.ok) {
            const dbData = await dbResponse.json();
            fetchedName = dbData.fullname || "Guest";
          } else if (dbResponse.status === 401) {
            handleLogout();
            return;
          }
        } catch (dbErr) {
          console.error("Backend error", dbErr);
        }

        setUser(prev => ({ ...prev, name: fetchedName }));
        setIsLoading(false);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const { latitude, longitude } = position.coords;
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                if (!res.ok) throw new Error("API Limit");
                const data = await res.json();
                
                const city = data.address.city || data.address.town || data.address.state || "Ludhiana";
                const formattedLocation = `${city}`.trim();

                setUser(prev => ({ ...prev, location: formattedLocation }));

                await fetch(`${API_BASE}/api/users/${userId}/location`, {
                  method: 'PUT',
                  headers: { 
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json' 
                  },
                  body: JSON.stringify({ location: formattedLocation })
                });
              } catch (err) {
                console.log("Background location fetch failed, using default.");
              }
            },
            (error) => {
              console.log("Geolocation permission denied or timed out.");
            },
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
          );
        }

      } catch (error) {
        console.error("Data loading error:", error);
        setUser({ name: "Error", location: "Ludhiana 141008" });
        setIsLoading(false);
      }
    };

    fetchUserDataAndLocation();
  }, [navigate, handleLogout]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F6EF] flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-[#006039] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <h2 className="text-xl font-extrabold text-[#171A17] tracking-wide">Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6EF] font-sans flex flex-col pb-16 md:pb-0 animate-fadeIn">
      <Header user={user} handleLogout={handleLogout} />
      <Navbar />

      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center mt-20 text-center">
            <h1 className="text-[#006039] text-3xl font-extrabold">Welcome, {user.name}!</h1>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default HomePage;