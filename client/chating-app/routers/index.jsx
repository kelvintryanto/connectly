import { createBrowserRouter } from "react-router-dom";
import HomePage from "../views/homePage";
import LoginPage from "../components/LoginPage";
import RegisterPage from "../components/RegisterPage";
import Navbar from "../components/Navbar";
import List from "../views/List";
import CreateChatRoom from "../components/CreateChatRoom";
import Toastify from "toastify-js";
import BaseLayout from "../views/BaseLayout";
import { redirect } from "react-router-dom";
import EditChat from "../components/EditForm";
const router = createBrowserRouter([
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    loader: () => {
      if (localStorage.access_token) {
        Toastify({
          text: "You already logged in",
          duration: 3000,
          newWindow: true,
          close: true,
          gravity: "bottom", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "#F87171",
            color: "black",
            border: "solid #000000",
            borderRadius: "8px",
            boxShadow: "2px 2px black",
          },
        }).showToast();
        return redirect("/");
      }
      return null;
    },
  },
  {
    element: <BaseLayout />,
    loader: () => {
      if (!localStorage.access_token) {
        Toastify({
          text: "Please Login First",
          duration: 3000,
          newWindow: true,
          close: true,
          gravity: "bottom", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "#F87171",
            color: "black",
            border: "solid #000000",
            borderRadius: "8px",
            boxShadow: "2px 2px black",
          },
        }).showToast();
        return redirect("/login");
      }
      return null;
    },
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/list",
        element: <List />,
      },
      {
        path: "/createroom",
        element: <CreateChatRoom />,
      },
      {
        path: "/edit",
        element: <EditChat />,
      },
    ],
  },
]);

export default router;
