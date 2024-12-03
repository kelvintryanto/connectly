import { useDispatch, useSelector } from "react-redux";
import { fetchAsync } from "../src/features/roomchat/roomchatSlice";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import Toastify from "toastify-js";
import socket from "..";
export default function List({ base_url }) {
=======

import Swal from 'sweetalert2'
import { motion } from "framer-motion";
import { cardVariants, containerVariants, loadingVariants } from "../constants/animationVariants";

export default function List() {
>>>>>>> 5bed60240fb5fb8ee60dffc02dca4f2a0a7c7af3
  const { roomchat, loading, error } = useSelector((state) => state.roomchat);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchAsync());
    // console.log(roomchat.data);
    //
  }, []);

  async function onJoin(id) {
    try {
<<<<<<< HEAD
      const { data } = await axios.post(
        `${base_url}/roomchat/join/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.access_token}`,
          },
        }
      );
      // console.log(data.data.roomChatId);
      const room = `room${data.data.roomChatId}`;
      // console.log(room);
      socket.emit("join_room", room);

      navigate(`/`);
=======
        const result = await Swal.fire({
            title: 'Join Room?',
            text: "Are you sure you want to join this room?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#8B5CF6',
            cancelButtonColor: '#EF4444',
            confirmButtonText: 'Yes, join!',
            cancelButtonText: 'No, cancel',
            background: '#F3F4F6',
            color: '#1F2937',
        })

        if (result.isConfirmed) {
            const { data } = await axios.post(
                `https://server.ragaram.site/roomchat/join/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.access_token}`,
                    },
                }
            );
            
            Swal.fire({
                title: 'Joined Successfully!',
                text: 'You have entered the room.',
                icon: 'success',
                confirmButtonColor: '#8B5CF6',
                background: '#F3F4F6',
                color: '#1F2937',
            })
            
            navigate(`/`);
        }
>>>>>>> 5bed60240fb5fb8ee60dffc02dca4f2a0a7c7af3
    } catch (error) {
        console.log(error);
        const result = await Swal.fire({
            title: 'Already Joined!',
            text: 'You are already a member of this room. Want to go there now?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#8B5CF6',
            cancelButtonColor: '#EF4444',
            confirmButtonText: 'Yes, take me there!',
            cancelButtonText: 'No, stay here',
            background: '#F3F4F6',
            color: '#1F2937',
        });

        if (result.isConfirmed) {
            navigate('/');
        }
    }
  }

  if (loading) {
    return (
      <motion.section 
        className="flex justify-center items-center"
        variants={loadingVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.img 
          src="https://media.istockphoto.com/id/1358773518/vector/black-thug-life-meme-glasses-in-pixel-art-style.jpg?s=612x612&w=0&k=20&c=93g1fyCWjMZQ1-f4WKgTC47k7xZhQXW_M_MJ2xo6IzY="
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      </motion.section>
    );
  }
  return (
<<<<<<< HEAD
    <>
      <div className="container mx-auto p-4">
        <div className="flex flex-wrap -mx-4">
          {/* Card 1 */}

          {roomchat?.data?.length > 0 &&
            roomchat?.data?.map((el) => {
              return (
                <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-4 mb-4" key={el.id}>
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">{el.name}</h2>
                      <p className="text-gray-600">Happy Chating</p>
                    </div>
                    <div className="flex justify-end items-end mt-4">
                      <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => onJoin(el.id)}>
                        Join
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
=======
    <motion.div 
      className="container mx-auto p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        {roomchat?.data?.length > 0 && roomchat?.data?.map((el, index) => (
          <motion.div
            key={el.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            whileHover={{ 
                scale: 1.02,
                transition: { type: "spring", stiffness: 300 }
            }}
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={el.image || "https://via.placeholder.com/400x200"} 
                className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
                alt={el.name}
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">{el.name}</h2>
              <p className="text-gray-500 mb-4">Join this room to start chatting with others!</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-violet-500">{el.members || 0} members</span>
                <button 
                  onClick={() => onJoin(el.id)}
                  className="px-6 py-2 rounded-full bg-violet-100 text-violet-600 hover:bg-violet-200 transition duration-300"
                >
                  Join Room
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
>>>>>>> 5bed60240fb5fb8ee60dffc02dca4f2a0a7c7af3
  );
}
