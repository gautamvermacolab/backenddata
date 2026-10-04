// --- 1. ENVIRONMENT VARIABLES ---
require('dotenv').config();

// --- 2. IMPORTS ---
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// Controllers & Models
const { 
  sendVerification, 
  verifyEmailOTP, 
  registerFinal 
} = require('./controllers/otpController');
const { loginQueueMiddleware } = require('./controllers/authController');
const Product = require('./models/Product');
const User = require('./models/User');

// --- 3. APP & MIDDLEWARE SETUP ---
const app = express();

app.set('trust proxy', 1);

// Security & Parsing Middlewares
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://heysharloindia.netlify.app'

  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// --- 4. RATE LIMITERS ---
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts have been sent! Please try again after 10 minutes." }
});

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many OTP requests have been sent! Please try again after 10 minutes." }
});

const loginLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, 
  max: 5, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    success: false, 
    message: "You have exceeded the maximum number of login attempts. Please try again after 24 hours." 
  }
});

// --- 5. DATABASE CONNECTION ---
console.log("Database link check kar rahe hain: ", process.env.MONGO_URI ? "✅ Link mil gaya!" : "❌ Link NAHI mila!");

if(process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('🟢 MongoDB Database Connected Successfully! 🎉'))
    .catch((err) => console.log('🔴 Database Connection Error: ', err.message));
}

// ==========================================
// 🛡️ JWT MIDDLEWARE (Sirf token check karne ke liye)
// ==========================================
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(401).json({ message: 'Token is invalid or expired!' });
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: 'You are not authenticated!' });
  }
};

// --- 6. ROUTES ---
app.get('/', (req, res) => {
  res.send('Heysharlo Backend API is running successfully! 🚀');
});

// OTP & Verification Routes
app.post('/api/send-verification', otpLimiter, sendVerification);
app.post('/api/verify-email', otpLimiter, verifyEmailOTP);
app.post('/api/register-final', registerFinal);

// Login Route with Rate Limiter & Queue Traffic Control
app.post('/api/login', loginLimiter, loginQueueMiddleware);

// ==========================================
// 7 🆕 FETCH USER FULLNAME FROM DB
// ==========================================
app.get('/api/users/:identifier', verifyToken, async (req, res) => {
  try {
    const identifier = req.params.identifier;
    let user = null;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      user = await User.findById(identifier).select('fullname email phone location');
    }
    if (!user) {
      user = await User.findOne({ userId: identifier }).select('fullname email phone location');
    }

    if (!user) {
      console.log(`❌ User nahi mila ID ke liye: ${identifier}`);
      return res.status(404).json({ message: 'User not found in DB' });
    }

    console.log(`✅ User mil gaya: ${user.fullname}`);
    res.status(200).json({ 
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      location: user.location
    }); 

  } catch (error) {
    console.error("❌ Fetch Error: ", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// ==========================================
// 8 🆕 UPDATE USER PROFILE DETAILS (Fullname & Phone)
// ==========================================
app.put('/api/users/:identifier', verifyToken, async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const { fullname, phone } = req.body;

    let user = null;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      user = await User.findById(identifier);
    }
    if (!user) {
      user = await User.findOne({ userId: identifier });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found in DB' });
    }

    if (fullname) user.fullname = fullname;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    console.log(`✅ Profile updated for: ${user.fullname}`);
    res.status(200).json({ 
      success: true, 
      message: 'Profile updated successfully', 
      user: {
        fullname: user.fullname,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error("❌ Profile Update Error: ", error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// ==========================================
// 9 🆕 SAVE USER LOCATION IN DB
// ==========================================
app.put('/api/users/:identifier/location', verifyToken, async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const { location } = req.body;

    if (!location) {
      return res.status(400).json({ message: 'Location is required' });
    }

    let user = null;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      user = await User.findById(identifier);
    }
    if (!user) {
      user = await User.findOne({ userId: identifier });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found in DB' });
    }

    user.location = location;
    await user.save();

    console.log(`✅ Location saved for ${user.fullname}: ${location}`);
    res.status(200).json({ message: 'Location saved successfully', location: user.location });

  } catch (error) {
    console.error("❌ Location Update Error: ", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// ==========================================
// 10 🆕 GET USER ADDRESSES
// ==========================================
app.get('/api/users/:identifier/addresses', verifyToken, async (req, res) => {
  try {
    const identifier = req.params.identifier;
    let user = mongoose.Types.ObjectId.isValid(identifier) 
      ? await User.findById(identifier).select('addresses')
      : await User.findOne({ userId: identifier }).select('addresses');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// ==========================================
// 11 🆕 ADD NEW ADDRESS TO ADDRESS BOOK
// ==========================================
app.post('/api/users/:identifier/addresses', verifyToken, async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const { streetNumber, landmark, area, city, state, pincode } = req.body;

    if (!streetNumber || !area || !city || !state || !pincode) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    }

    let user = mongoose.Types.ObjectId.isValid(identifier) 
      ? await User.findById(identifier)
      : await User.findOne({ userId: identifier });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const newAddress = { streetNumber, landmark, area, city, state, pincode };
    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({ 
      success: true, 
      message: 'Address added successfully! 🎉', 
      addresses: user.addresses 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// ==========================================
// 12 🆕 DELETE AN ADDRESS
// ==========================================
app.delete('/api/users/:identifier/addresses/:addressId', verifyToken, async (req, res) => {
  try {
    const { identifier, addressId } = req.params;
    let user = mongoose.Types.ObjectId.isValid(identifier) 
      ? await User.findById(identifier)
      : await User.findOne({ userId: identifier });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.addresses.id(addressId).remove();
    await user.save();

    res.status(200).json({ success: true, message: 'Address removed successfully', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});







// ==========================================
// 🎟️13 COUPONS DATA & ENDPOINTS
// ==========================================
const AVAILABLE_COUPONS = [
  {
    code: 'FREEDEL499',
    title: 'Free Delivery on Shopping above ₹499',
    description: 'Get free shipping across all orders above ₹499.',
    minOrderValue: 499,
    discountType: 'free_delivery',
    validTill: '31 Oct, 2026',
    terms: 'Valid on total cart value above ₹499. Cannot be combined with other offers.'
  },
  {
    code: 'FREEBID999',
    title: '1 Free Bidding on Shopping above ₹999',
    description: 'Unlock 1 free bidding entry when your order crosses ₹999.',
    minOrderValue: 999,
    discountType: 'free_bidding',
    validTill: '31 Oct, 2026',
    terms: 'Applicable once per user on successful prepaid or COD orders above ₹999.'
  }
];

// Get Available Coupons for User
app.get('/api/users/:identifier/coupons', verifyToken, async (req, res) => {
  try {
    const identifier = req.params.identifier;
    let user = mongoose.Types.ObjectId.isValid(identifier) 
      ? await User.findById(identifier).select('usedCoupons appliedCoupon')
      : await User.findOne({ userId: identifier }).select('usedCoupons appliedCoupon');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ 
      success: true, 
      coupons: AVAILABLE_COUPONS,
      usedCoupons: user.usedCoupons || [],
      appliedCoupon: user.appliedCoupon || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// Apply or Remove Coupon (Before Payment)
app.post('/api/users/:identifier/coupon/action', verifyToken, async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const { code, action, cartTotal } = req.body; // action: 'apply' or 'remove'

    let user = mongoose.Types.ObjectId.isValid(identifier) 
      ? await User.findById(identifier)
      : await User.findOne({ userId: identifier });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (action === 'remove') {
      user.appliedCoupon = null;
      await user.save();
      return res.status(200).json({ success: true, message: 'Coupon removed successfully' });
    }

    if (action === 'apply') {
      if (user.usedCoupons && user.usedCoupons.includes(code)) {
        return res.status(400).json({ success: false, message: 'You have already used this coupon in a previous purchase!' });
      }

      const coupon = AVAILABLE_COUPONS.find(c => c.code === code);
      if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code.' });

      if (cartTotal < coupon.minOrderValue) {
        return res.status(400).json({ 
          success: false, 
          message: `Minimum order value of ₹${coupon.minOrderValue} required to apply this coupon.` 
        });
      }

      user.appliedCoupon = code;
      await user.save();
      return res.status(200).json({ success: true, message: 'Coupon applied successfully! 🎉', appliedCoupon: code });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// Finalize Order & Consume Coupon (Call this after successful payment)
app.post('/api/users/:identifier/order-success', verifyToken, async (req, res) => {
  try {
    const identifier = req.params.identifier;
    let user = mongoose.Types.ObjectId.isValid(identifier) 
      ? await User.findById(identifier)
      : await User.findOne({ userId: identifier });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.appliedCoupon) {
      if (!user.usedCoupons.includes(user.appliedCoupon)) {
        user.usedCoupons.push(user.appliedCoupon);
      }
      user.appliedCoupon = null; // Reset current applied session coupon
      await user.save();
    }

    res.status(200).json({ success: true, message: 'Order processed & coupon consumed permanently.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});



// ==========================================
// 14 🪙 LOYALTY TOKENS ENDPOINTS
// ==========================================

// Get User Loyalty Tokens & Balance
app.get('/api/users/:identifier/loyalty-tokens', verifyToken, async (req, res) => {
  try {
    const identifier = req.params.identifier;
    let user = mongoose.Types.ObjectId.isValid(identifier) 
      ? await User.findById(identifier).select('loyaltyTokens')
      : await User.findOne({ userId: identifier }).select('loyaltyTokens');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const tokens = user.loyaltyTokens || 0;
    const rupeeValue = tokens / 10; // 10 tokens = 1 Rupee

    res.status(200).json({ 
      success: true, 
      loyaltyTokens: tokens,
      rupeeValue: rupeeValue.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// Add Tokens on Successful Purchase (Call this on order success)
app.post('/api/users/:identifier/add-tokens', verifyToken, async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const { purchaseAmount } = req.body; // e.g., 700 or 5000

    let user = mongoose.Types.ObjectId.isValid(identifier) 
      ? await User.findById(identifier)
      : await User.findOne({ userId: identifier });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Calculation: ₹1000 purchase = 10 tokens (i.e. purchaseAmount / 100)
    const earnedTokens = Number((purchaseAmount / 100).toFixed(2));
    user.loyaltyTokens = (user.loyaltyTokens || 0) + earnedTokens;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: `Successfully earned ${earnedTokens} Loyalty Tokens! 🎉`, 
      loyaltyTokens: user.loyaltyTokens 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});


// ==========================================
// 🗑️ 15 PERMANENTLY DELETE / DEACTIVATE ACCOUNT
// ==========================================
app.delete('/api/users/:identifier', verifyToken, async (req, res) => {
  try {
    const identifier = req.params.identifier;
    let deletedUser = null;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      deletedUser = await User.findByIdAndDelete(identifier);
    }
    if (!deletedUser) {
      deletedUser = await User.findOneAndDelete({ userId: identifier });
    }

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found in DB' });
    }

    console.log(`❌ Account permanently deleted for: ${deletedUser.fullname}`);
    res.status(200).json({ 
      success: true, 
      message: 'Account successfully deactivated and removed from database.' 
    });

  } catch (error) {
    console.error("❌ Delete Account Error: ", error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// --- 16. START SERVER ---
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});