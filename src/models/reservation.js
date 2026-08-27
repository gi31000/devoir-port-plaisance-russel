const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
   
    catwayNumber: {
    type: Number,
    required: true
  }, 
  
    clientName: {
    type: String,
    required: true
  },
  boatName: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
});


reservationSchema.pre('validate', function () {
  if (this.endDate <= this.startDate) {
    this.invalidate('endDate', 'La date de fin doit être après la date de début');
  }
});


module.exports = mongoose.model('Reservation', reservationSchema);