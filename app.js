require('dotenv').config({ quiet: true });

const express = require('express');
const session = require('express-session');
const path = require('path');
const connectDB = require('./src/config/database');
const User = require('./src/models/user');
const Reservation = require('./src/models/reservation');


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


const { isAuthenticated, isPageAuthenticated } = require('./src/middleware/auth');
app.use('/catways', isAuthenticated, catwayRoutes);
app.use('/catways/:id/reservations', isAuthenticated, reservationRoutes);
app.use('/users', isAuthenticated, userRoutes);


app.get('/', (req, res) => {
  res.render('index');
});


app.get('/dashboard', isPageAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);
    const today = new Date();
    const reservations = await Reservation.find({
      startDate: { $lte: today },
      endDate: { $gte: today },
    });
    res.render('dashboard', { user, today, reservations });
  } catch (error) {
    next(error);
  }
});


const Catway = require('./src/models/catway');

app.get('/dashboard/catways', isPageAuthenticated, async (req, res, next) => {
  try {
    const catways = await Catway.find();
    res.render('catways', { catways });
  } catch (error) {
    next(error);
  }
});


app.get('/dashboard/reservations', isPageAuthenticated, async (req, res, next) => {
  try {
    const reservations = await Reservation.find();
    const catways = await Catway.find();
    res.render('reservations', { reservations, catways });
  } catch (error) {
    next(error);
  }
});


app.get('/dashboard/users', isPageAuthenticated, async (req, res, next) => {
  try {
    const users = await User.find();
    res.render('users', { users });
  } catch (error) {
    next(error);
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});