const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
};

const isPageAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/');
    }
    next();
};

module.exports = { isAuthenticated, isPageAuthenticated };