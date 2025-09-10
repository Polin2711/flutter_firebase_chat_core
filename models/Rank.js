const mongoose = require('mongoose');

const rankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: Number,
    required: true,
    unique: true
  },
  icon: {
    type: String,
    required: true,
    default: '⭐'
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: String,
    default: ''
  },
  privileges: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Static method to get ranks in order
rankSchema.statics.getRanksInOrder = function() {
  return this.find({ isActive: true }).sort({ level: 1 });
};

// Static method to get default rank (Soldado Raso)
rankSchema.statics.getDefaultRank = function() {
  return this.findOne({ level: 1 });
};

module.exports = mongoose.model('Rank', rankSchema);