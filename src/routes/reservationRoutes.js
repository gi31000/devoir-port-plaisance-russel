const express = require('express');
const router = express.Router({ mergeParams: true});
const { getReservationsByCatway, getReservationById, createReservation, updateReservation, deleteReservation } = require('../controllers/reservationController');

router.get('/', getReservationsByCatway); 
router.get('/:idReservation', getReservationById);
router.post('/', createReservation);
router.put('/:idReservation', updateReservation);
router.delete('/:idReservation', deleteReservation);

module.exports = router;