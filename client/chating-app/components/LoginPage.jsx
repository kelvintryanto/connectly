import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { mailOutline, lockClosedOutline, laptopOutline, leafOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import GithubLoginButton from "./GithubLoginButton";
import Toastify from "toastify-js";

export default function LoginPage({ base_url }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    try {
      console.log("base_url: ", base_url);
      const { data } = await axios.post(`${base_url}/login`, { email, password });
      // console.log(data.access_token);

      localStorage.setItem(`access_token`, data.access_token);
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
          background: "linear-gradient(to right, #ef4444, #f97316)",
          borderRadius: "8px",
        },
        onClick: function () {}, // Callback after click
      }).showToast();
    }
  }

  async function googleLogin(codeResponse) {
    try {
      const { data } = await axios.post(`${base_url}/google-login`, null, {
        headers: {
          token: codeResponse.credential,
        },
      });
      localStorage.setItem("access_token", data.access_token);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="h-screen bg-gradient-to-r from-rose-200 via-pink-200 to-violet-200 flex items-center justify-center">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-md rounded-[2rem] shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-8">
            <button className="text-xl font-bold text-gray-700 border-b-2 border-pink-400 pb-2 px-4">Login</button>
            <button onClick={() => navigate("/register")} className="text-xl font-bold text-gray-400 hover:text-gray-700 pb-2 px-4">
              Sign up
            </button>
          </div>
        </div>

        {/* Logo & KORG Text */}
        {/* <div className="flex justify-center mb-8 items-center">
          <h1 className="text-2xl font-extrabold text-gray-700 ml-4">KORG</h1>
          <IonIcon icon={laptopOutline} className="w-16 h-16 text-gray-700" />
          <IonIcon icon={leafOutline} className="w-8 h-8 text-gray-700" />
        </div> */}

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <div className="flex items-center bg-white/50 rounded-xl px-4">
              <IonIcon icon={mailOutline} className="w-6 h-6 text-gray-500" />
              <input name="email" type="email" placeholder="Enter your email" className="w-full p-3 bg-transparent focus:outline-none" onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center bg-white/50 rounded-xl px-4">
              <IonIcon icon={lockClosedOutline} className="w-6 h-6 text-gray-500" />
              <input name="password" type="password" placeholder="Enter your password" className="w-full p-3 bg-transparent focus:outline-none" onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
              Forgot your password?
            </a>
          </div>

          <button type="submit" className="w-full bg-pink-400 text-white py-3 rounded-xl hover:bg-pink-500">
            Login
          </button>
        </form>

        <div className="divider px-10 flex justify-center mt-6">OR</div>

        <div className="flex mt-3 justify-around">
          <div className="flex justify-center items-center">
            <GoogleLogin onSuccess={googleLogin} />
          </div>
          <div className="flex justify-center items-center">
            <GithubLoginButton base_url={base_url} />
          </div>
        </div>
      </div>
    </div>
  );
}
