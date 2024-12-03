import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import io from "socket.io-client";
import Toastify from "toastify-js";
import { IonIcon } from '@ionic/react';
import { 
    chevronDownOutline,
    trashBinOutline,
    notificationsOffOutline,
    eyeOffOutline,
    archiveOutline,
    pinOutline,
    exitOutline
} from 'ionicons/icons';
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const [chatState, setChatState] = useState({
    roomchat: [],
    chat: [],
    room: 0,
    message: '',
    email: '',
    user: '',
    ai: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("https://server.ragaram.site/find", {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        }
      });
      setChatState(prev => ({...prev, user: data.username}));
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchRoomChat = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get("https://server.ragaram.site/roomchat", {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        }
      });
      
      setChatState(prev => ({
        ...prev,
        email: data.data[0].email,
        roomchat: data.data[0].RoomChats
      }));
    } catch (error) {
      console.error('Error fetching room chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomChat();
  }, []);

  useEffect(() => {
    if (chatState.email) {
      fetchUser();
      const socket = io.connect("https://server.ragaram.site");

      socket.on("connect", () => {
        socket.emit("userData", chatState.email);
        
        socket.on("ChatUpdate", (event) => {
          setChatState(prev => ({
            ...prev,
            chat: [...prev.chat, event],
            message: ''
          }));
        });
      });

      return () => socket.disconnect();
    }
  }, [chatState.email]);

  async function handleDetailClick(roomId) {
    try {
      const { data } = await axios.get(`https://server.ragaram.site/roomchat/${roomId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
      setChatState(prev => ({
        ...prev,
        room: roomId,
        chat: data.data.Chats,
        ai: data.ai
      }));
      setActiveRoom(roomId);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchChat() {
    const { data } = await axios.get(`https://server.ragaram.site/roomchat/${chatState.room}`, {
      headers: {
        Authorization: `Bearer ${localStorage.access_token}`,
      },
    });

    setChatState(prev => ({
      ...prev,
      chat: data.data.Chats
    }));
  }

  async function handleClear() {
    try {
      const { data } = await axios.delete(`https://server.ragaram.site/clear/${chatState.room}`, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
      fetchChat();
      setChatState(prev => ({
        ...prev,
        chat: [...prev.chat, { id: Date.now(), sender: "🤖", content: data.ai }]
      }));
    } catch (error) {
      showToast(error.response?.data?.message || 'Error clearing chat', 'error');
    }
  }
  async function handleLeave(roomId) {
    try {
      const { data } = await axios.delete(`https://server.ragaram.site/roomchat/leave/${roomId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
      fetchRoomChat();
    } catch (error) {
      console.log(error);

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

  const showToast = (message, type = 'success') => {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      style: {
        background: type === 'success' ? "#34D399" : "#EF4444",
        color: "#000000",
      }
    }).showToast();
  };

  const handleMessage = async (e) => {
    e.preventDefault();
    if (!chatState.message.trim()) return;
    
    try {
      await axios.post(
        `https://server.ragaram.site/chats/${chatState.room}`,
        { content: chatState.message },
        {
          headers: {
            Authorization: `Bearer ${localStorage.access_token}`,
          }
        }
      );
    } catch (error) {
      showToast(error.response?.data?.message || 'Error sending message', 'error');
    }
  };

  const handleDropdownClick = (e, roomId) => {
    e.stopPropagation();
    setOpenMenu(openMenu === roomId ? null : roomId);
  };

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100"
    >
        <div className="container mx-auto pt-6 px-6">
            <div className="flex h-[calc(100vh-88px)]">
                <motion.aside 
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="w-1/4 bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-sm p-4 flex flex-col shadow-sm rounded-l-lg border-r border-blue-200"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">Welcome, {chatState.user}!</h1>
                        <div className="flex space-x-2">
                            <Link to="/list" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full hover:from-blue-600 hover:to-purple-700 transition duration-300">
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
                                        ${activeRoom === el.id ? 'bg-blue-200' : ''}`}
                                    onClick={() => handleDetailClick(el.id)}
                                >
                                    <div className="flex items-center flex-1">
                                        <img src={el.image} alt="Profile" className="w-10 h-10 rounded-full flex-shrink-0 object-cover shadow-md" />
                                        <div className="ml-3">
                                            <h3 className="font-semibold text-gray-800">{el.name}</h3>
                                            <p className="text-sm text-gray-600">member chat:</p>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={(e) => handleDropdownClick(e, el.id)}
                                        className="p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    >
                                        <IonIcon 
                                            icon={chevronDownOutline} 
                                            className={`text-gray-600 transition-transform duration-200 ${openMenu === el.id ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {openMenu === el.id && (
                                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg z-50 py-1">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleClear();
                                                    setOpenMenu(null);
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                            >
                                                <IonIcon icon={trashBinOutline} />
                                                Clear Chat
                                            </button>
                                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                                                <IonIcon icon={notificationsOffOutline} />
                                                Mute
                                            </button>
                                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                                                <IonIcon icon={eyeOffOutline} />
                                                Hide Chat
                                            </button>
                                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                                                <IonIcon icon={archiveOutline} />
                                                Archive
                                            </button>
                                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                                                <IonIcon icon={pinOutline} />
                                                Pin
                                            </button>
                                            <hr className="my-1" />
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLeave(el.id);
                                                    setOpenMenu(null);
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                                            >
                                                <IonIcon icon={exitOutline} />
                                                Leave Room
                                            </button>
                                        </div>
                                    )}
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </ul>
                </motion.aside>

                <motion.main 
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="flex-1 bg-gradient-to-br from-white/90 to-purple-50/90 backdrop-blur-sm p-4 flex flex-col shadow-sm rounded-r-lg"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {chatState.room ? `Chat in Room: ${chatState.room}` : "No Room Selected"}
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-100/70 to-purple-100/70 p-4 rounded-lg shadow-inner">
                        <AnimatePresence>
                            {chatState.chat.length === 0 ? (
                                <motion.p 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-gray-500 text-center"
                                >
                                    No messages yet.
                                </motion.p>
                            ) : (
                                chatState.chat.map((el) => (
                                    <motion.div 
                                        key={el.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ type: "spring", stiffness: 500 }}
                                        className={`mb-4 flex ${chatState.user === el.sender ? "justify-end" : "justify-start"}`}
                                    >
                                        <div>
                                            <div className={`${chatState.user === el.sender ? "bg-blue-200 text-right" : "bg-green-100 text-left"} text-xs text-gray-800 p-1 rounded-t-lg w-fit mb-1`}>
                                                {chatState.user === el.sender ? `You` : el.sender}
                                            </div>
                                            <div className={`${chatState.user === el.sender ? "bg-green-200" : "bg-gray-200"} p-3 rounded-lg max-w-full w-fit break-words shadow-md`}>
                                                <p className="text-sm text-gray-800">{el.content}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>

                    <motion.div 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="mt-4"
                    >
                        <motion.form 
                            whileTap={{ scale: 0.99 }}
                            className="flex" 
                            onSubmit={handleMessage}
                        >
                            <input 
                                type="text" 
                                placeholder="Type a message..." 
                                value={chatState.message} 
                                className="flex-1 p-2 border border-blue-200 rounded-l focus:outline-none focus:ring focus:border-blue-400 bg-white/90" 
                                onChange={(e) => {
                                    setChatState(prev => ({
                                        ...prev, 
                                        message: e.target.value
                                    }))
                                }} 
                            />
                            <button 
                                type="submit" 
                                className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-4 py-2 rounded-r hover:from-blue-500 hover:to-purple-600 transition duration-300"
                            >
                                Send
                            </button>
                        </motion.form>
                    </motion.div>
                </motion.main>
            </div>
        </div>
    </motion.div>
  );
}
