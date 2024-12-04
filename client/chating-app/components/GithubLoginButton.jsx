import axios from "axios";
import { redirect } from "react-router-dom";

export default function GithubLoginButton({ base_url }) {
  return (
    <>
      <button className="btn bg-white py-2 px-3 border border-slate-300 rounded-md btn-outline text-sm">
        <a href="https://github.com/login/oauth/authorize?client_id=Ov23li5Y5CTVE0X7rGmr&redirect_uri=http://localhost:3000/github-login">
          <i className="fab fa-github mr-1"></i> Sign in with GitHub
        </a>
      </button>
    </>
  );
}
