import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GithubLoginButton({ base_url }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleGithubLogin() {
    // ini bisa ditaruh di env pakai dotenv
    const client_id = "Ov23li5Y5CTVE0X7rGmr";
    const redirect_uri = "http://localhost:5173/login";

    // pinjam localStorage untuk menyimpan isGithubLogin
    localStorage.setItem("isGithubLogin", "true");

    // arahkan ke halaman github OAuthUrl
    const githubOAuthUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=user`;
    window.location.href = githubOAuthUrl;
  }

  // fungsi dijalankan ketika githubloginnya true
  useEffect(() => {
    const isGithubLogin = localStorage.isGithubLogin;
    if (isGithubLogin === "true") {
      // ambil code github di query parameter
      const queryParams = new URLSearchParams(window.location.search);
      const authorizationGithubCode = queryParams.get("code");

      // jika ada code setelah menekan Github Login ambil access_tokennya
      if (authorizationGithubCode) {
        const fetchAccessToken = async () => {
          try {
            const response = await getGithubAccessToken(authorizationGithubCode);

            console.log("Access Token:", response);
          } catch (error) {
            console.error("Error fetching access token:", error);
          }
        };

        fetchAccessToken(); // Panggil fungsi async
      }
    }
  }, []);

  async function getGithubAccessToken(authorizationGithubCode) {
    try {
      setLoading(true);
      // karena masalah cors, pengambilan accesstoken dari front end tidak bisa dilakukan
      // lempar authrizationGithubCode ini ke back end lalu kembalikan access token yang digunakan dalam web untuk dimasukkan ke dalam localstorage accesstoken
      // console.log("masuk getGithubAccessToken: ", authorizationGithubCode);
      const { data } = await axios.post(`${base_url}/github-login`, { code: authorizationGithubCode });
      if (data?.access_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.removeItem("isGithubLogin");
      }
      navigate("/");
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button className="btn bg-white py-2 px-3 border border-slate-300 rounded-md btn-outline text-sm" onClick={handleGithubLogin}>
        {/* nanti tambahkan state yang isinya generate token, supaya mencegah csrf (cross-site request forgery) > security concern, setelah itu akan disimpan statenya ke localStorage */}
        {loading ? (
          <>
            <span className="loading loading-spinner"></span> Loading
          </>
        ) : (
          <>
            <i className="fab fa-github mr-1"></i> Sign in with GitHub
          </>
        )}
      </button>
    </>
  );
}
