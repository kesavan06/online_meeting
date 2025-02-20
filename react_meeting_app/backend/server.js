const express = require("express");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");

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



const mysql = require("mysql2");


const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Deepa30"
})


connection.connect((err) => {
  err ? console.log("Can not connect with mysql") : console.log("Connect with mysql");
})



connection.query('CREATE DATABASE if not exists users_db ;', (err, data) => {
  if (err) {
    console.log("DB creation failed");
    return;
  }
  console.log("Successfully created db");
})

connection.end();




const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Deepa30",
  database: "users_db",
})



dbConnection.connect((err) => {
  if (err) {
    console.log("Erro connection to the database");
  }
  else {
    console.log("Connected to the database");
  }
})

let tableCreateQuery = "create table if not exists users(user_id smallint auto_increment primary key, user_name varchar(60) not null, unique_name varchar(100)  unique key not null ,password varchar(100) not null, user_key varchar(16)  unique key not null);";



dbConnection.query(tableCreateQuery, (err, result) => {
  if (err) {
    console.error('Error creating table:', err);
    return;
  }
  console.log('Table "users" created or already exists');
})



let allMessages = [];

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from Backend!" });
});


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
      })
    })

    if (check.length == 0) {
      res.status(201).send({ message: "Success", data: check });
    }
    else {
      res.status(201).send({ message: "Fail", data: check });
    }
  }
  catch (err) {
    res.status(500).send("Internal Error");
  }
})




app.post("/signUp", async(req, res) => {

  try {
    console.log("I came inside");
    let { user_name, password, unique_name, user_key } = req.body;
    console.log("Data1 : ", (user_name));
    console.log("Data2 : ", (password));
    console.log("Data3 : ", (unique_name));
    console.log("Data4 : ", (user_key));


    let query = "insert into users(user_name, unique_name ,password, user_key ) values(?,?,?, ?)";

    let insertUser = await new Promise((resolve, reject) => {
      dbConnection.query(query, [user_name, unique_name, password, user_key], (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      })
    })

    res.status(200).send({ message: "Success", data: "Successfully added" });

  }
  catch (err) {
    res.status(500).send({ message: "Failed", data: "Failed to add" });

  }
})




app.get("/secretKey", async (req, res) => {

  try {
      let users = await getUserDetails();

      if (users.length > 0) {
          res.status(201).send({ data: users });
      }
      else {
          res.status(501).send({ data: "No users found" });
      }

  }
  catch (err) {
      console.log("Err in getting user detail: ",err);
      res.status(500).send({data:"Internal Server error"});
  }
  
})












const rooms = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle room creation
  socket.on("create-room", (roomId) => {
    console.log(`Room created: ${roomId}`);
    if (!rooms[roomId]) {
      console.log("roomId: ", roomId);
      rooms[roomId] = new Set(); // Create a new room
    }
    socket.emit("room-created", roomId); // Notify the client that the room was created
  });

  // Handle joining an existing room
  socket.on("join-existing-room", (roomId) => {
    console.log(`User attempting to join room: ${roomId}`);
    if (rooms[roomId]) {
      socket.emit("room-exists", { exists: true, roomId }); // Notify the client that the room exists
    } else {
      socket.emit("room-exists", { exists: false }); // Notify the client that the room does not exist
    }
  });

  // Handle joining a room
  socket.on("join-room", (roomId, userId) => {
    console.log(`User ${userId} joined room ${roomId}`);
    rooms[roomId].add(userId); // Add the user to the room
    socket.join(roomId); // Join the socket room
    socket.to(roomId).emit("user-connected", userId);

    socket.on("ice-candidate", ({ candidate, to }) => {
      socket.to(roomId).emit("ice-candidate", {
        candidate,
        from: socket.id,
      });
    });

    socket.on("offer", ({ offer, to }) => {
      socket.to(roomId).emit("offer", {
        offer,
        from: socket.id,
      });
    });

    socket.on("answer", ({ answer, to }) => {
      socket.to(roomId).emit("answer", {
        answer,
        from: socket.id,
      });
    });

    // send Message

    socket.on("sendMessage", (msgObject) => {
      console.log("Message Received from ", socket.id, " Message: ", msgObject);
      console.log("SenderId: ", msgObject.sender_id);
      console.log("Room: ", msgObject.room_id);

      allMessages.push({ user_name: msgObject.user_name, message: msgObject.message });
      console.log("ALl messages: ", allMessages);

      io.to(msgObject.room_id).emit("receivedMessage", (msgObject));
    })





    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected from room ${roomId}`);
      rooms[roomId].delete(userId); // Remove the user from the room
      socket.to(roomId).emit("user-disconnected", userId); // Notify other users
    });
  });
});




async function getUserDetails() {

  let query = "select * from users ;";

  try {

      let userDetails = await new Promise((resolve, reject) => {
          dbConnection.query((query), (err, data) => {
              if (err) {
                  return reject(err);
              }
              resolve(data);
          })
      })

      console.log(userDetails);

      return userDetails;
  }
  catch (err) {
      console.log("Error in gettting user data : \nInternal Server Error\n", err)
  }
}
















server.listen(3002, () => {
  console.log(`Server running on port 3002`);
});
