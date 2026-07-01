const express = require('express');
const { analyseAndStore, getHistory, getPrefetchResult, prefetchAll } = require('../controllers/shelfLife.controller');

const router = express.Router();

router.post('/analyse', analyseAndStore);
router.get('/history', getHistory);
router.get('/prefetch/:productId', getPrefetchResult);
router.post('/prefetch-all', prefetchAll);

module.exports = router;
