const express = require('express');
const { getUsers, approveUser, rejectUser, updateUserRole } = require('../controllers/admin.controller');
const { requireAuth, authorizeRoles } = require('../middleware/requireAuth');

const router = express.Router();

// All admin routes are protected and restricted to 'admin' role
router.use(requireAuth, authorizeRoles('admin'));

router.get('/users', getUsers);
router.put('/users/:id/approve', approveUser);
router.put('/users/:id/reject', rejectUser);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
