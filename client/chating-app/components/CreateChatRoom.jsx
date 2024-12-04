import { useState } from "react";
// import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import socket from "..";
import Toastify from "toastify-js";

export default function CreateChatRoom({ base_url }) {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      if (file) {
        formData.append("image", file);
      }

      const { data } = await axios.post(`${base_url}/roomchat`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(data);
      // console.log(data);
      const room = data.roomchat.id;
      socket.emit("create", room);

      Toastify({
        text: `Sukses bikin room baru nih! 🎉`,
        duration: 3000,
        gravity: "bottom",
        position: "right",
        style: {
          background: "#34D399",
          color: "#000000",
        },
      }).showToast();

      navigate(`/`);
    } catch (error) {
      console.log(error);
      Toastify({
        text: error.response?.data?.message || "Gagal bikin room 😢",
        duration: 3000,
        gravity: "bottom",
        position: "right",
        style: {
          background: "#F87171",
          color: "#000000",
        },
      }).showToast();
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Membuat URL sementara untuk pratinjau
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-rose-100 to-teal-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Create New Room</h2>
          <div className="flex justify-center">
            <div className="relative flex w-24 h-24 rounded-full justify-center text-center items-center overflow-hidden">
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Preview" className="w-full object-cover" />
                  {/* "test ada gambar" */}
                  <label htmlFor={`upload`} className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white cursor-pointer opacity-0 hover:opacity-100 transition-opacity rounded-full">
                    <i className="fa-solid fa-camera text-lg"></i>
                  </label>
                </>
              ) : (
                // Tampilkan ikon kamera dan tombol upload jika tidak ada gambar
                <label htmlFor={`upload`} className="flex items-center justify-center w-24 aspect-square bg-gray-200 rounded-full cursor-pointer">
                  <div className="flex flex-col items-center text-center">
                    <i className="fa-solid fa-camera text-gray-500 text-lg"></i>
                    <span className="text-gray-500 text-sm">Upload Image</span>
                  </div>
                </label>
              )}
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Name</label>
              <input type="text" required placeholder="Enter room name" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-violet-300 transition duration-200" onChange={(e) => setName(e.target.value)} />
            </div>

            <input type="file" id={`upload`} className="hidden" onChange={handleFileChange} />

            <button type="submit" className="w-full px-4 py-3 bg-violet-100 text-violet-600 rounded-lg hover:bg-violet-200 transition duration-300">
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-md"></span>
                  Creating Room
                </>
              ) : (
                "Create Room"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
