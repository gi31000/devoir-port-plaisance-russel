const Reservation = require('../models/reservation');
const Catway = require('../models/catway');


/**
 * Récupère la liste des réservations d'un catway donné.
 * @route GET /catways/:id/reservations
 * @param {Object} req - Requête Express (req.params.id = numéro du catway).
 * @param {Object} res - Réponse Express.
 * @param {Function} next - Middleware suivant (gestion des erreurs).
 * @returns {Promise<void>} Réponse JSON contenant la liste des réservations.
 */

const getReservationsByCatway = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reservations = await Reservation.find({ catwayNumber: id });
    res.status(200).json({ success: true, data: reservations });
  } catch (error) {
    next(error);
  }
};


/**
 * Récupère une réservation précise d'un catway.
 * @route GET /catways/:id/reservations/:idReservation
 * @param {Object} req - Requête Express (req.params.id, req.params.idReservation).
 * @param {Object} res - Réponse Express.
 * @param {Function} next - Middleware suivant (gestion des erreurs).
 * @returns {Promise<void>} Réponse JSON contenant la réservation, ou 404 si introuvable.
 */

const getReservationById = async (req, res, next) => {
  try {
    const { id, idReservation } = req.params;
    const reservation = await Reservation.findOne({ _id: idReservation, catwayNumber: id });
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    next(error);
  }
};


/**
 * Crée une nouvelle réservation sur un catway existant, en vérifiant l'absence de conflit de dates.
 * @route POST /catways/:id/reservations
 * @param {Object} req - Requête Express (req.body = { clientName, boatName, startDate, endDate }).
 * @param {Object} res - Réponse Express.
 * @param {Function} next - Middleware suivant (gestion des erreurs).
 * @returns {Promise<void>} Réponse JSON contenant la réservation créée (201).
 */

const createReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { clientName, boatName, startDate, endDate } = req.body;

    if (!clientName || !boatName || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const catway = await Catway.findOne({ catwayNumber: id });
    if (!catway) {
      return res.status(404).json({ success: false, message: 'Catway not found' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const conflict = await Reservation.findOne({
      catwayNumber: id,
      startDate: { $lt: end },
      endDate: { $gt: start },
    });
    if (conflict) {
      return res.status(409).json({ success: false, message: 'Reservation conflict with existing reservation' });
    }

    const reservation = new Reservation({ catwayNumber: id, clientName, boatName, startDate: start, endDate: end });
    await reservation.save();
    res.status(201).json({ success: true, data: reservation });
  } catch (error) {
    next(error);
  }
};


/**
 * Modifie une réservation existante (champs optionnels, avec re-vérification des conflits de dates si les dates changent).
 * @route PUT /catways/:id/reservations/:idReservation
 * @param {Object} req - Requête Express (req.body = { clientName?, boatName?, startDate?, endDate? }).
 * @param {Object} res - Réponse Express.
 * @param {Function} next - Middleware suivant (gestion des erreurs).
 * @returns {Promise<void>} Réponse JSON contenant la réservation modifiée, ou 404 si introuvable.
 */

const updateReservation = async (req, res, next) => {
  try {
    const { id, idReservation } = req.params;
    const { clientName, boatName, startDate, endDate } = req.body;

    const reservation = await Reservation.findOne({ _id: idReservation, catwayNumber: id });
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    if (clientName) reservation.clientName = clientName;
    if (boatName) reservation.boatName = boatName;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const conflict = await Reservation.findOne({
        catwayNumber: id,
        _id: { $ne: idReservation },
        startDate: { $lt: end },
        endDate: { $gt: start },
      });
      if (conflict) {
        return res.status(409).json({ success: false, message: 'Reservation conflict with existing reservation' });
      }

      reservation.startDate = start;
      reservation.endDate = end;
    }

    await reservation.save();
    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    next(error);
  }
};


/**
 * Supprime une réservation existante.
 * @route DELETE /catways/:id/reservations/:idReservation
 * @param {Object} req - Requête Express (req.params.id, req.params.idReservation).
 * @param {Object} res - Réponse Express.
 * @param {Function} next - Middleware suivant (gestion des erreurs).
 * @returns {Promise<void>} Confirmation de suppression, ou 404 si introuvable.
 */

const deleteReservation = async (req, res, next) => {
  try {
    const { id, idReservation } = req.params;
    const deleted = await Reservation.findOneAndDelete({ _id: idReservation, catwayNumber: id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    res.status(200).json({ success: true, message: 'Reservation deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getReservationsByCatway, getReservationById, createReservation, updateReservation, deleteReservation };
