const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Student: MongoDB connecté'))
  .catch(err => console.error(err));

app.use('/students', require('./routes/studentRoutes'));
app.use('/subjects', require('./routes/subjectRoutes'));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Student Service lancé sur le port ${PORT}`));
