const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

exports.register = async (req, res) => {
  try {
    const { nom, prenom, niveau, email, password, adresse } = req.body;
    if (!nom || !prenom || !niveau || !email || !password || !adresse) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email déjà utilisé' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { nom, prenom, niveau, email, password: hashed, adresse },
    });
    res.status(201).json({ message: 'Inscription réussie' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Identifiants invalides' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Identifiants invalides' });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, nom: user.nom, prenom: user.prenom, niveau: user.niveau, email: user.email, adresse: user.adresse } });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
