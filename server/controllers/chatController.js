import Chat from '../models/chat.js';
import Message from '../models/message.js';

const createChat = async (req, res) => {
  try {
    const { participantId } = req.body;
    const existingChat = await Chat.findOne({
      isGroup: false,
      participants: { $all: [req.user._id, participantId] }
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    const newChat = await Chat.create({
      participants: [req.user._id, participantId],
      isGroup: false
    });

    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id
    })
      .populate('participants', '-password')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createChat, getUserChats };