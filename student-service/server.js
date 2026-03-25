const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const studentRoutes = require('./routes/student.routes');
const subjectRoutes = require('./routes/subject.routes');

const app = express();

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'student-service' });
});

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/subjects', subjectRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Student Service connecté à MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Student Service démarré sur le port ${PORT}`);
});
