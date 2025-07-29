const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth.middleware');
const ctrl = require('../controller/inscription.controller');

// S'inscrire à une annonce
router.post('/ads/:id/register', requireAuth, ctrl.registerToAd);
// Voir les inscrits à une annonce (créateur uniquement)
router.get('/ads/:id/registrations', requireAuth, ctrl.getRegistrations);
// Voir toutes ses annonces avec inscrits
router.get('/my-ads', requireAuth, ctrl.getMyAdsWithRegistrations);

module.exports = router;
