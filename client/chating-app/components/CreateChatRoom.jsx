import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Toastify from "toastify-js";

export default function CreateChatRoom() {
    const [name, setName] = useState("");
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    async function onSubmit(e) {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", name);
            if (file) {
                formData.append("image", file);
            }

            await axios.post(`https://server.ragaram.site/roomchat`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.access_token}`,
                    "Content-Type": "multipart/form-data"
                },
            });

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
        }
    }

    async function handleUpload(file) {
        try {
            setFile(file);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-rose-100 to-teal-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Create New Room</h2>
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Room Name
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Enter room name"
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-violet-300 transition duration-200"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Room Image
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-lg hover:border-violet-300 transition duration-200">
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-violet-600 hover:text-violet-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-violet-500">
                                            <span>Upload a file</span>
                                            <input 
                                                type="file"
                                                className="sr-only"
                                                accept="image/*"
                                                onChange={(e) => handleUpload(e.target.files[0])}
                                            />
                                        </label>
                                    </div>
                                    {file && (
                                        <p className="text-sm text-gray-500">
                                            Selected: {file.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full px-4 py-3 bg-violet-100 text-violet-600 rounded-lg hover:bg-violet-200 transition duration-300"
                        >
                            Create Room
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
