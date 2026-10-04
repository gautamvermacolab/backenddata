const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  streetNumber: { type: String, required: true },
  landmark: { type: String, default: "" },
  area: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  isVerified: { type: Boolean, default: true },
  location: { type: String, default: "" },
  addresses: [addressSchema],
  // Add loyaltyTokens field to userSchema
  loyaltyTokens: { type: Number, default: 0 },
  appliedCoupon: { type: String, default: null }, // Current active coupon before payment
  usedCoupons: [{ type: String }] // Coupons successfully consumed after payment
}, { timestamps: true });



module.exports = mongoose.model('User', userSchema);