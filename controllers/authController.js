const Faculty = require('../models/Faculty');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Faculty (for creating test accounts)
exports.registerFaculty = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    const existing = await Faculty.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const faculty = await Faculty.create({
      name,
      email,
      password: hashedPassword,
      department
    });

    res.status(201).json({ message: 'Faculty registered', facultyId: faculty._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login Faculty & Generate JWT
exports.loginFaculty = async (req, res) => {
  try {
    const { email, password } = req.body;

    const faculty = await Faculty.findOne({ email });
    if (!faculty) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, faculty.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: faculty._id, email: faculty.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      faculty: { id: faculty._id, name: faculty.name, email: faculty.email }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};