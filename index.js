const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoute = require('./routes/User.routes')
const messageRoutes = require("./routes/messages");

const app = express()
require('dotenv').config()
const socket = require("socket.io");




const allowedOrigins = ['http://localhost:3000', ''];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true, // If you need to allow cookies or authorization headers
}));
app.use(express.json())


//run api

app.use('/api/auth',userRoute)
app.use("/api/messages", messageRoutes);




// connected to database mongodb
mongoose.connect(process.env.mongo_url,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("mongodb is connected ")
}).catch((error)=>{
    console.log(error)

})
// run server
const server = app.listen(process.env.PORT,()=>{
    console.log(`app is running at ${process.env.PORT}`)
})


const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
      }
    });
  });