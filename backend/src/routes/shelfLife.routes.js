const express = require('express');
const { analyseAndStore, getHistory } = require('../controllers/shelfLife.controller');

const router = express.Router();

router.post('/analyse', analyseAndStore);
router.get('/history', getHistory);

module.exports = router;
