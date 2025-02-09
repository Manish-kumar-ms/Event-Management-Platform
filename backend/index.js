import bodyParser from 'body-parser';
import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './congif/db.js';
import cors from 'cors'
import http from "http"; // Required to create an HTTP server
import { Server } from "socket.io"; // Importing Socket.IO

import AuthRouter from "./Routes/AuthRouter.js"
import { checkexpireTime } from './utils/checkexpireTime.js';
import { setupSocket } from './utils/SocketHandler.js';
dotenv.config()

const app=express();
const PORT =process.env.PORT || 8080

app.use(cors());
app.use(bodyParser.json());

app.get("/",(req,res)=>{
      res.send("welcome to job portal")

})

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app); // Create an HTTP server for Express
const io = new Server(server, {
  cors: {
    origin: "*", // Replace '*' with your frontend URL for better security
    methods: ["GET", "POST"],
  },
});

// Attach `io` to the `req` object
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/auth",AuthRouter)


server.listen(PORT,(req,res)=>{
      setupSocket(io)
      checkexpireTime()
     connectDB()
    console.log( `server is running at ${PORT}`)
})