const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { required } = require('../middlewares/auth-middleware');

router.post('/:productId', required, reviewController.createReview);
router.get('/:productId', reviewController.getReviewsByProduct);
router.get('/count/:productId', reviewController.getReviewCountByProduct);
router.put('/:id', required, reviewController.updateReview);
router.delete('/:id', required, reviewController.deleteReview);

module.exports = router;
