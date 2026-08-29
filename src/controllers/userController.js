const User = require('../models/user');
const bcrypt = require('bcryptjs');


/**
 * Récupère la liste de tous les utilisateurs.
 * @route GET /users
 * @param {Object} req - Requête Express.
 * @param {Object} res - Réponse Express.
 * @param {Function} next - Middleware suivant (gestion des erreurs).
 * @returns {Promise<void>} Réponse JSON contenant la liste des utilisateurs.
 */

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users});
    } catch (error){
        next(error);
    }
};


/**
 * Récupère un utilisateur précis via son email.
 * @route GET /users/:email
 * @param {Object} req - Requête Express (req.params.email).
 * @param {Object} res - Réponse Express.
 * @param {Function} next - Middleware suivant (gestion des erreurs).
 * @returns {Promise<void>} Réponse JSON contenant l'utilisateur, ou 404 si introuvable.
 */

const getUserByEmail = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.params.email});
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json ({success: true, data:user});
    } catch (error) {
        next(error);
    }
};


/**
 * Crée un nouvel utilisateur (mot de passe haché avec bcrypt avant sauvegarde).
 * @route POST /users
 * @param {Object} req - Requête Express (req.body = { username, email, password }).
 * @param {Object} res - Réponse Express.
 * @param {Function} next - Middleware suivant (gestion des erreurs).
 * @returns {Promise<void>} Réponse JSON contenant l'utilisateur créé, sans le mot de passe (201).
 */

const createUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json ({ success: false, message: 'Missing required fields'});
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 charracters'});
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Email already in use'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ username, email, password: hashedPassword});
        await user.save();

        const { password: _, ...userWithoutPassword } = user.toObject();
        res.status(201).json({ success: true, data: userWithoutPassword});
    } catch (error) {
        next(error);
    }
};


/**
 * Modifie un utilisateur existant (champs optionnels ; le mot de passe est re-haché s'il est fourni).
 * @route PUT /users/:email
 * @param {Object} req - Requête Express (req.body = { username?, email?, password? }).
 * @param {Object} res - Réponse Express.
 * @param {Function} next - Middleware suivant (gestion des erreurs).
 * @returns {Promise<void>} Réponse JSON contenant l'utilisateur modifié, ou 404 si introuvable.
 */

const updateUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
      }
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({ success: true, data: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};


/**
 * Supprime un utilisateur existant.
 * @route DELETE /users/:email
 * @param {Object} req - Requête Express (req.params.email).
 * @param {Object} res - Réponse Express.
 * @param {Function} next - Middleware suivant (gestion des erreurs).
 * @returns {Promise<void>} Confirmation de suppression, ou 404 si introuvable.
 */

const deleteUser = async (req, res, next) => {
  try {
    const deleted = await User.findOneAndDelete({ email: req.params.email });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};


module.exports = { getAllUsers, getUserByEmail, createUser, updateUser, deleteUser };