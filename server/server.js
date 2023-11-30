const express = require("express");
const app = express();
const { Server } = require("socket.io"); 
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const cors = require("cors");
const env = require("dotenv").config();

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
    console.log(`Listening on Port ${port}`)
});

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

const db = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: process.env.SQL_PASSWORD,
    database: "userDB",
});

const username = "p";
const username2 = "g";

const roomData = {
    "a": {
        msgs: [{username: username, text: "a"}, 
                {username: username2, text: "b"},
                {username: username, text: "c"},
                {username: username2, text: "d"},
                {username: username, text: "e"},]
    },
    "test": {
        msgs: [{username: username, text: "f"}, 
                {username: username2, text: "g"},
                {username: username, text: "h"},
                {username: username2, text: "i"},
                {username: username, text: "j"},
                {username: username, text: "k"}, 
                {username: username2, text: "l"},
                {username: username, text: "m"},
                {username: username2, text: "n"},
                {username: username, text: "o"},]
    }
};

app.use(cors());
app.use(express.json());

app.post("/create-user", async (req, res) => { 
    const user = req.body.username;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    db.getConnection(async (err, con) => {
        if(err) throw (err);

        const sqlSearch = "SELECT * FROM userTable WHERE username = ?";
        const searchQuery = mysql.format(sqlSearch, [user]);

        const sqlInsert = "INSERT INTO userTable VALUES(0, ?, ?)";
        const insertQuery = mysql.format(sqlInsert, [user, hashedPassword]);

        await con.query(searchQuery, async (err, result) => {
            if(err) throw (err);

            console.log("-----> Search Results");
            console.log(result.length);

            if(result.length !== 0) {
                con.release();
                console.log("-----> User Already Exists");
                res.sendStatus(409);
            } else {
                await con.query(insertQuery, (err, result) => {
                    con.release();
                    if (err) throw (err);
                    console.log("-----> Created New User");
                    console.log(result.insertId);
                    res.sendStatus(201);
                });
            }
        });
    });
});

app.post("/login", (req, res) => {
    const user = req.body.username;
    const password = req.body.password;

    db.getConnection(async (err, con) => {
        if(err) throw (err);
        const sqlSearch = "SELECT * FROM userTable WHERE username = ?";
        const searchQuery = mysql.format(sqlSearch, [user]);

        await con.query(searchQuery, async (err, result) => {
            con.release();
            if(err) throw (err);

            if(result.length === 0) {
                console.log("-----> User does not exist");
                res.sendStatus(404);
            } else {
                const hashedPassword = result[0].password;

                if(await bcrypt.compare(password, hashedPassword)) {
                    console.log("Login Sucess");
                    res.send({res: `${user} logged in`});
                } else {
                    console.log("Inoccrect Password");
                    res.send("Incorrect Password");
                }
            }
        });
    });
});

io.on("connection", (socket) => {
    socket.on("message-user-to-server", (data) => {
        socket.broadcast.to(data.roomId).emit("message-server-to-user", data);
        console.log(data.message);
    });

    socket.on("room-change-user-to-server", (data) => {
        socket.join(data.roomId);
        socket.emit("room-joined", {messageJoin: `joined ${data.roomId}`, roomData: roomData[data.roomId]});
        //socket.to(data.roomId).emit("message-server-to-user", {"message": `joined ${data.roomId}`});
    });
    socket.on("check-room-exists-user-to-server", (data) => {
        if(roomData[data.roomId] === undefined){
            socket.emit("room-not-exists-server-to-user");
            return;
        }
        socket.emit("room-exists-server-to-user", data);
    });
});
