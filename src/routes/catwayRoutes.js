const express = require('express');
const router = express.Router();
const { getAllCatways, getCatwayById, createCatway, updateCatway, deleteCatway } = require('../controllers/catwayController');

router.get('/', getAllCatways); 
router.get('/:id', getCatwayById);
router.post('/', createCatway);
router.put('/:id', updateCatway);
router.delete('/:id', deleteCatway);

module.exports = router;