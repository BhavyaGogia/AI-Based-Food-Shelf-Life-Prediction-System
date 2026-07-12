const express = require('express');
const { 
  analyseAndStore, 
  getHistory, 
  getPrefetchResult, 
  prefetchAll,
  approveBatch,
  rejectBatch,
  dispatchBatch,
  updateStorageZone
} = require('../controllers/shelfLife.controller');
const { requireAuth } = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/analyse', analyseAndStore);
router.get('/history', getHistory);
router.get('/prefetch/:productId', getPrefetchResult);
router.post('/prefetch-all', prefetchAll);
router.put('/approve/:id', approveBatch);
router.put('/reject/:id', rejectBatch);
router.put('/dispatch/:id', dispatchBatch);
router.put('/storage/:id', updateStorageZone);

module.exports = router;
