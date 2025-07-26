const express = require('express');
const router = express.Router();
const comparisonController = require('../controllers/comparisonController');
const { required } = require('../middlewares/auth-middleware');

router.post('/', required, comparisonController.addToComparison);
router.get('/', required, comparisonController.getComparisonList);
router.delete('/:productId', required, comparisonController.removeFromComparison);

module.exports = router;
