const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// DELETE /api/ads/:id
exports.deleteAd = async (req, res) => {
  const adId = parseInt(req.params.id, 10);
  const userId = req.userId;
  try {
    const ad = await prisma.ad.findUnique({ where: { id: adId } });
    if (!ad) return res.status(404).json({ message: "Annonce introuvable" });
    if (ad.userId !== userId) return res.status(403).json({ message: "Non autorisé" });
    await prisma.$transaction([
      prisma.inscription.deleteMany({ where: { adId } }),
      prisma.ad.delete({ where: { id: adId } })
    ]);
    res.json({ message: "Annonce supprimée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression", error: err.message });
  }
};

exports.createAd = async (req, res) => {
  try {
    const { titre, adresse, places, date } = req.body;
    if (!titre || !adresse || !places || !date) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    // Géocodage via Nominatim
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(adresse)}`;
    const geoRes = await fetch(url);
    const geoData = await geoRes.json();
    if (!geoData[0]) {
      return res.status(400).json({ message: "Adresse non géocodable" });
    }
    const latitude = parseFloat(geoData[0].lat);
    const longitude = parseFloat(geoData[0].lon);
    // Transaction : création annonce + inscription créateur
    const result = await prisma.$transaction(async (tx) => {
      const ad = await tx.ad.create({
        data: {
          titre,
          adresse,
          latitude,
          longitude,
          places: Number(places),
          date: new Date(date),
          userId: req.userId,
        },
      });
      await tx.inscription.create({
        data: {
          userId: req.userId,
          adId: ad.id,
        },
      });
      // Inclure user (créateur) sans le mot de passe
      const user = await tx.user.findUnique({
        where: { id: req.userId },
        select: { id: true, prenom: true, nom: true, niveau: true }
      });
      return { ...ad, user };
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getAds = async (req, res) => {
  try {
    const { niveau, adresse, date } = req.query;
    const where = {};
    if (niveau) where.user = { niveau };
    if (adresse) where.adresse = { contains: adresse };
    if (date) where.date = { equals: new Date(date) };
    const ads = await prisma.ad.findMany({
      where,
      include: { user: { select: { id: true, prenom: true, nom: true, niveau: true } } },
      orderBy: { date: 'asc' },
    });
    // Ne renvoyer que les champs utiles côté front
    const sanitized = ads.map(ad => ({
      id: ad.id,
      titre: ad.titre,
      adresse: ad.adresse,
      latitude: ad.latitude,
      longitude: ad.longitude,
      date: ad.date,
      places: ad.places,
      user: ad.user
    }));
    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
