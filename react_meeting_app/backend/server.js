const express = require("express");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
let allMessages = [];

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  },
});

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
  // optionsSuccessStatus: 200
};


let allRoomDetails = [];



const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Deepa30",
});

connection.connect((err) => {
  err
    ? console.log("Can not connect with mysql")
    : console.log("Connect with mysql");
});

connection.query("CREATE DATABASE if not exists users_db ;", (err, data) => {
  if (err) {
    console.log("DB creation failed");
    return;
  }
  console.log("Successfully created db");
});

connection.end();

const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Deepa30",
  database: "users_db",
});

dbConnection.connect((err) => {
  if (err) {
    console.log("Erro connection to the database");
  } else {
    console.log("Connected to the database");
  }
});

let tableCreateQuery =
  "create table if not exists users(user_id smallint auto_increment primary key, user_name varchar(60) not null, unique_name varchar(100)  unique key not null ,password varchar(100) not null, user_key varchar(16)  unique key not null);";

dbConnection.query(tableCreateQuery, (err, result) => {
  if (err) {
    console.error("Error creating table:", err);
    return;
  }
  console.log('Table "users" created or already exists');
});


app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from Backend!" });
});


app.post("/allMessages", (req, res)=>{
//   console.log("In messObj post-R Details : ",allRoomDetails);
  let {roomId}= req.body;
  console.log("Room ID : ",roomId);
  let theRoom =getRoom(roomId);
  console.log("Selected Room : ",theRoom);

  if(theRoom != null){
    res.status(201).send({message : true, data: theRoom});
  }
  else{
    res.status(504).send({message : false, data: theRoom});
  }
})

app.post("/unique", async (req, res) => {
  try {
    console.log(req.body);
    let { unique_name } = req.body;
    console.log("Unique Name : ", unique_name);

    let query = "select * from users where unique_name=?";

    let check = await new Promise((resolve, reject) => {
      dbConnection.query(query, [unique_name], (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });

    if (check.length == 0) {
      res.status(201).send({ message: "Success", data: check });
    } else {
      res.status(201).send({ message: "Fail", data: check });
    }
  } catch (err) {
    res.status(500).send("Internal Error");
  }
});

app.post("/signUp", async (req, res) => {
  try {
    console.log("I came inside");
    let { user_name, password, unique_name, user_key } = req.body;
    console.log("Data1 : ", user_name);
    console.log("Data2 : ", password);
    console.log("Data3 : ", unique_name);
    console.log("Data4 : ", user_key);

    let query =
      "insert into users(user_name, unique_name ,password, user_key ) values(?,?,?, ?)";

    let insertUser = await new Promise((resolve, reject) => {
      dbConnection.query(
        query,
        [user_name, unique_name, password, user_key],
        (err, data) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        }
      );
    });

    res.status(200).send({ message: "Success", data: "Successfully added" });
  } catch (err) {
    res.status(500).send({ message: "Failed", data: "Failed to add" });
  }
});

app.get("/secretKey", async (req, res) => {
  try {
    let users = await getUserDetails();

    if (users.length > 0) {
      res.status(201).send({ data: users });
    } else {
      res.status(501).send({ data: "No users found" });
    }
  } catch (err) {
    console.log("Err in getting user detail: ", err);
    res.status(500).send({ data: "Internal Server error" });
  }
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle room creation
  socket.on("create-room", (roomId) => {
    if (!roomId) return socket.emit("error", "Invalid roomId");
    console.log(`Room created: ${roomId}`);
    if (!rooms[roomId]) {
      rooms[roomId] = new Set(); // Create a new room
    }
    socket.emit("room-created", roomId); // Notify the client
  });

  // Handle checking if a room exists
  socket.on("join-existing-room", (roomId) => {
    console.log(`User checking room: ${roomId}`);
    socket.emit("room-exists", { exists: !!rooms[roomId], roomId });
  });

  // Handle joining a room
  socket.on("join-room", (roomId, userId, userNameShow) => {
    if (!roomId || !userId)
      return socket.emit("error", "Invalid roomId or userId");
    console.log(`User ${userId} joining room ${roomId}`);



    if (!rooms[roomId]) {
      rooms[roomId] = new Set(); // Auto-create room if it doesn’t exist (optional)
    }

    let roomCheck = checkTheRoomToId(roomId); //true- exsists

    if (roomCheck) {
      
      let roomObject = getRoom(roomId);
      roomObject.participants.push({userId:userId, name : userNameShow});
      console.log("RoomObject: ",roomObject);

    }
    else {
      let roomObject ={};
      roomObject.roomId = roomId;
      roomObject.participants =[{userId: userId, name : userNameShow}];
      console.log("Room PArticipant: ",roomObject.participants)
      roomObject.messages =[];
      allRoomDetails.push(roomObject);
    }


    console.log("RoomDetails: ",allRoomDetails);

    rooms[roomId].add(userId);
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
  });

  // Handle signaling (defined at connection level, not nested)
  socket.on("ice-candidate", ({ candidate, to }) => {
    if (!to || !candidate)
      return socket.emit("error", "Missing candidate or target");
    console.log(`ICE candidate from ${socket.id} to ${to}`);
    io.to(to).emit("ice-candidate", { candidate, from: socket.id });
  });

  socket.on("offer", ({ offer, to }) => {
    if (!to || !offer) return socket.emit("error", "Missing offer or target");
    console.log(`Offer from ${socket.id} to ${to}`);
    io.to(to).emit("offer", { offer, from: socket.id });
  });

  socket.on("answer", ({ answer, to }) => {
    if (!to || !answer) return socket.emit("error", "Missing answer or target");
    console.log(`Answer from ${socket.id} to ${to}`);
    io.to(to).emit("answer", { answer, from: socket.id });
  });

  // send Message

  socket.on("sendMessage", (msgObject) => {
    console.log("Message Received from ", socket.id, " Message: ", msgObject);
    console.log("SenderId: ", msgObject.sender_id);
    console.log("Room: ", msgObject.room_id);

    let roomObject = getRoom(msgObject.room_id);
    console.log("Room obj: ",roomObject);

    let {user_name, message, time, sender_id} = msgObject;

    allMessages.push({
      user_name, message, time, sender_id
    });
    // let isMine = sender_id == socket.id ? true : false;

    roomObject.messages.push({user_name,sender_id, message, time});
    // roomObject.messages.push({user_name,sender_id, message, time,isMine});

    console.log("ALl messages: ", allMessages);
    console.log(roomObject.messages);

    io.to(msgObject.room_id).emit("receivedMessage", msgObject);
   
    // io.to(msgObject.room_id).emit("receivedMessage", roomObject.messages); //try in home here ----------------

  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    for (const roomId in rooms) {
      if (rooms[roomId].has(socket.id)) {
        rooms[roomId].delete(socket.id);
        socket.to(roomId).emit("user-disconnected", socket.id);
        if (rooms[roomId].size === 0) {
          delete rooms[roomId]; // Clean up empty rooms
        }
      }
    }
  });
});

async function getUserDetails() {
  let query = "select * from users ;";

  try {
    let userDetails = await new Promise((resolve, reject) => {
      dbConnection.query(query, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });

    console.log(userDetails);

    return userDetails;
  } catch (err) {
    console.log("Error in gettting user data : \nInternal Server Error\n", err);
  }
}

server.listen(3002, () => {
  console.log(`Server running on port 3002`);
});


function checkTheRoomToId(roomId) {

  let exists = false;
  for (let room of allRoomDetails) {
    if (room.roomId == roomId) {
      exists = true;
      break;
    }
  }

  return exists;
}



function getRoom(roomID){
  for(let room of allRoomDetails){
    console.log("Room: ",room)
    if(room.roomId == roomID){
      return room;
    }
  }
}