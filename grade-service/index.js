const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Grade: MongoDB connecté'))
  .catch(err => console.error(err));

app.use('/grades', require('./routes/gradeRoutes'));

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Grade Service lancé sur le port ${PORT}`));
