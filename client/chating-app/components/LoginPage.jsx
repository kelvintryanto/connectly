import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
// import NET from 'vanta/dist/vanta.net.min'


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post(`https://server.ragaram.site/login`, { email, password });
      // console.log(data.access_token);

      localStorage.setItem(`access_token`, data.access_token);
      navigate(`/`);
    } catch (error) {
      console.log(error);
    }
  }

  async function googleLogin(codeResponse) {
    try {
      // console.log(codeResponse);
      // console.log(`masuk sini`);

      const { data } = await axios.post(`https://server.ragaram.site/google-login`, null, {
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
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Login to Connectly</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input name="email" type="email" id="email" placeholder="Enter your email" className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input name="password" type="password" id="password" placeholder="Enter your password" className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>

        <div className="divider px-10 flex justify-center">OR</div>
        <div className="mt-6 flex justify-center items-center">
          <GoogleLogin onSuccess={googleLogin} />
        </div>
      </div>
    </div>
  );
}
