const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all tracking routes
router.use(authMiddleware);

router.get('/', trackingController.getTracking);
router.post('/', trackingController.updateTracking);

module.exports = router;
