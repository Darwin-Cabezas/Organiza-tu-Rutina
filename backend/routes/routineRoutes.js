const express = require('express');
const router = express.Router();
const routineController = require('../controllers/routineController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, routineController.getAllRoutines);
router.post('/', authMiddleware, routineController.createRoutine);
router.delete('/:id', authMiddleware, routineController.deleteRoutine);

module.exports = router;