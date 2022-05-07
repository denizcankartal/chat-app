const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

app.get("/", (request, response) => {});

let count = 0;
io.on("connection", (socket) => {
  console.log("a client joined");
  socket.emit("message", "welcome");
  socket.broadcast.emit("message", "New user joined!"); // emit to everybody except that particular socket

  socket.on("sendMessage", (message, acknowledgementCallback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      acknowledgementCallback("WATCH YOUR LANGUAGE!");
      return;
    }
    io.emit("message", message); // emitting to every client
    ackCallback();
  });

  socket.on("sendLocation", (coords, ackCallback) => {
    io.emit("message", `Location: ${coords.lat}, ${coords.lon}`);
    ackCallback();
  });

  socket.on("disconnect", () => {
    io.emit("message", "a user left the party!");
  });
});

server.listen(port, () => {
  console.log(`server started to listen on port ${port}`);
});
