import { configureStore } from "@reduxjs/toolkit";
import roomchat from "../features/roomchat/roomchatSlice";
export default configureStore({
  reducer: {
    roomchat,
  },
});
