const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  let token;

  if (req.headers.authorization) {
    token = req.headers.authorization;
    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded._id;
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not Authorized" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No Token" });
  }
};

module.exports = checkAuth;