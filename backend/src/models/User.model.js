const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: false
  },
  role: {
    type: String,
    required: true,
    enum: ['unassigned', 'production_staff', 'warehouse_supervisor', 'lab_admin', 'admin'],
    default: 'unassigned'
  },
  status: {
    type: String,
    enum: ['active', 'pending_approval', 'suspended', 'rejected'],
    default: 'active'
  },
  requestedRole: {
    type: String,
    enum: ['unassigned', 'production_staff', 'warehouse_supervisor', 'lab_admin', 'admin'],
    default: 'unassigned'
  }
}, { timestamps: true });

UserSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.hashedPassword) return false;
  return await bcrypt.compare(enteredPassword, this.hashedPassword);
};

module.exports = mongoose.model('User', UserSchema);
