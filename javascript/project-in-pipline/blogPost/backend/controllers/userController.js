// controllers/userController.js
const User = require('../models/User');

exports.getUsersByIds = async (req, res) => {
  try {
    const { userIds } = req.body;
    
    // Validate input
    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ message: 'Invalid user IDs provided' });
    }

    // Fetch users with only necessary fields
    const users = await User.find(
      { _id: { $in: userIds } },
      { _id: 1, name: 1, email: 1, avatar: 1 } // Only return these fields
    ).lean();

    // Convert to object with ID as key for easy lookup
    const usersMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = user;
      return acc;
    }, {});

    res.json(usersMap);
  } catch (error) {
    console.error('Error in getUsersByIds:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};