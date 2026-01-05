import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // This attaches { id: "..." } to the request object
    next(); // Move to the next function (the route)
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
