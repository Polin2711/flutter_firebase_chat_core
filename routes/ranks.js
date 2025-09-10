const express = require('express');
const Rank = require('../models/Rank');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all ranks
router.get('/', async (req, res) => {
  try {
    const ranks = await Rank.getRanksInOrder();
    
    res.json({
      ranks: ranks.map(rank => ({
        id: rank._id,
        name: rank.name,
        displayName: rank.displayName,
        level: rank.level,
        icon: rank.icon,
        description: rank.description,
        requirements: rank.requirements,
        privileges: rank.privileges
      }))
    });
  } catch (error) {
    console.error('Error obteniendo rangos:', error);
    res.status(500).json({
      message: 'Error del servidor'
    });
  }
});

// Get rank by ID
router.get('/:id', async (req, res) => {
  try {
    const rank = await Rank.findById(req.params.id);
    
    if (!rank || !rank.isActive) {
      return res.status(404).json({
        message: 'Rango no encontrado'
      });
    }

    res.json({
      rank: {
        id: rank._id,
        name: rank.name,
        displayName: rank.displayName,
        level: rank.level,
        icon: rank.icon,
        description: rank.description,
        requirements: rank.requirements,
        privileges: rank.privileges
      }
    });
  } catch (error) {
    console.error('Error obteniendo rango:', error);
    res.status(500).json({
      message: 'Error del servidor'
    });
  }
});

// Get users by rank
router.get('/:id/users', auth, async (req, res) => {
  try {
    const rank = await Rank.findById(req.params.id);
    if (!rank) {
      return res.status(404).json({
        message: 'Rango no encontrado'
      });
    }

    const users = await User.find({ 
      rank: rank._id, 
      isActive: true 
    })
    .populate('rank')
    .select('-password')
    .sort({ joinDate: 1 });

    res.json({
      rank: {
        id: rank._id,
        name: rank.name,
        displayName: rank.displayName,
        level: rank.level,
        icon: rank.icon,
        description: rank.description
      },
      users: users.map(user => ({
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
        bio: user.bio,
        joinDate: user.joinDate,
        lastSeen: user.lastSeen
      }))
    });
  } catch (error) {
    console.error('Error obteniendo usuarios por rango:', error);
    res.status(500).json({
      message: 'Error del servidor'
    });
  }
});

// Get rank statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const ranks = await Rank.getRanksInOrder();
    const stats = [];

    for (const rank of ranks) {
      const userCount = await User.countDocuments({ 
        rank: rank._id, 
        isActive: true 
      });
      
      stats.push({
        rank: {
          id: rank._id,
          name: rank.name,
          displayName: rank.displayName,
          level: rank.level,
          icon: rank.icon
        },
        userCount
      });
    }

    res.json({
      rankStats: stats
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas de rangos:', error);
    res.status(500).json({
      message: 'Error del servidor'
    });
  }
});

module.exports = router;