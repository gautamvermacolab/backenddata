import React, { useState } from 'react';


function Auth() {
  const [isLogin, setIsLogin] = useState(true); // Toggle karne ke liye ki Login hai ya Signup
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Endpoint decide karna ki Signup hai ya Login
    const endpoint = isLogin ? '/api/login' : '/api/signup';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("ðŸŽ‰ " + (data.message || "Login successful!"));
        if (isLogin) {
          localStorage.setItem('token', data.token); // Token save kar liya
          console.log("JWT Token saved successfully!");
          console.log("Logged in user ID:", data.userId);
        }
      } else {
        // Yahan backend ka error message (jaise rate limit wala 429 error) screen par dikhega
        setMessage("âŒ " + (data.error || data.message || "Kuch galat ho gaya!"));
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("âŒ Server se connection nahi ho paya!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
          {isLogin ? 'Heysharlo Login' : 'Heysharlo Signup'}
        </h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Poora Naam</label>
              <input 
                type="text" 
                placeholder="Apna naam daalein" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                required={!isLogin}
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input 
              type="password" 
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" 
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-pink-600 text-white p-3 rounded-lg font-semibold hover:bg-pink-700 transition duration-200"
          >
            {isLogin ? 'Login Karein' : 'Account Banayein'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center font-medium text-sm text-gray-700 bg-gray-100 p-2 rounded">
            {message}
          </p>
        )}

        <div className="mt-6 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setMessage(''); }}
            className="text-pink-600 text-sm font-medium hover:underline focus:outline-none"
          >
            {isLogin ? "Account nahi hai? Signup karein" : "Pehle se account hai? Login karein"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;