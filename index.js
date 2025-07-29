require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Importer les routes
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const adRoutes = require('./routes/ad.routes');
const inscriptionRoutes = require('./routes/inscription.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ads', adRoutes);
app.use('/api', inscriptionRoutes);

app.get('/', (req, res) => {
  res.send('API Rencontre Pongistes prête !');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur le port ${PORT}`);
});
