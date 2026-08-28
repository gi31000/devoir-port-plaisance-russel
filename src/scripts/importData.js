require('dotenv').config({ quiet: true });
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/database');
const Catway = require('../models/catway');
const Reservation = require('../models/reservation');

async function importData() {
  try {
    await connectDB();

    const catways = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/catways.json'), 'utf-8'));
    const reservations = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/reservations.json'), 'utf-8'));

    await Catway.deleteMany({});
    await Reservation.deleteMany({});

    await Catway.insertMany(catways);
    await Reservation.insertMany(reservations);

    console.log(`${catways.length} catways et ${reservations.length} réservations importés.`);
    process.exit(0);
  } catch (error) {
    console.error('Erreur import :', error.message);
    process.exit(1);
  }
}

importData();