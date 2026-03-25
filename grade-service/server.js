const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const gradeRoutes = require('./routes/grade.routes');

const app = express();

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'grade-service' });
});

// Routes
app.use('/api/grades', gradeRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Grade Service connecté à MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`🚀 Grade Service démarré sur le port ${PORT}`);
});
