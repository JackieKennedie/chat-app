import { useState, useEffect, useRef } from "react";

const RoomList = ({socket, roomJoined, setRoomJoined}) => {
    const [rooms, setRooms] = useState([]);
    const [roomTemp, setRoomTemp] = useState("");
    const [roomSelected, setRoomSelected] = useState("");
    const [roomAddPrompt, setRoomAddPrompt] = useState(false);

    const addRoom = () => {
        socket.emit("check-room-exists-user-to-server", {"id": socket.id, "roomId": roomTemp })
        if(roomTemp === "") {
            return;
        } else {
            console.log(`added ${roomTemp}`);
        }
    };
    const addRoomCancel = () => {
        setRoomAddPrompt(false);
    };

    const changeRoom = (e) => {
        const roomId = e.target.name;
        if(roomId === roomJoined) {
            return;
        }
        socket.emit("room-change-user-to-server", {"id": socket.id, "roomId": roomId });
        setRoomJoined(roomId);
        setRoomSelected(roomId);
    };

    const initialized = useRef(false);
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            socket.on("room-exists-server-to-user", (data) => {
                setRoomAddPrompt(false);
                setRooms((old) => {return [...old, data.roomId]});                
            });
            socket.on("room-not-exists-server-to-user", () => {
                console.log("wah 2");
            }); 
        }
    }, [socket]);

    return (
    <ul className="col-span-1 m-4 mr-3">
        {rooms ? rooms.map((id, i) => (
            <li 
                className={`${(id === roomSelected && id !== "")  ? `bg-blue-300` : `bg-white`} 
                    border-black border-2 m-1 w-full p-2 line-clamp-1 truncate leading-10`}
                key={i}>
                <p>
                    {id}
                </p>
                <button
                    className="bg-white border-black border-2 w-full p-2 line-clamp-1 hover:bg-slate-400"
                    name={id}
                    onClick={changeRoom}>
                    join
                </button>
            </li>)
            ) : 
            <li>Loading</li>
        }
        {roomAddPrompt ? 
            <form
                onSubmit={() => setRoomAddPrompt(false)}
                className="grid grid-cols-2">
                <input
                    autoFocus
                    className="bg-white border-black border-2 m-1 w-full p-1 line-clamp-1 col-span-2" 
                    onChange={(e) => setRoomTemp(e.target.value.substring(0, 26)) }>
                </input>
                <button 
                    type="submit" 
                    onClick={addRoom}
                    className="bg-white border-black border-2 m-1 w-full p-1 line-clamp-1 hover:bg-slate-400 col-span-1">
                    add
                </button>
                <button 
                    type="submit" 
                    onClick={addRoomCancel}
                    className="bg-white border-black border-2 m-1 w-full p-2 line-clamp-1 hover:bg-slate-400 col-span-1">
                    cancel
                </button>
            </form> : 
            <button 
                className="bg-white border-black border-2 m-1 w-full p-2 text-center hover:bg-slate-400"
                onClick={() => setRoomAddPrompt(true)}>
                +
            </button>
        }
    </ul>
  );
};

export default RoomList;