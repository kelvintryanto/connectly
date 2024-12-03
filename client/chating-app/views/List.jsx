import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchAsync } from "../src/features/roomchat/roomchatSlice";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import socket from "..";
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
      const { data } = await axios.post(
        `http://localhost:3000/roomchat/join/${id}`,
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
  );
}
