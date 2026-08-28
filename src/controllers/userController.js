const User = require('../models/user');
const bcrypt = require('bcryptjs');


const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users});
    } catch (error){
        next(error);
    }
};

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