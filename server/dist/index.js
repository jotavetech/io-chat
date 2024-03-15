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
    socket.on("connected", () => {
        console.log("User connected");
    });
    socket.on("join-chat", (chatname) => {
        socket.join(chatname);
        console.log(`User joined chat: ${chatname}`);
    });
    socket.on("create-chat", (chatname) => {
        io.emit("received-chat", chatname);
    });
    socket.on("send-message", ({ chatname, message }) => {
        io.to(chatname).emit("message", message);
    });
});
server.listen(8000, () => {
    console.log("Server is running on localhost:8000");
});
