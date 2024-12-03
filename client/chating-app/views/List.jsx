import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchAsync } from "../src/features/roomchat/roomchatSlice";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Toastify from "toastify-js";
import Swal from 'sweetalert2'

export default function List() {
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

  if (loading) {
    return (
      <>
        <section className="flex justify-center items-center">
          <img src="https://media.istockphoto.com/id/1358773518/vector/black-thug-life-meme-glasses-in-pixel-art-style.jpg?s=612x612&w=0&k=20&c=93g1fyCWjMZQ1-f4WKgTC47k7xZhQXW_M_MJ2xo6IzY=" />
        </section>
      </>
    );
  }
  return (
    <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomchat?.data?.length > 0 && roomchat?.data?.map((el) => (
                <div key={el.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden border border-gray-100">
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
                </div>
            ))}
        </div>
    </div>
  );
}
