import { socket } from "./socket.js";

import { useState } from "react";

import { Login, MessageBox, RoomList } from "./components/index.js"

const App = () => {
  const [roomJoined, setRoomJoined] = useState("");

  const username = "wowowow";

  return (
    <div className="grid grid-cols-5">
      <RoomList 
        socket={socket}
        roomJoined={roomJoined} 
        setRoomJoined={setRoomJoined}/>
      <MessageBox 
        socket={socket}
        username={username}
        roomJoined={roomJoined} 
        setRoomJoined={setRoomJoined}/>
    </div>
  );
}

export default App

/*
*/
