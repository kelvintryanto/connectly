import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import socket from "..";
import { IonIcon } from "@ionic/react";
import { chevronDownOutline, trashBinOutline, notificationsOffOutline, eyeOffOutline, archiveOutline, pinOutline, exitOutline, micOutline, sendOutline, sunnyOutline, moonOutline } from "ionicons/icons";
import { motion, AnimatePresence } from "framer-motion";
import { themeContext } from "../src/context/ThemeContext";

export default function HomePage({ base_url }) {
  const [chatState, setChatState] = useState({
    roomchat: [], // Daftar semua room chat
    chat: [], // Daftar pesan dalam room aktif
    room: 0, // ID room aktif
    message: "", // Pesan yang sedang diketik user
    email: "", // Email user yang sedang login
    user: "", // Username user yang sedang login
    ai: "", // Respons AI
    image: "",
  });
  const [roomchat, setRoomChat] = useState([]);
  const [chat, setChat] = useState([]);
  const [room, setRoom] = useState(0);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const navigate = useNavigate();
  const { currentTheme, setCurrentTheme, theme } = useContext(themeContext);
  // const []

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${base_url}/find`, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
      setChatState((prev) => ({ ...prev, user: data.username }));
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchRoomChat = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${base_url}/roomchat`, {
        headers: { Authorization: `Bearer ${localStorage.access_token}` },
      });

      setEmail(data.data[0].email);

      setChatState((prev) => ({
        ...prev,
        email: data.data[0].email, // perbarui email
        roomchat: data.data[0].RoomChats, // perbarui daftar roomchat
      }));
    } catch (error) {
      console.error("Error fetching room chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  async function fetchuser() {
    try {
      const data = await axios.get(`${base_url}/find`, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
      // console.log(data);

      setUser(data.data.username);
      setChatState((prev) => ({
        ...prev,
        user: data.data.username,
      }));
      // console.log(data.data.image.image);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchRoomChat();
    fetchuser();
  }, []);

  useEffect(() => {
    fetchuser();

    // console.log(socket);
    socket.connect();

    socket.emit("userData", email);
    // socket.on("ragagantenk", (event) => {
    // });

    socket.on("ChatUpdate", (event) => {
      setChatState((prev) => ({
        ...prev,
        chat: [...prev.chat, event],
        message: "",
      }));
    });

    // socket.emit("userData", { username: "test_user" });

    return () => {
      socket.off("userData");
      socket.off("ChatUpdate");
      socket.disconnect();
    };
  }, [chatState.email]);

  async function handleDetailClick(roomId) {
    try {
      // Leave the previous room if it exists
      if (room) {
        //udah diperanh dipencet open
        socket.emit("leave_room", `room${room}`);
        console.log(`Left room: room${room}`);
      }

      // Fetch the chat data for the new room
      const { data } = await axios.get(`${base_url}/roomchat/${roomId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });

      // Update room state and join the new room
      setRoom(roomId);
      setChat(data.data.Chats);
      socket.emit("join_room", `room${roomId}`);
      console.log(`Joined room: room${roomId}`);
      // console.log(data.data.Chats);

      // Optional: Add AI message or other actions for the new room
      // setChat((prev) => [...prev, { id: Date.now(), sender: "🤖", content: data.ai }]);
      // setAi("");
      setChatState((prev) => ({
        ...prev,
        room: roomId,
        chat: data.data.Chats,
        ai: data.ai,
      }));
      setActiveRoom(roomId);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchChat() {
    const { data } = await axios.get(`${base_url}/roomchat/${room}`, {
      headers: {
        Authorization: `Bearer ${localStorage.access_token}`,
      },
    });

    setChatState((prev) => ({
      ...prev,
      chat: data.data.Chats,
    }));
  }

  async function handleClear() {
    try {
      const { data } = await axios.delete(`${base_url}/clear/${room}`, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
      fetchChat();
      setChatState((prev) => ({
        ...prev,
        chat: [...prev.chat, { id: Date.now(), sender: "🤖", content: data.ai }],
      }));
    } catch (error) {
      showToast(error.response?.data?.message || "Error clearing chat", "error");
    }
  }
  async function handleLeave(roomId) {
    try {
      const { data } = await axios.delete(`${base_url}/roomchat/leave/${roomId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });

      // Reset semua state yg berhubungan dgn room
      setRoom(0);
      setChat([]);
      setActiveRoom(null);
      setChatState((prev) => ({
        ...prev,
        room: 0,
        chat: [],
        message: "",
      }));

      // Emit leave room ke socket
      socket.emit("leave_room", `room${roomId}`);

      fetchRoomChat();

      showToast("Berhasil keluar dari room! 👋", "success");
    } catch (error) {
      console.log(error);
      showToast("Gagal keluar dari room 😢", "error");
    }
  }

  const showToast = (message, type = "success") => {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      style: {
        background: type === "success" ? "#34D399" : "#EF4444",
        color: "#000000",
      },
    }).showToast();
  };

  const handleMessage = async (e) => {
    e.preventDefault();
    if (!chatState.message.trim()) return;

    try {
      const { data } = await axios.post(
        `${base_url}/chats/${room}`,
        { content: chatState.message },
        {
          headers: {
            Authorization: `Bearer ${localStorage.access_token}`,
          },
        }
      );
    } catch (error) {
      showToast(error.response?.data?.message || "Error sending message", "error");
    }
  };

  const handleDropdownClick = (e, roomId) => {
    e.stopPropagation();
    setOpenMenu(openMenu === roomId ? null : roomId);
  };

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === "light" ? "dark" : "light");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`min-h-screen ${theme[currentTheme].bgColor}`}>
      <div className="container mx-auto pt-6 px-6">
        <div className="flex h-[calc(100vh-88px)]">
          <motion.aside initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 100 }} className={`w-1/4 bg-gradient-to-br ${theme[currentTheme].asideBg} backdrop-blur-sm p-4 flex flex-col shadow-sm rounded-l-lg border-r border-blue-200`}>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-800">Welcome, {chatState.user}!</h1>
              <div className="flex space-x-2">
                <Link to="/list" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded hover:from-blue-600 hover:to-purple-700 transition duration-300 text-center">
                  Add Room
                </Link>
              </div>
            </div>
            <div
              className="mb-4 h-60 rounded-lg shadow-md"
              style={{
                backgroundImage: "url('https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGo0ZDRhbnIwaGRxdnB6aTVvbDhsbzV1Mnl4a3QybW9yNDJ2d2tmZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/GRPy8MKag9U1U88hzY/giphy.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}></div>
            <ul className="flex-1 overflow-y-auto">
              <AnimatePresence>
                {chatState.roomchat.map((el) => (
                  <motion.li
                    key={el.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ scale: 1.02 }}
                    className={`group relative p-2 hover:bg-gray-300 rounded flex justify-between items-center transition duration-300 cursor-pointer
                                        ${activeRoom === el.id ? "bg-blue-200" : ""}`}
                    onClick={() => handleDetailClick(el.id)}>
                    <div className="flex items-center flex-1">
                      <img src={el.image} alt="Profile" className="w-10 h-10 rounded-full flex-shrink-0 object-cover shadow-md" />
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-800">{el.name}</h3>
                        <p className="text-sm text-gray-600">member chat:</p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </motion.aside>

          <motion.main initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 100 }} className="flex-1 bg-gradient-to-br from-white/90 to-purple-50/90 backdrop-blur-sm p-4 flex flex-col shadow-sm rounded-r-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{chatState.room ? `Chat in Room: ${chatState.room}` : "No Room Selected"}</h2>
              <div className="flex items-center gap-2">
                {activeRoom && (
                  <div className="relative">
                    <button onClick={(e) => handleDropdownClick(e, activeRoom)} className="p-2 rounded-full hover:bg-gray-200/20 transition-colors">
                      <IonIcon icon={chevronDownOutline} className={`w-6 h-6 text-gray-500 hover:text-gray-700 transition-transform duration-200 ${openMenu === activeRoom ? "rotate-180" : ""}`} />
                    </button>

                    {openMenu === activeRoom && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg z-50 py-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClear();
                            setOpenMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                          <IonIcon icon={trashBinOutline} />
                          Clear Chat
                        </button>
                        <hr className="my-1" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLeave(activeRoom);
                            setOpenMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2">
                          <IonIcon icon={exitOutline} />
                          Leave Room
                        </button>
                      </div>
                    )}
                  </div>
                )}
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200/20 transition-colors">
                  <IonIcon icon={currentTheme === "light" ? moonOutline : sunnyOutline} className="w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors" />
                </button>
              </div>
            </div>

            <div className={`flex-1 overflow-y-auto bg-gradient-to-br ${theme[currentTheme].chatBg} p-4 rounded-lg shadow-inner`}>
              <AnimatePresence>
                {chatState.chat.length === 0 ? (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500 text-center">
                    No messages yet.
                  </motion.p>
                ) : (
                  // logika chat kalau dia sendernya sama dengan user, maka dikanan, kalau tidak dikiri
                  // kalo sendernya bukan user, maka tampilkan image atau inisial namanya
                  chatState.chat.map((el) => (
                    <motion.div key={el.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 500 }} className={`mb-4 flex ${chatState.user === el.sender ? "justify-end" : "justify-start"}`}>
                      {/* Tampilkan gambar profile atau inisial klo bukan user yg login */}
                      {chatState.user !== el.sender && (
                        <div className="mr-2 flex-shrink-0">
                          <img
                            src={
                              el.User?.image ||
                              `https://ui-avatars.com/api/?name=${
                                // Klo nama ada spasi (lebih dari 1 kata), pake nama lengkap
                                // Klo cuma 1 kata, ambil huruf pertama aja
                                el.sender.includes(" ") ? el.sender : el.sender.charAt(0)
                              }&background=random`
                            }
                            alt={el.sender}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className={`${chatState.user === el.sender ? "bg-green-200" : "bg-gray-200"} p-3 rounded-lg max-w-full w-fit break-words shadow-md`}>
                          {/* Tampilkan nama sender klo bukan user yg login */}
                          {chatState.user !== el.sender && <p className="text-xs font-medium text-gray-600 mb-1">{el.sender}</p>}
                          <p className="text-sm text-gray-800">{el.content}</p>
                        </div>
                      </div>
                      )}
                      <div>
                        <div className={`${chatState.user === el.sender ? "bg-green-200" : "bg-gray-200"} p-3 rounded-lg max-w-full w-fit break-words shadow-md`}>
                          {chatState.user !== el.sender && <p className="text-xs font-medium text-gray-600 mb-1">{el.sender}</p>}
                          <p className="text-sm text-gray-800">{el.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
            {/* form input message */}
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-4">
              <motion.form whileTap={{ scale: 0.99 }} className="flex gap-2" onSubmit={(e) => handleMessage(e)}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={chatState.message}
                  className="flex-1 p-2 border border-blue-200 rounded-full focus:outline-none focus:ring focus:border-blue-400 bg-white/90"
                  onChange={(e) => {
                    setChatState((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }));
                  }}
                />
                <button type="button" className="bg-gradient-to-r from-blue-400 to-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:from-blue-500 hover:to-purple-600 transition duration-300">
                  <IonIcon icon={micOutline} className="w-6 h-6" />
                </button>
                <button type="submit" className="bg-gradient-to-r from-blue-400 to-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:from-blue-500 hover:to-purple-600 transition duration-300">
                  <IonIcon icon={sendOutline} className="w-6 h-6" />
                </button>
              </motion.form>
            </motion.div>
          </motion.main>
        </div>
      </div>
    </motion.div>
  );
}
