require('dotenv').config({ quiet: true });
const connectDB = require('../config/database');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    await connectDB();

    const existing = await User.findOne({ email: 'admin@russell.fr' });
    if (existing) {
      console.log('Cet utilisateur existe déjà.');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('motdepasse123', 10);
    const user = new User({
      username: 'admin',
      email: 'admin@russell.fr',
      password: hashedPassword,
    });
    await user.save();

    console.log('Utilisateur admin créé avec succès.');
    process.exit(0);
  } catch (error) {
    console.error('Erreur création admin :', error.message);
    process.exit(1);
  }
}

createAdmin();