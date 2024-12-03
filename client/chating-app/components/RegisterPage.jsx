import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import { mailOutline, lockClosedOutline, personOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";

export default function RegisterPage({ base_url }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${base_url}/register`, { username, email, password });
      console.log(data);
      console.log(data.name);

      navigate(`/login`);

      Toastify({
        text: `Success Create Account with ${username}`,
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
      Toastify({
        text: error.response.data.message,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#AA0000",
          color: "#FFF",
          borderRadius: "10px",
        },
        onClick: function () {}, // Callback after click
      }).showToast();
      console.log(error);
    }
  }

  return (
    <div className="h-screen bg-gradient-to-r from-blue-200 via-cyan-200 to-teal-200 flex items-center justify-center">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-md rounded-[2rem] shadow-lg p-8">
        <div className="flex gap-8 mb-8">
          <button onClick={() => navigate("/login")} className="text-xl font-bold text-gray-400 hover:text-gray-700 pb-2 px-4">
            Login
          </button>
          <button className="text-xl font-bold text-gray-700 border-b-2 border-cyan-400 pb-2 px-4">Sign up</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex items-center bg-white/50 rounded-xl px-4">
              <IonIcon icon={personOutline} className="w-6 h-6 text-gray-500" />
              <input name="username" type="text" placeholder="Enter your username" className="w-full p-3 bg-transparent focus:outline-none" onChange={(e) => setUsername(e.target.value)} />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center bg-white/50 rounded-xl px-4">
              <IonIcon icon={mailOutline} className="w-6 h-6 text-gray-500" />
              <input name="email" type="email" placeholder="Enter your email" className="w-full p-3 bg-transparent focus:outline-none" onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center bg-white/50 rounded-xl px-4">
              <IonIcon icon={lockClosedOutline} className="w-6 h-6 text-gray-500" />
              <input name="password" type="password" placeholder="Create a password" className="w-full p-3 bg-transparent focus:outline-none" onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          <button type="submit" className="w-full bg-cyan-400 text-white py-3 rounded-xl hover:bg-cyan-500">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
