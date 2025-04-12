const User = require('../models/User');

const details = async (req, res) => {
  try {
    // Get email from query params instead of body for GET requests
    // const { email } = req.body; // Changed from req.body to req.query
    const { id } = req.query; // Changed from req.body to req.query
    if (!id) {
      return res.status(400).json({ message: 'id is required' });
    }

    // Fetch user details (excluding sensitive fields)
    const user = await User.findOne({ _id:id })
      .select('-password -__v -resetPasswordToken -resetPasswordExpire');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error while fetching user details' });
  }
};

module.exports = { details }; // Changed from export default