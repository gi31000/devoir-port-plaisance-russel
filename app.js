require('dotenv').config({ quiet: true });

const express = require('express');
const session = require('express-session');
const path = require('path');
const connectDB = require('./src/config/database');

const app = express();

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src/public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));


const catwayRoutes = require('./src/routes/catwayRoutes');


const reservationRoutes = require('./src/routes/reservationRoutes');


const userRoutes = require('./src/routes/userRoutes');


const { login, logout } = require('./src/controllers/authController');
app.post('/login', login);
app.get('/logout', logout);


const isAuthenticated = require('./src/middleware/auth');
app.use('/catways', isAuthenticated, catwayRoutes);
app.use('/catways/:id/reservations', isAuthenticated, reservationRoutes);
app.use('/users', isAuthenticated, userRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});