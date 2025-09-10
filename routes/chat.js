const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get chat messages
router.get('/messages', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ isDeleted: false })
      .populate('user', 'username firstName lastName rank profilePicture')
      .populate('rank')
      .populate('replyTo')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    // Reverse to get chronological order
    messages.reverse();

    res.json({
      messages: messages.map(msg => ({
        id: msg._id,
        user: {
          id: msg.user._id,
          username: msg.user.username,
          firstName: msg.user.firstName,
          lastName: msg.user.lastName,
          fullName: `${msg.user.firstName} ${msg.user.lastName}`,
          profilePicture: msg.user.profilePicture
        },
        rank: msg.rank || msg.user.rank,
        rankName: msg.rankName,
        rankIcon: msg.rankIcon,
        content: msg.content,
        type: msg.type,
        attachments: msg.attachments,
        isEdited: msg.isEdited,
        editedAt: msg.editedAt,
        reactions: msg.reactions,
        replyTo: msg.replyTo,
        createdAt: msg.createdAt,
        formattedTime: msg.formattedTime,
        formattedDate: msg.formattedDate
      })),
      pagination: {
        page,
        limit,
        hasMore: messages.length === limit
      }
    });
  } catch (error) {
    console.error('Error obteniendo mensajes:', error);
    res.status(500).json({
      message: 'Error del servidor'
    });
  }
});

// Send a message
router.post('/messages', auth, async (req, res) => {
  try {
    const { content, type = 'text', replyTo } = req.body;
    
    const user = await User.findById(req.userId).populate('rank');
    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    const message = new Message({
      user: user._id,
      username: user.username,
      rank: user.rank._id,
      rankName: user.rank.name,
      rankIcon: user.rank.icon,
      content,
      type,
      replyTo
    });

    await message.save();
    await message.populate('user', 'username firstName lastName profilePicture');
    await message.populate('rank');

    res.status(201).json({
      message: 'Mensaje enviado exitosamente',
      newMessage: {
        id: message._id,
        user: {
          id: message.user._id,
          username: message.user.username,
          firstName: message.user.firstName,
          lastName: message.user.lastName,
          fullName: `${message.user.firstName} ${message.user.lastName}`,
          profilePicture: message.user.profilePicture
        },
        rank: message.rank,
        rankName: message.rankName,
        rankIcon: message.rankIcon,
        content: message.content,
        type: message.type,
        attachments: message.attachments,
        isEdited: message.isEdited,
        editedAt: message.editedAt,
        reactions: message.reactions,
        replyTo: message.replyTo,
        createdAt: message.createdAt,
        formattedTime: message.formattedTime,
        formattedDate: message.formattedDate
      }
    });
  } catch (error) {
    console.error('Error enviando mensaje:', error);
    res.status(500).json({
      message: 'Error del servidor'
    });
  }
});

// Edit a message
router.put('/messages/:id', auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    const message = await Message.findOne({
      _id: req.params.id,
      user: req.userId,
      isDeleted: false
    });

    if (!message) {
      return res.status(404).json({
        message: 'Mensaje no encontrado'
      });
    }

    message.content = content;
    message.isEdited = true;
    message.editedAt = new Date();

    await message.save();

    res.json({
      message: 'Mensaje editado exitosamente'
    });
  } catch (error) {
    console.error('Error editando mensaje:', error);
    res.status(500).json({
      message: 'Error del servidor'
    });
  }
});

// Delete a message
router.delete('/messages/:id', auth, async (req, res) => {
  try {
    const message = await Message.findOne({
      _id: req.params.id,
      user: req.userId,
      isDeleted: false
    });

    if (!message) {
      return res.status(404).json({
        message: 'Mensaje no encontrado'
      });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    message.content = 'Este mensaje ha sido eliminado';

    await message.save();

    res.json({
      message: 'Mensaje eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando mensaje:', error);
    res.status(500).json({
      message: 'Error del servidor'
    });
  }
});

// Add reaction to message
router.post('/messages/:id/reactions', auth, async (req, res) => {
  try {
    const { emoji } = req.body;
    
    const message = await Message.findById(req.params.id);
    if (!message || message.isDeleted) {
      return res.status(404).json({
        message: 'Mensaje no encontrado'
      });
    }

    // Remove existing reaction from this user
    message.reactions = message.reactions.filter(
      reaction => !reaction.user.equals(req.userId)
    );

    // Add new reaction
    message.reactions.push({
      user: req.userId,
      emoji
    });

    await message.save();

    res.json({
      message: 'Reacción agregada exitosamente',
      reactions: message.reactions
    });
  } catch (error) {
    console.error('Error agregando reacción:', error);
    res.status(500).json({
      message: 'Error del servidor'
    });
  }
});

// Remove reaction from message
router.delete('/messages/:id/reactions', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message || message.isDeleted) {
      return res.status(404).json({
        message: 'Mensaje no encontrado'
      });
    }

    // Remove reaction from this user
    message.reactions = message.reactions.filter(
      reaction => !reaction.user.equals(req.userId)
    );

    await message.save();

    res.json({
      message: 'Reacción eliminada exitosamente',
      reactions: message.reactions
    });
  } catch (error) {
    console.error('Error eliminando reacción:', error);
    res.status(500).json({
      message: 'Error del servidor'
    });
  }
});

module.exports = router;