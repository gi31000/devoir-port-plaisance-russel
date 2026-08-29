const Catway = require('../models/catway');;


/**
 * Récupère la liste de tous les catways.
 * @route GET /catways
 * @param {Object} req - Requête Express.
 * @param {Object} res - Réponse Express.
 * @param {Function} next - Middleware suivant (gestion des erreurs).
 * @returns {Promise<void>} Réponse JSON contenant la liste des catways.
 */

const getAllCatways = async (req, res, next) => {
  try {
    const Catways = await Catway.find();
    res.status(200).json({ success: true, data: Catways });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupère un catway précis via son numéro.
 * @route GET /catways/:id
 * @param {Object} req - Requête Express (req.params.id = numéro du catway).
 * @param {Object} res - Réponse Express.
 * @param {Function} next - Middleware suivant (gestion des erreurs).
 * @returns {Promise<void>} Réponse JSON contenant le catway, ou 404 si introuvable.
 */

const getCatwayById = async (req, res, next) => {
    try {
        const found = await Catway.findOne({ catwayNumber: req.params.id });
        if (!found) {
            return res.status(404).json({ success: false, message: 'Catway not found' });
        }
        res.status(200).json({ success: true, data: found });
    }
    catch (error) {
        next(error);
    }
};

/**
 * Crée un nouveau catway.
 * @route POST /catways
 * @param {Object} req - Requête Express (req.body = { catwayNumber, catwayType, catwayState }).
 * @param {Object} res - Réponse Express.
 * @param {Function} next - Middleware suivant (gestion des erreurs).
 * @returns {Promise<void>} Réponse JSON contenant le catway créé (201).
 */
const createCatway = async (req, res, next) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body; 
    if (!catwayNumber || !catwayType || !catwayState) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const catway = new Catway({ catwayNumber, catwayType, catwayState });
    await catway.save();
    res.status(201).json({ success: true, data: catway });
  } catch (error) {
    next(error);
  } 
};


/**
 * Modifie l'état d'un catway existant (numéro et type non modifiables).
 * @route PUT /catways/:id
 * @param {Object} req - Requête Express (req.body = { catwayState }).
 * @param {Object} res - Réponse Express.
 * @param {Function} next - Middleware suivant (gestion des erreurs).
 * @returns {Promise<void>} Réponse JSON contenant le catway modifié, ou 404 si introuvable.
 */

const updateCatway = async (req, res, next) => {
  try {
    const { catwayState } = req.body; 
    if (!catwayState) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const updatedCatway = await Catway.findOneAndUpdate(
      { catwayNumber: req.params.id },
      { catwayState },
      { new: true }
    );
    if (!updatedCatway) {
      return res.status(404).json({ success: false, message: 'Catway not found' });
    }   
    res.status(200).json({ success: true, data: updatedCatway });
  } catch (error) {
    next(error);
  }
};


/**
 * Supprime un catway existant.
 * @route DELETE /catways/:id
 * @param {Object} req - Requête Express (req.params.id = numéro du catway).
 * @param {Object} res - Réponse Express.
 * @param {Function} next - Middleware suivant (gestion des erreurs).
 * @returns {Promise<void>} Confirmation de suppression, ou 404 si introuvable.
 */

const deleteCatway = async (req, res, next) => {
  try {
    
    const deleteCatway = await Catway.findOneAndDelete({ catwayNumber: req.params.id });
    if (!deleteCatway) {
        return res.status(404).json({ success: false, message: 'Catway not found' });
    }
    res.status(200).json({ success: true, message: 'Catway deleted successfully' });
  } catch (error) {
    next(error);
  }
};


module.exports = {
    getAllCatways,
    getCatwayById,
    createCatway,
    updateCatway,
    deleteCatway
};
