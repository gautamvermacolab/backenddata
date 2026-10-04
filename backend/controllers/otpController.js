const User = require('../models/User');
const Otp = require('../models/Otp');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// 12-digit unique ID generator helper function
const generateUniqueUserId = async () => {
  let isUnique = false;
  let customId = '';
  
  while (!isUnique) {
    customId = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const existingUser = await User.findOne({ userId: customId });
    if (!existingUser) {
      isUnique = true;
    }
  }
  return customId;
};

exports.sendVerification = async (req, res) => {
  const { email, fullname } = req.body;

  try {
    const emailOtp = generateOTP();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Heysharlo - Account Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #F8F6EF; border-radius: 10px;">
          <h2 style="color: #006039;">Welcome to Heysharlo, ${fullname}!</h2>
          <p>Your Email Verification code is:</p>
          <h1 style="color: #C9A227; letter-spacing: 5px;">${emailOtp}</h1>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    await Otp.deleteMany({ email });
    await Otp.create({ email, otp: emailOtp });

    res.status(200).json({ success: true, message: "Email OTP sent successfully!" });

  } catch (error) {
    console.error("Email Sending Error:", error);
    res.status(500).json({ success: false, message: "Error: " + error.message });
  }
};

exports.verifyEmailOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ success: false, message: "Invalid or expired Email OTP" });
    }

    res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};

exports.registerFinal = async (req, res) => {
  const { email, phone, fullname, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists with this email or phone" });
    }

    const uniqueUserId = await generateUniqueUserId();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ 
      userId: uniqueUserId,
      fullname, 
      email, 
      phone, 
      password: hashedPassword 
    });
    
    await newUser.save();

    await Otp.deleteMany({ email });

    res.status(201).json({ success: true, message: "Account created successfully", userId: uniqueUserId });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Duplicate ID collision detected. Please try again." });
    }
    res.status(500).json({ success: false, message: "Database error: " + error.message });
  }
};

const jwt = require('jsonwebtoken'); // 👈 JWT import karein (agar pehle se nahi hai)

exports.registerFinal = async (req, res) => {
  const { email, phone, fullname, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists with this email or phone" });
    }

    const uniqueUserId = await generateUniqueUserId();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ 
      userId: uniqueUserId,
      fullname, 
      email, 
      phone, 
      password: hashedPassword 
    });
    
    await newUser.save();

    await Otp.deleteMany({ email });

    // 🌟 1. Token generate karein taaki user auto-login ho jaye
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ 
      success: true, 
      message: "Account created successfully", 
      token, // 👈 Token response mein bheja
      userId: uniqueUserId,
      fullname: newUser.fullname,
      email: newUser.email
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Duplicate ID collision detected. Please try again." });
    }
    res.status(500).json({ success: false, message: "Database error: " + error.message });
  }
};