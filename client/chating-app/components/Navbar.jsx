import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  async function handleLogout() {
    localStorage.clear();
    navigate(`/login`);
  }
  return (
    <>
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            Connectly
          </Link>
          <button className="bg-red-500 px-4 py-2 rounded hover:bg-red-600" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}
