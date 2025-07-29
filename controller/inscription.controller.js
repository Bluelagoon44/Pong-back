const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /api/ads/:id/register
exports.registerToAd = async (req, res) => {
  const adId = parseInt(req.params.id, 10);
  const userId = req.userId;
  try {
    // Vérifie que l'annonce existe
    const ad = await prisma.ad.findUnique({
      where: { id: adId },
      include: { inscriptions: true }
    });
    if (!ad) return res.status(404).json({ message: "Annonce introuvable" });
    // Vérifie si complet
    if (ad.inscriptions.length >= ad.places) {
      return res.status(400).json({ message: "Annonce complète" });
    }
    // Vérifie si déjà inscrit
    const dejaInscrit = ad.inscriptions.some(i => i.userId === userId);
    if (dejaInscrit) {
      return res.status(400).json({ message: "Déjà inscrit à cette annonce" });
    }
    // Crée l'inscription
    await prisma.inscription.create({
      data: { userId, adId }
    });
    res.json({ message: "Inscription réussie" });
  } catch (e) {
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
};

// GET /api/ads/:id/registrations
exports.getRegistrations = async (req, res) => {
  const adId = parseInt(req.params.id, 10);
  const userId = req.userId;
  try {
    // Vérifie que l'annonce existe et appartient à l'utilisateur
    const ad = await prisma.ad.findUnique({ where: { id: adId } });
    if (!ad) return res.status(404).json({ message: "Annonce introuvable" });
    if (ad.userId !== userId) return res.status(403).json({ message: "Non autorisé" });
    // Récupère les inscrits
    const inscriptions = await prisma.inscription.findMany({
      where: { adId },
      include: { user: { select: { id: true, nom: true, prenom: true, niveau: true } } }
    });
    res.json(inscriptions.map(i => i.user));
  } catch (e) {
    res.status(500).json({ message: "Erreur lors de la récupération des inscrits" });
  }
};

// GET /api/my-ads
exports.getMyAdsWithRegistrations = async (req, res) => {
  const userId = req.userId;
  try {
    const ads = await prisma.ad.findMany({
      where: { userId },
      include: {
        inscriptions: {
          include: { user: { select: { id: true, nom: true, prenom: true, niveau: true } } }
        }
      },
      orderBy: { date: 'asc' }
    });
    res.json(ads.map(ad => ({
      id: ad.id,
      titre: ad.titre,
      adresse: ad.adresse,
      latitude: ad.latitude,
      longitude: ad.longitude,
      date: ad.date,
      places: ad.places,
      userId: ad.userId,
      inscrits: ad.inscriptions.map(i => i.user)
    })));
  } catch (e) {
    res.status(500).json({ message: "Erreur lors de la récupération de vos annonces" });
  }
};
