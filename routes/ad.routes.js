const express = require('express');
const router = express.Router();
const { createAd, getAds, deleteAd } = require('../controller/ad.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.post('/', requireAuth, createAd);
router.get('/', getAds);
router.delete('/:id', requireAuth, deleteAd);

module.exports = router;
