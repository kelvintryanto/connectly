import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./app/store.js";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ThemeContext from "../../../../live-chat/client/chating-app/src/context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="383800483107-grpgn26t7p2ts17qefd1fkhe32ac4ppl.apps.googleusercontent.com">
      <ThemeContext> 
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeContext>
    </GoogleOAuthProvider>
  </StrictMode>
);
