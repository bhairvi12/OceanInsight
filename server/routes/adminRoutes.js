const express = require('express');
const router = express.Router();
const { 
  getAdminReports, 
  approveReport, 
  rejectReport, 
  deleteReport 
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/reports')
  .get(protect, isAdmin, getAdminReports);

router.route('/reports/:id/approve')
  .put(protect, isAdmin, approveReport);

router.route('/reports/:id/reject')
  .put(protect, isAdmin, rejectReport);

router.route('/reports/:id')
  .delete(protect, isAdmin, deleteReport);

module.exports = router;
