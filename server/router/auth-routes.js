const express = require('express');
const router = express.Router();
const authcontroller =require('../controllers/Auth/AuthController');
const chatcontroller = require('../controllers/Chat/ChatController')
router.post('/register', authcontroller.register);
router.post('/login', authcontroller.login);
router.post('/conversation', chatcontroller.conversation);
router.get('/conversations/:userId', chatcontroller.getConversationById);
router.post('/message', chatcontroller.sentMessage);
router.get('/message/:conversationId', chatcontroller.getMessageByConversation);
router.get('/users/:currentUser',authcontroller.getAllUsers);

module.exports = router;