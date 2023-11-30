import { socket } from "../socket.js";

import { useEffect, useState, useRef } from "react";

const MessageBox = ({username, roomJoined, setRoomJoined}) => {
    const [messageSend, setMessageSend] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [inputFieldChat, setInputFieldChat] = useState("");
    
    const chatbox = useRef();

    const inputHandle = (e) => {
        setMessageSend(e.target.value.substring(0, 500)); 
        setInputFieldChat(e.target.value.substring(0, 500));
    };
    
    const initialized = useRef(false);
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            socket.on("message-server-to-user", (data) => {
                setMessageList(old => [...old, data.message]);
                setMessageSend("");
            });
            socket.on("room-joined", (data) => {
                setMessageList([]);
                setMessageList(old => [...old, ...data.roomData.msgs]);
            });
            socket.on("room-joined-fail", (data) => {
                console.log("🙁");
            });
        }
    }, [socket]);
    
    useEffect(() => {
        chatbox.current.scrollTo(0, chatbox.current.scrollHeight);
    }, [messageList]);

    const sendMessage = () => {
        if(messageSend === "") {
            console.log("wahh");
        } else {
            socket.emit("message-user-to-server", { "message": messageSend, "id": socket.id, "roomId": roomJoined });
            setMessageList(old => [...old, {username: username, text: messageSend}]);
            setMessageSend("");
        }
    };
    return (
        <div className="col-span-4 flex flex-col h-[95vh] w-[95%] m-5">
            <ul 
            className="border-2 border-black p-2 m-1 bg-white w-full h-full center overflow-y-auto"
            ref={chatbox}>
            {messageList ? messageList.map((msg, i) => {
                return <li 
                key={i} 
                className="p-2 m-1 border-2 border-black break-words line-clamp-[6] leading-10 bg-blue-100">
                <b className="text-slate-900">{msg.username}</b><p>{msg.text}</p>
                </li>})
                : <li>not poop</li>}
            </ul>
            <form 
            onSubmit={(e) => {e.preventDefault(); setInputFieldChat("");}}
            className="justify-center w-full ms-10"
            >
            <input 
                className="border-2 border-black m-5 p-1 w-9/12 mr-2"
                onChange={inputHandle}
                value={inputFieldChat}
            />
            <button 
                type="submit" 
                onClick={sendMessage} 
                className="bg-blue-500 border-2 border-black px-4 py-2 rounded-full text-white hover:bg-blue-800">
                Send
            </button>
            </form>
        </div>
    );
}

export default MessageBox;