import { useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function CreateChatRoom() {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);

  const navigate = useNavigate();


  async function onSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name); // Tambahkan nama ke FormData
      formData.append("image", file); // file juga ditambahkan ke form data
      await axios.post(`https://server.ragaram.site/roomchat`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
      navigate(`/`);
      Toastify({
        text: `Success Create new Room Enjoy!`,
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

  async function handleUpload(file) {
    try {
      setFile(file);

      // console.log(formData);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="h-screen bg-gray-400 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Room Chat</h2>
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <label htmlFor="roomName" className="block text-gray-700 font-medium mb-2">
                Room Name
              </label>
              <input
                type="text"
                id="roomName"
                name="roomName"
                placeholder="Enter room name"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Upload Image</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                onChange={(e) => {
                  handleUpload(e.target.files[0]);
                }}
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full">
              Create Room
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
