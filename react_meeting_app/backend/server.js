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
  password: "kesavan@123",
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
  password: "kesavan@123",
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

let meetingTQuery =
  "create table if not exists meetings(meeting_id smallint auto_increment primary key, user_name varchar(60) not null, room_name varchar(10) not null unique, host_id smallint unique, foreign key (host_id) references users(user_id)  );";

dbConnection.query(meetingTQuery, (err, result) => {
  if (err) {
    console.error("Error creating table:", err);
    return;
  }
  console.log('Table "meetings" created or already exists');
});

let meetingParicipantQuery =
  "create table if not exists meetings_participant(participant_id smallint auto_increment primary key, participant_name varchar(60) not null, user_id smallint null, room_name varchar(10) not null,foreign key (room_name) references meetings(room_name)  );";

dbConnection.query(meetingParicipantQuery, (err, result) => {
  if (err) {
    console.error("Error creating table:", err);
    return;
  }
  console.log('Table "meetings_participant" created or already exists');
});

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from Backend!" });
});

app.post("/allMessages", (req, res) => {
  //   console.log("In messObj post-R Details : ",allRoomDetails);
  let { roomId } = req.body;
  console.log("Room ID : ", roomId);
  let theRoom = getRoom(roomId);
  console.log("Selected Room : ", theRoom);

  if (theRoom != null) {
    res.status(201).send({ message: true, data: theRoom });
  } else {
    res.status(504).send({ message: false, data: theRoom });
  }
});

app.get("/unique", async (req, res) => {
  try {
    let allusers = await getUserDetails();
    // console.log("All users: ", allusers);
    console.log("Success got user");

    res.status(201).send({ message: true, data: allusers });
  } catch (err) {
    res.status(500).send({ message: false, data: "Internal Error" });
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

    let userNow = await getUserDetails();
    let user1;

    for(let user of userNow){
      if(user.user_name == user_name){
        user1 = user;
        break;
      }
    }

    console.log("User Now : ",user1);

    let user = { user_name, user_key , user_id: user1.user_id};

    res.status(200).send({ message: "Success", data: user });
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

app.post("/getP", async (req, res) => {
  try {
    let { roomId } = req.body;
    console.log("I am inside oarticipant : ", roomId);
    let participants = await getRoom(roomId);
    console.log("Participants : ", participants);

    let p = participants.participants;
    if (p != null && p != "") {
      res.status(201).send({ message: true, data: p });
    } else {
      res.status(501).send({ message: false, data: p });
    }
  } catch (err) {
    console.log("Error : \n", err);
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
  socket.on(
    "join-room",
    async (roomId, socketId, userNameShow, user_id, isHost) => {
      if (!roomId || !socketId)
        return socket.emit("error", "Invalid roomId or socketId");
      console.log(`User ${socketId} joining room ${roomId}`);
      // if (!rooms[roomId]) {
      //   rooms[roomId] = new Set(); // Auto-create room if it doesn’t exist (optional)
      // }

      let roomCheck = checkTheRoomToId(roomId); //true- exsists

      if (roomCheck) {
        // join room

        let roomObject = getRoom(roomId);
        let userId = user_id;
        roomObject.participants.push({
          socketId: socketId,
          name: userNameShow,
          user_id: userId,
          isHost: isHost,
        });
        // console.log("RoomObject: ", roomObject);
      } else {
        //create room
        let roomObject = {};
        roomObject.roomId = roomId;
        roomObject.participants = [
          {
            socketId: socketId,
            name: userNameShow,
            user_id: user_id,
            isHost: isHost,
          },
        ];
        console.log("Room PArticipant: ", roomObject.participants);
        roomObject.messages = [];
        allRoomDetails.push(roomObject);
      }

      socket.roomName = roomId;
      socket.userName = userNameShow;

      console.log("Is host or not: ", isHost);
      if (isHost) {
        let user = await addHost(roomId, userNameShow, user_id);
      } else {
        let joinedUser = await addPaticipants(roomId, userNameShow, user_id);
      }

      console.log("RoomDetails: ", allRoomDetails);

      rooms[roomId].add(socketId);
      socket.join(roomId);
      socket.to(roomId).emit("user-connected", socketId);
    }
  );

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

  socket.on("screen-offer", ({ offer, to }) => {
    io.to(to).emit("screen-offer", { offer, from: socket.id });
  });

  socket.on("screen-answer", ({ answer, to }) => {
    io.to(to).emit("screen-answer", { answer, from: socket.id });
  });

  socket.on("screen-candidate", ({ candidate, to }) => {
    io.to(to).emit("screen-candidate", { candidate, from: socket.id });
  });

  socket.on("screen-sharing-started", ({ roomId, userId }) => {
    socket.to(roomId).emit("screen-sharing-started", userId);
  });

  socket.on("screen-sharing-stopped", (roomId) => {
    socket.to(roomId).emit("screen-sharing-stopped", socket.id);
  });

  // send Message

  socket.on("sendMessage", (msgObject) => {
    console.log("Message Received from ", socket.id, " Message: ", msgObject);
    console.log("SenderId: ", msgObject.sender_id);
    console.log("Room: ", msgObject.room_id);

    console.log("Room Details : ", allMessages);
    let roomObject = getRoom(msgObject.room_id);
    console.log("Room obj: ", roomObject);

    let { user_name, message, time, sender_id } = msgObject;

    allMessages.push({
      user_name,
      message,
      time,
      sender_id,
    });
    roomObject.messages.push({ user_name, sender_id, message, time });

    console.log("ALl messages: ", allMessages);
    console.log(roomObject.messages);

    io.to(msgObject.room_id).emit("receivedMessage", msgObject);

  });

  socket.on("emojiSend", (emoji)=>{
    console.log("EMoji Received : ",emoji);

    io.to(socket.roomName).emit("showEmoji", {emoji, name : socket.userName});

  })


  socket.on("sendPoll",(poll)=>{
    console.log("User_name",poll.userName);
    console.log("room id: ",poll.room_Id);
    socket.to(poll.room_Id).emit("receivedPoll",poll);
    console.log("after recieve")
  })

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    console.log("Disconnected Room : ", socket.roomName);

    let roomExsist = false;
    console.log("All Room Details : ", allRoomDetails);
    console.log(
      "All Room Details has Room name: ",
      allRoomDetails.includes(socket.roomName)
    );

    if (socket.roomName != undefined) {
      deleteUser(socket.roomName, socket);
      removeParticipant(allRoomDetails, socket.roomName, socket.id);
    }

    for (const roomId in rooms) {
      if (rooms[roomId].has(socket.id)) {
        rooms[roomId].delete(socket.id);
        socket.to(roomId).emit("user-disconnected", socket.id);
        if (rooms[roomId].size === 0) {
          delete rooms[roomId];
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

function getRoom(roomID) {
  // console.log("All Rooms : I came inside -",allRoomDetails);
  for (let room of allRoomDetails) {
    console.log("Room: ", room);
    if (room.roomId == roomID) {
      return room;
    }
  }
}

async function deleteUser(roomName, socket) {
  console.log("User name : ", socket.userName);
  let dQuery;
  let room = getRoom(roomName);
  console.log("Room : ", room);

  let par = room.participants;
  let userDetail;
  for (let p of par) {
    if (socket.userName == p.name) {
      userDetail = p;
      break;
    }
  }

  console.log("Room Person  ", userDetail);

  if (userDetail.isHost) {
    dQuery = "delete from meetings where user_name =? and room_name=?";
  } else {
    dQuery =
      "delete from meetings_participant where participant_name =? and room_name=?";
  }

  try {
    let dataDelete = await new Promise((resolve, reject) => {
      dbConnection.query(dQuery, [userDetail.name, roomName], (err, data) => {
        if (err) {
          console.log("Error in deleteing : ", err);
          return reject(err);
        }
        resolve(data);
      });
    });

    console.log("Delete : ", dataDelete);
  } catch (err) {
    console.log("Error in gettting user data : \nInternal Server Error\n", err);
  }
}

async function addHost(room_name, user_name, user_id) {
  try {
    console.log("I am inside oarticipant : ", room_name, user_name, user_id);

    let insertQ =
      "insert into meetings(user_name, room_name ,host_id ) values(?,?,?)";

    let insertUser = await new Promise((resolve, reject) => {
      dbConnection.query(
        insertQ,
        [user_name, room_name, user_id],
        (err, data) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        }
      );
    });
    console.log("Success");

    return { message: true, data: "Insert success" };
  } catch (err) {
    return { message: false, data: ("Insert failed ", err) };
  }
}

async function addPaticipants(room_name, user_name, user_id) {
  try {
    console.log(
      "I am inside join particiapnt : ",
      room_name,
      user_name,
      user_id
    );

    console.log("User name : ", user_name, " User Id : ", user_id);

    if (typeof user_id === "object" && Object.keys(user_id).length == 0) {
      user_id = null;
      console.log("User id is null : ", user_id);
    }

    let insertQ =
      "insert into meetings_participant(participant_name, room_name ,user_id ) values(?,?,?)";

    let insertUser = await new Promise((resolve, reject) => {
      dbConnection.query(
        insertQ,
        [user_name, room_name, user_id],
        (err, data) => {
          if (err) {
            console.log("Error : \n", err);
            return reject(err);
          }
          resolve(data);
        }
      );
    });
    console.log("Join Success".insertUser);

    return { message: true, data: "Insert success" };
  } catch (err) {
    return { message: false, data: ("Insert failed ", err) };
  }
}

function removeParticipant(allRoomDetails, roomId, socketId) {
  // Find the room with the given roomId
  const room = allRoomDetails.find((room) => room.roomId === roomId);

  if (room) {
    // Find the index of the participant with the given socketId
    const participantIndex = room.participants.findIndex(
      (p) => p.socketId === socketId
    );

    if (participantIndex !== -1) {
      // Remove the participant
      room.participants.splice(participantIndex, 1);
      console.log(
        `Participant with socketId ${socketId} removed from room ${roomId}`
      );
      console.log("After remove: ", allRoomDetails[0].participants);
    } else {
      console.log(
        `Participant with socketId ${socketId} not found in room ${roomId}`
      );
    }
  } else {
    console.log(`Room with ID ${roomId} not found`);
  }
}
