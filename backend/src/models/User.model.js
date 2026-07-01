const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['production_staff', 'lab_admin'],
    default: 'production_staff'
  }
}, { timestamps: true });

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.hashedPassword);
};

module.exports = mongoose.model('User', UserSchema);
