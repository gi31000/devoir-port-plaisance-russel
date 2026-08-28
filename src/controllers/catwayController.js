const Catway = require('../models/catway');;


const getAllCatways = async (req, res, next) => {
  try {
    const Catways = await Catway.find();
    res.status(200).json({ success: true, data: Catways });
  } catch (error) {
    next(error);
  }
};


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
