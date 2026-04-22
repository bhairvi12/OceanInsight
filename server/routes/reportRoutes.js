const express = require('express');
const router = express.Router();
const { getReports, getNearbyReports, createReport, getStats } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getReports)
  .post(protect, upload.single('image'), createReport);

router.get('/nearby', getNearbyReports);
router.get('/stats', getStats);

module.exports = router;
