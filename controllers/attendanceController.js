const Attendance = require('../models/Attendance');

// Helper for YYYY-MM-DD format
const getToday = () => new Date().toISOString().split('T')[0];

// 1. Mark Attendance
exports.markAttendance = async (req, res) => {
  try {
    const today = getToday();
    const { status } = req.body;

    const alreadyMarked = await Attendance.findOne({
      facultyId: req.faculty.id,
      date: today
    });

    if (alreadyMarked) {
      return res.status(400).json({ message: 'Attendance already marked for today' });
    }

    const record = await Attendance.create({
      facultyId: req.faculty.id,
      date: today,
      status: status || 'Present'
    });

    res.status(201).json({ message: 'Attendance marked', record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get Today's Attendance
exports.getTodayAttendance = async (req, res) => {
  try {
    const today = getToday();
    const records = await Attendance.find({ date: today }).populate('facultyId', 'name email department');

    res.json({
      date: today,
      total: records.length,
      records
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Date-based Filtering (?date=YYYY-MM-DD)
exports.getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const query = date ? { date } : {};

    const records = await Attendance.find(query).populate('facultyId', 'name email department');

    res.json({
      date: date || 'All Dates',
      total: records.length,
      records
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};