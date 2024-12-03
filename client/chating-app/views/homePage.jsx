import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { io } from "socket.io-client";
import Toastify from "toastify-js";
import socket from "..";
export default function HomePage() {
  const [roomchat, setRoomChat] = useState([]);
  const [chat, setChat] = useState([]);
  const [room, setRoom] = useState(0);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ai, setAi] = useState("");
  const navigate = useNavigate();

  async function fetchroomchat() {
    try {
      setIsLoading(true);
      const { data } = await axios.get("http://localhost:3000/roomchat", {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
      // console.log(data);

      setEmail(data.data[0].email);
      setRoomChat(data.data[0].RoomChats);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchuser() {
    try {
      const data = await axios.get("http://localhost:3000/find", {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
      setUser(data.data.username);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchroomchat();
  }, []);

  useEffect(() => {
    if (email) {
      fetchuser();

      // console.log(socket);
      socket.connect();

      socket.emit("userData", email);
      socket.on("ragagantenk", (event) => {
        // console.log(event, "<< event");
      });

      socket.on("ChatUpdate", (event) => {
        setChat((prev) => [...prev, event]);
        setMessage("");
      });

      // socket.emit("userData", { username: "test_user" });

      return () => {
        socket.off("userData");
        socket.off("ChatUpdate");
        socket.disconnect();
      };
    }
  }, [email]);

  async function handleDetailClick(roomId) {
    try {
      // Leave the previous room if it exists
      if (room) { //udah diperanh dipencet open
        socket.emit("leave_room", `room${room}`);
        console.log(`Left room: room${room}`);
      }

      // Fetch the chat data for the new room
      const { data } = await axios.get(`http://localhost:3000/roomchat/${roomId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });

      // Update room state and join the new room
      setRoom(roomId);
      setChat(data.data.Chats);
      socket.emit("join_room", `room${roomId}`);
      console.log(`Joined room: room${roomId}`);

      // Optional: Add AI message or other actions for the new room
      setChat((prev) => [...prev, { id: Date.now(), sender: "🤖", content: data.ai }]);
      setAi("");
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchChat() {
    const { data } = await axios.get(`http://localhost:3000/roomchat/${room}`, {
      headers: {
        Authorization: `Bearer ${localStorage.access_token}`,
      },
    });

    setChat(data.data.Chats);
  }
  async function handleClear() {
    try {
      const { data } = await axios.delete(`http://localhost:3000/clear/${room}`, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
      fetchChat();
      setChat((prev) => [...prev, { id: Date.now(), sender: "🤖", content: data.ai }]);
    } catch (error) {
      Toastify({
        text: error.response.data.message,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#34D399",
          color: "#000000",
        },
        onClick: function () {}, // Callback after click
      }).showToast();
    }
  }
  async function handleLeave(roomId) {
    try {
      const { data } = await axios.delete(`http://localhost:3000/roomchat/leave/${roomId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
      fetchroomchat();

      Toastify({
        text: `Success Leave Chat`,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#34D399",
          color: "#000000",
        },
        onClick: function () {}, // Callback after click
      }).showToast();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleMessage(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `http://localhost:3000/chats/${room}`,
        { content: message },
        {
          headers: {
            Authorization: `Bearer ${localStorage.access_token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="h-screen bg-gray-100">
        {/* Wrapper */}
        <div className="flex h-full">
          {/* Sidebar */}
          <aside className="w-1/4 bg-gray-200 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">Welcome </h1>
              <div className="flex space-x-2">
                <Link to="/list" className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">
                  Join Room
                </Link>
              </div>
            </div>
            <div
              className="mb-4 h-60 rounded-lg"
              style={{
                backgroundImage: "url('https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGo0ZDRhbnIwaGRxdnB6aTVvbDhsbzV1Mnl4a3QybW9yNDJ2d2tmZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/GRPy8MKag9U1U88hzY/giphy.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <ul className="flex-1 overflow-y-auto">
              {roomchat.map((el) => (
                <li key={el.id} className="p-2 hover:bg-gray-300 rounded cursor-pointer flex justify-between items-center">
                  <div className="flex items-center">
                    <img src={el.image} alt="Profile" className="w-10 h-10 rounded-full flex-shrink-0 object-cover" />
                    <div className="ml-3">
                      <h3 className="font-semibold">{el.name}</h3>
                      <p className="text-sm text-gray-600">member chat:</p>
                    </div>
                  </div>
                  <button onClick={() => handleDetailClick(el.id)} className="bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded hover:bg-gray-400">
                    Open
                  </button>
                  <button onClick={() => handleLeave(el.id)} className="bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-200">
                    Leave
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Chat Area */}
          <main className="flex flex-1 bg-white p-4 flex flex-col">
            {/* Header dengan tombol Clear Chat */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{room ? `Chat in Room: ${room}` : "No Room Selected"}</h2>
              <button
                onClick={handleClear} // Clear semua pesan
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Clear Chat
              </button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-y-auto bg-gray-100 p-4 rounded-lg">
              {chat.length === 0 ? (
                <p className="text-gray-500 text-center">No messages yet.</p>
              ) : (
                chat.map((el) => (
                  <div key={el.id} className={`mb-4 flex ${user === el.sender ? "justify-end" : "justify-start"}`}>
                    <div>
                      <div className={`${user === el.sender ? "bg-blue-200 text-right" : "bg-green-100 text-left"} text-xs text-gray-800 p-1 rounded-t-lg w-fit mb-1`}>{user === el.sender ? `You` : el.sender}</div>
                      <div className={`${user === el.sender ? "bg-green-200" : "bg-gray-200"} p-3 rounded-lg max-w-full w-fit break-words`}>
                        <p className="text-sm text-gray-800">{el.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="mt-4">
              <form className="flex" onSubmit={handleMessage}>
                <input type="text" placeholder="Type a message..." value={message} className="flex-1 p-2 border rounded-l focus:outline-none focus:ring focus:border-blue-300" onChange={(e) => setMessage(e.target.value)} />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r">
                  Send
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
