import { createServer } from "http";
import { Server } from "socket.io";

import express from "express";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("<h1>Welcome to socket.io</h1>");
});

io.on("connection", (socket) => {
  console.log(socket);
});

server.listen(3000, () => {
  console.log("Server is running on localhost:3000");
});
