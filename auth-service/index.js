const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Auth: MongoDB connecté'))
  .catch(err => console.error(err));

app.use('/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Auth Service lancé sur le port ${PORT}`));
