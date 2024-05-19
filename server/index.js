const express = require('express')
const cors = require('cors')
const app = express() 
const employeeroute = require('./router/employee-routes')
const User = require('./models/User');
const authroute = require('./router/auth-routes')
const { connectDB, db } = require('./db/connection'); // Import connectDB function and db connection from db.js
const sequelize = require('./db/connection');

const io = require('socket.io')(8000,{
  cors : {
    origin : 'http://localhost:3000',
  }
})
app.use(express.json())
app.use(express.urlencoded({extended:false}));
app.use(cors())

const PORT = process.env.PORT || 8080;


let users = [];
io.on('connection', socket => {
    console.log('User connected', socket.id);
    socket.on('addUser', userId => {
        const isUserExist = users.find(user => user.userId === userId);
        if (!isUserExist) {
            const user = { userId, socketId: socket.id };
            users.push(user);
            io.emit('getUsers', users);
        }
    });

    socket.on('sendMessage', async ({ senderId, receiverId, message, conversationId }) => {
        const receiver = users.find(user => user.userId === receiverId);
        const sender = users.find(user => user.userId === senderId);
        const user = await  User.findByPk(senderId);
        console.log('sender :>> ', sender, receiver);
        if (receiver) {
            io.to(receiver.socketId).to(sender.socketId).emit('getMessage', {
                senderId,
                message,
                conversationId,
                receiverId,
                user: { id: user.id, fullName: user.fullName, email: user.email }
            });
            }else {
                io.to(sender.socketId).emit('getMessage', {
                    senderId,
                    message,
                    conversationId,
                    receiverId,
                    user: { id: user.id, fullName: user.fullName, email: user.email }
                });
            }
        });

    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id);
        io.emit('getUsers', users);
    });
    // io.emit('getUsers', socket.userId);
});


app.use("/employees",employeeroute)
app.use("/api",authroute)

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
});
// app.post('/employees/create-employee', employeesController.createEmployee);
