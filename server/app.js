if (process.env.MODE_ENV != `production`) {
  require("dotenv").config();
}
// require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const router = require("./routers");

const { server } = require(`./index`);

// io.on("connection", (socket) => {
//   io.emit(`ragagantenk`, `masuk event`);
//   // console.log(socket.id);
//   socket.on(`userData`, async (event) => {
//     console.log(event, `hehe`);
//     // console.log(socket.id, event);
//     // console.log(`aaaaaaaaaaaaaaaaaaaaaa`);
//     // console.log(event);

//     // await setSocketId(socket.id, event);

//     // if (event) {
//     //   console.log(`masuk`);
//     // }
//   });
// });

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
//hidup matikan karena tidak dipindahkan
module.exports = app;
