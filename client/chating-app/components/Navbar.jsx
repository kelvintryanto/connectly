import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { 
    chatbubbleEllipsesOutline, 
    personCircleOutline,
    settingsOutline,
    logOutOutline,
    addCircleOutline
} from "ionicons/icons";

export default function Navbar() {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    async function handleLogout() {
        localStorage.clear();
        navigate(`/login`);
    }

    return (
        <nav className="bg-gradient-to-r from-rose-100 to-teal-100 shadow-lg">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-3">
                            <IonIcon 
                                icon={chatbubbleEllipsesOutline} 
                                className="h-8 w-8 text-violet-600"
                            />
                            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                                Connectly
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link to="/createroom" className="px-4 py-2 rounded-full bg-violet-100 text-violet-600 hover:bg-violet-200 transition duration-300 flex items-center space-x-2">
                            <IonIcon icon={addCircleOutline} className="h-5 w-5" />
                            <span>Create Room</span>
                        </Link>
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center space-x-2 focus:outline-none"
                            >
                                <IonIcon 
                                    icon={personCircleOutline} 
                                    className="h-8 w-8 text-violet-600 hover:text-violet-700 transition duration-300"
                                />
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                    >
                                        <IonIcon icon={settingsOutline} className="h-4 w-4" />
                                        <span>Profile Settings</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                    >
                                        <IonIcon icon={logOutOutline} className="h-4 w-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
