const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:routineId', authMiddleware, taskController.getTasksByRoutine);
router.post('/', authMiddleware, taskController.createTask);
router.delete('/:id', authMiddleware, taskController.deleteTask);

module.exports = router;