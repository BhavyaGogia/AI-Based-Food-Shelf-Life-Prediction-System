const User = require('../models/User.model');

// GET /api/admin/users
// Fetch all users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-hashedPassword');
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/users/:id/approve
// Approve a pending user
exports.approveUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (user.status !== 'pending_approval') {
      return res.status(400).json({ success: false, error: 'User is not pending approval' });
    }

    user.role = user.requestedRole || 'unassigned';
    user.status = 'active';
    user.requestedRole = 'unassigned';
    
    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/users/:id/reject
// Reject a pending user
exports.rejectUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.status = 'rejected';
    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/users/:id/role
// Change a user's role and status directly
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role, status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (role) {
      if (!['unassigned', 'production_staff', 'warehouse_supervisor', 'lab_admin', 'admin'].includes(role)) {
        return res.status(400).json({ success: false, error: 'Invalid role' });
      }
      user.role = role;
    }
    
    if (status) {
      if (!['active', 'pending_approval', 'suspended', 'rejected'].includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid status' });
      }
      user.status = status;
    }

    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
