const jwt = require("jsonwebtoken");

function userauth (req, res, next) {
  const token = req.headers.authorization;
  const words = token.split(" ");
  const jwtToken = words[1];

  if (!token) {
    return res.status(401).json({ message: "❌ No token provided" });
  }

  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    
    // Ensure we have the user ID in a consistent format
    req.user ={_id :decoded.id, id:decoded.id};
    
    next();
  } catch (error) {
    res.status(401).json({ message: "❌ Invalid tokenn" });
  }
};

module.exports = { userauth };