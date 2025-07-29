const express = require('express');
const router = express.Router();
const { getProfile } = require('../controller/user.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.get('/me', requireAuth, getProfile);

module.exports = router;
