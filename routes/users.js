const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all users (for admin purposes)
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .populate('rank')
      .select('-password')
      .sort({ 'rank.level': -1, joinDate: 1 });

    res.json({
      users: users.map(user => ({
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        rank: user.rank,
        profilePicture: user.profilePicture,
        bio: user.bio,
        joinDate: user.joinDate,
        lastSeen: user.lastSeen
      }))
    });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      message: 'Error del servidor'
    });
  }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('rank')
      .select('-password');

    if (!user || !user.isActive) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        rank: user.rank,
        profilePicture: user.profilePicture,
        bio: user.bio,
        joinDate: user.joinDate,
        lastSeen: user.lastSeen
      }
    });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      message: 'Error del servidor'
    });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, bio, profilePicture } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    // Update allowed fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (bio !== undefined) user.bio = bio;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    await user.save();
    await user.populate('rank');

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        rank: user.rank,
        profilePicture: user.profilePicture,
        bio: user.bio,
        joinDate: user.joinDate,
        lastSeen: user.lastSeen
      }
    });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      message: 'Error del servidor'
    });
  }
});

// Change password
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        message: 'Contraseña actual incorrecta'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({
      message: 'Error del servidor'
    });
  }
});

// Get online users
router.get('/online/list', auth, async (req, res) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const onlineUsers = await User.find({
      isActive: true,
      lastSeen: { $gte: fiveMinutesAgo }
    })
    .populate('rank')
    .select('username firstName lastName rank profilePicture lastSeen')
    .sort({ 'rank.level': -1, lastSeen: -1 });

    res.json({
      onlineUsers: onlineUsers.map(user => ({
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        rank: user.rank,
        profilePicture: user.profilePicture,
        lastSeen: user.lastSeen
      }))
    });
  } catch (error) {
    console.error('Error obteniendo usuarios en línea:', error);
    res.status(500).json({
      message: 'Error del servidor'
    });
  }
});

module.exports = router;