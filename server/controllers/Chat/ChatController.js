const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const bcrypt = require('bcrypt');
const Sequelize = require('../../db/connection');

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });
const Conversation = require('../../models/Conversation')
const User = require('../../models/User')
const Message = require('../../models/Message')
const router = express.Router();
const { db, executeQuery } = require('../../db/connection')
module.exports = {
    conversation: async (req, res) => {
        upload.single('file')(req, res, async (err) => {
            try {
                const { senderId, receiverId } = req.body;
                await Conversation.create({ members: [senderId, receiverId] });
                res.status(200).json('Conversation Created Successfully');
            } catch (error) {
                res.status(500).json({ message: 'Conversation Creation failed. Please try again later.' });
            }
        });
    },
    getConversationById: async (req, res) => {


        try {
            const userId = req.params.userId;
            const conversations = await Conversation.findAll({
                where: Sequelize.literal(`JSON_CONTAINS(members, '["${userId}"]')`)
            });
            const conversationUserData = await Promise.all(conversations.map(async (conversation) => {
                const receiverId = await conversation.members.filter((member) => member !== userId);
                const user = await User.findByPk(receiverId[0]);
                return { user: { receiverId: user.id, email: user.email, fullname: user.fullname }, conversationId: conversation.id }

            }))
            res.status(200).json(conversationUserData);
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' });
        }
    },
    sentMessage: async (req, res) => {
        upload.single('file')(req, res, async (err) => {

            try {
                const { conversationId, senderId, message, receiverId = '' } = req.body;

                if (!senderId || !message) {
                    return res.status(400).send('Please fill all required fields');
                }


                if (conversationId === 'new' && receiverId) {
                    const conversation = await Conversation.findOne({
                        where: Sequelize.literal(
                            `JSON_CONTAINS(members, '["${senderId}", "${receiverId}"]')`
                        ),
                        attributes: ['id']
                    });
                    if (conversation !== null) {
                        await Message.create({ conversationId, senderId, message });
                        return res.status(200).send('Message sent successfully');
                    }
                    else {
                        const newConversation = await Conversation.create({ members: [senderId, receiverId] });
                        await Message.create({ conversationId: newConversation.id, senderId, message });
                        return res.status(200).send('Message sent successfully');
                    }
                } else if (!conversationId && !receiverId) {
                    return res.status(400).send('Please fill all required fields');
                }

                await Message.create({ conversationId, senderId, message });
                res.status(200).send('Message sent successfully');
            } catch (error) {
                console.error(error, 'Error');
                res.status(500).send('Internal Server Error');
            }
        });
    },
    getMessageByConversation: async (req, res) => {
        try {
            const conversationID = req.params.conversationId;
            const checkMessage = async (convID) => {
                const messages = await Message.findAll({
                    where: {
                        conversationId: convID
                    }
                });
                const messageData = Promise.all(messages.map(async (message) => {
                    const user = await User.findByPk(message.senderId);
                    return { user: { userId: user.id, email: user.email, fullName: user.fullName }, message: message.message }
                }));
                res.status(200).json(await messageData);
            }
            if (conversationID === 'new') {
                const { receiverId, senderId } = req.query;
                const conversation = await Conversation.findOne({
                    where: Sequelize.literal(
                        `JSON_CONTAINS(members, '["${senderId}", "${receiverId}"]')`
                    ),
                    attributes: ['id']
                });
                if (conversation !== null) {
                    checkMessage(conversation.id);
                }
                else {
                    res.status(200).json([]);
                }
            }
            else {
                checkMessage(conversationID);
            }
        } catch (error) {
            res.status(500).json({ message: 'Get Message failed. Please try again later.' });
        }
    },
}

