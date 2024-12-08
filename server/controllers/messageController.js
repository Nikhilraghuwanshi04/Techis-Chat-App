import Message from '../models/message.js';
import Chat from '../models/chat.js';

export const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    
    const newMessage = await Message.create({
      chatId,
      sender: req.user._id,
      content,
      status: 'sent'
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: newMessage._id
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', '-password')
      .populate('chatId');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId })
      .populate('sender', '-password')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};