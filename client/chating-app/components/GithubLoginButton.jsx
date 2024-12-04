export default function GithubLoginButton() {
  return (
    <>
      <button className="btn bg-white py-2 px-3 border border-slate-300 rounded-md btn-outline text-sm">
        <a href="https://github.com/login/oauth/authorize?client_id=Ov23li5Y5CTVE0X7rGmr&redirect_uri=http://localhost:5173/">
          <i className="fab fa-github mr-1"></i> Sign in with GitHub
        </a>
      </button>
    </>
  );
}
