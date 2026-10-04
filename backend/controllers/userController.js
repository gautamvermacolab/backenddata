const User = require('../models/User');

// Get User Profile Data
exports.getUserProfile = async (req, res) => {
  try {
    const identifier = req.params.identifier;
    let user = null;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(identifier).select('-password');
    }
    if (!user) {
      user = await User.findOne({ userId: identifier }).select('-password');
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// Update User Profile Data (Real-time update)
exports.updateUserProfile = async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const { fullname, phone, birthdate } = req.body;

    let user = null;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(identifier);
    }
    if (!user) {
      user = await User.findOne({ userId: identifier });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update fields if provided
    if (fullname) user.fullname = fullname;
    if (phone !== undefined) user.phone = phone;
    if (birthdate !== undefined) user.birthdate = birthdate;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        birthdate: user.birthdate
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};