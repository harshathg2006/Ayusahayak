const jwt = require("jsonwebtoken");

const auth = (roles = []) => {
  if (typeof roles === "string") roles = [roles];

  return (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id, role, username }
      console.log("Logged in user:", req.user);

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden: insufficient role" });
      }
      next();
    } catch (err) {
      return res.status(401).json({ message: "Token is not valid" });
    }
  };
};

module.exports = auth;
