import { createBrowserRouter } from "react-router-dom";
import HomePage from "../views/homePage";
import LoginPage from "../components/LoginPage";
import RegisterPage from "../components/RegisterPage";
import List from "../views/List";
import CreateChatRoom from "../components/CreateChatRoom";
import Toastify from "toastify-js";
import BaseLayout from "../views/BaseLayout";
import { redirect } from "react-router-dom";
import EditChat from "../components/EditForm";

// const base_url = "https://server.ragaram.site";
const base_url = "http://localhost:3000";

const router = createBrowserRouter([
  {
    path: "/register",
    element: <RegisterPage base_url={base_url} />,
  },
  {
    path: "/login",
    element: <LoginPage base_url={base_url} />,
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
        element: <HomePage base_url={base_url} />,
      },
      {
        path: "/list",
        element: <List base_url={base_url} />,
      },
      {
        path: "/createroom",
        element: <CreateChatRoom base_url={base_url} />,
      },
      {
        path: "/edit",
        element: <EditChat base_url={base_url} />,
      },
    ],
  },
]);

export default router;
