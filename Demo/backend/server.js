const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

// our localhost port
const port = process.env.PORT || 3001;

const app = express();

// our server instance
const server = http.createServer(app);

// This creates our socket using the instance of the server
const io = socketIO(server);

io.on("connection", socket => {
  console.log("New client connected" + socket.id);
  //console.log(socket);

  // on pilot_up event increment received value and send it via a nose_angle event
  socket.on("pilot_up", (curVal) => {
    console.log(`SERVER pilot_up event recieved ${Date.now()} : ${curVal}\n`)
    io.sockets.emit("pilot_up", curVal) 
    console.log(`SERVER pilot_up event emitted ${Date.now()} : ${curVal}\n`)
  });

  socket.on("pilot_down", (curVal) => {
    console.log(`SERVER pilot_down event recieved ${Date.now()} : ${curVal}\n`)
    io.sockets.emit("pilot_down", curVal)
    console.log(`SERVER pilot_down event emitted ${Date.now()} : ${curVal}\n`)
  })

  socket.on("nose_angle", (curVal) => {
    console.log(`SERVER nose_angle event recieved ${Date.now()} : ${curVal}\n`)
    io.sockets.emit("nose_angle", curVal)
    console.log(`SERVER nose_angle event emitted ${Date.now()} : ${curVal}\n`)
  })

  socket.on("kill_aot1", () => {
    console.log(`SERVER kill_aot1 event recieved ${Date.now()} \n`)
    io.sockets.emit("kill_aot1")
    console.log(`SERVER kill_aot1 event emitted ${Date.now()} \n`)
  })

  socket.on("restart_aot1", () => {
    console.log(`SERVER restart_aot1 event recieved ${Date.now()} \n`)
    io.sockets.emit("restart_aot1")
    console.log(`SERVER restart_aot1 event emitted ${Date.now()} \n`)
  })

  socket.on("kill_aot2", () => {
    console.log(`SERVER kill_aot2 event recieved ${Date.now()} \n`)
    io.sockets.emit("kill_aot2")
    console.log(`SERVER kill_aot2 event emitted ${Date.now()} \n`)
  })

  socket.on("restart_aot2", () => {
    console.log(`SERVER restart_aot2 event recieved ${Date.now()} \n`)
    io.sockets.emit("restart_aot2")
    console.log(`SERVER restart_aot2 event emitted ${Date.now()} \n`)
  })

  socket.on("aot_1", (aot1) => {
    console.log(`SERVER aot_1 event recieved ${Date.now()} : ${aot1}\n`)
    io.sockets.emit("aot_1", aot1)
    console.log(`SERVER aot_1 event emitted ${Date.now()} : ${aot1}\n`)
  })

  socket.on("aot_2", (aot2) => {
    console.log(`SERVER aot_2 event recieved ${Date.now()} : ${aot2}\n`)
    io.sockets.emit("aot_2", aot2)
    console.log(`SERVER aot_2 event emitted ${Date.now()} : ${aot2}\n`)
  })

  // disconnect is fired when a client leaves the server
  socket.on("disconnect", () => {
    console.log("user disconnected")
  });
  
});

/* Below mentioned steps are performed to return the Frontend build of create-react-app from build folder of backend */

app.use(express.static("../public"))
//app.use(express.static("../src"))

// app.use(express.static("build"));
// app.use("/kitchen", express.static("build"));
// app.use("/updatepredicted", express.static("build"));

server.listen(port, () => console.log(`Listening on port ${port}`))
