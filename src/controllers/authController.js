const User = require('../models/user');
const bcrypt = require('bcryptjs');


/**
 * Connecte un utilisateur : vérifie l'email et le mot de passe (bcrypt.compare), puis crée la session.
 * @route POST /login
 * @param {Object} req - Requête Express (req.body = { email, password }).
 * @param {Object} res - Réponse Express.
 * @param {Function} next - Middleware suivant (gestion des erreurs).
 * @returns {Promise<void>} Réponse JSON de succès, ou 401 si identifiants invalides.
 */

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    req.session.userId = user._id;
    res.status(200).json({ success: true, message: 'Logged in successfully' });
  } catch (error) {
    next(error);
  }
};


/**
 * Déconnecte l'utilisateur en détruisant sa session, puis redirige vers la page d'accueil.
 * @route GET /logout
 * @param {Object} req - Requête Express.
 * @param {Object} res - Réponse Express.
 * @param {Function} next - Middleware suivant (gestion des erreurs).
 * @returns {void} Redirection HTTP vers "/".
 */

const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
};

module.exports = { login, logout };