import { io } from "socket.io-client";

const socket = io("https://server.ragaram.site", {
  auth: {
    token: localStorage.getItem("access_token"),
  },
  autoConnect: false,
});

export default socket;
