import { useState } from "react";
// import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toastify from "toastify-js";

export default function CreateChatRoom() {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Membuat URL sementara untuk pratinjau
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Create Room Chat</h2>
          <div className="flex justify-center">
            <div className="flex w-24 h-24 rounded-full bg-yellow-300 justify-center text-center items-center">
              {previewUrl ? (
                "test ada gambar"
              ) : (
                // Tampilkan ikon kamera dan tombol upload jika tidak ada gambar
                <label htmlFor={`image`} className="flex items-center justify-center w-24 aspect-square bg-gray-200 rounded-full cursor-pointer">
                  <div className="flex flex-col items-center text-center">
                    <i className="fa-solid fa-camera text-gray-500 text-lg"></i>
                    <span className="text-gray-500 text-sm">Upload Image</span>
                  </div>
                </label>
              )}
            </div>
          </div>
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
