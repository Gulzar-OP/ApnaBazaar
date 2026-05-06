export const admin = (req, res, next) => {
  console.log('Admin middleware called',req.user);
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({ message: 'Not authorized as an admin' });
};