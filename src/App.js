import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import RegisterPage from './pages/RegisterPage';
import VerificationPage from './pages/VerificationPage';
import LoginPage from './pages/LoginPage';

// Main Protected Pages
import HomePage from './pages/homepage';

// Account Sub-pages
import ProfilePage from './pages/account/ProfilePage';
import OrdersPage from './pages/account/OrdersPage';
import CouponsPage from './pages/account/CouponsPage';
import SettingsPage from './pages/account/SettingsPage';
import SavedAddressesPage from './pages/account/SavedAddressesPage';
import WishlistPage from './pages/account/WishlistPage';
import GiftCardsPage from './pages/account/GiftCardsPage';
import NotificationsPage from './pages/account/NotificationsPage';

// Business / Seller Hub Pages
import BecomeSellerPage from './pages/business/BecomeSellerPage';
import LoyaltyTokensPage from './pages/business/LoyaltyTokensPage';
import ListBiddingPage from './pages/business/ListBiddingPage';

// Info & Policy Pages
import AboutUsPage from './pages/info/AboutUsPage';
import ContactUsPage from './pages/info/ContactUsPage';
import TermsAndConditionsPage from './pages/info/TermsAndConditionsPage';
import PrivacyPolicyPage from './pages/info/PrivacyPolicyPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/register" replace />} />

          {/* Public Routes */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify" element={<VerificationPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Main Home Route */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />

          {/* Protected Account Routes */}
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/coupons" element={<ProtectedRoute><CouponsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/addresses" element={<ProtectedRoute><SavedAddressesPage /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
          <Route path="/gift-cards" element={<ProtectedRoute><GiftCardsPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

          {/* Protected Business & Seller Routes */}
          <Route path="/seller/become" element={<ProtectedRoute><BecomeSellerPage /></ProtectedRoute>} />
          <Route path="/loyalty-tokens" element={<ProtectedRoute><LoyaltyTokensPage /></ProtectedRoute>} />
          <Route path="/bidding/list" element={<ProtectedRoute><ListBiddingPage /></ProtectedRoute>} />

          {/* Public Info & Policy Pages (Footer Links) */}
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/terms" element={<TermsAndConditionsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />

          {/* Catch-all route for unknown URLs */}
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;