const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Token generator
const generateAccessToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

// Single handleLoginExecution function
const handleLoginExecution = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // Generate token for localStorage
    const token = generateAccessToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      userId: user.userId,
      fullname: user.fullname
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};

// In-Memory Queue for High Traffic Control (50 requests per 10 secs)
let loginQueue = [];
let activeLogins = 0;
const MAX_CONCURRENT_LOGINS = 50;

const processQueue = () => {
  if (loginQueue.length > 0 && activeLogins < MAX_CONCURRENT_LOGINS) {
    activeLogins++;
    const { req, res } = loginQueue.shift();
    
    handleLoginExecution(req, res).finally(() => {
      activeLogins--;
      processQueue();
    });
  }
};

exports.loginQueueMiddleware = (req, res, next) => {
  if (activeLogins >= MAX_CONCURRENT_LOGINS || loginQueue.length > 0) {
    loginQueue.push({ req, res });
    return res.status(229).json({ 
      success: false, 
      queued: true, 
      message: "Server is busy please wait... You are in the queue." 
    });
  }
  
  activeLogins++;
  handleLoginExecution(req, res).finally(() => {
    activeLogins--;
    processQueue();
  });
};