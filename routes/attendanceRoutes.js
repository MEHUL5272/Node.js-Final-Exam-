const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  markAttendance,
  getTodayAttendance,
  getAttendanceByDate
} = require('../controllers/attendanceController');

router.post('/mark', protect, markAttendance);
router.get('/today', protect, getTodayAttendance);
router.get('/', protect, getAttendanceByDate); // e.g., /api/attendance?date=2026-11-23

module.exports = router;