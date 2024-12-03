if (process.env.NODE_env !== "production") {
  require("dotenv").config();
}

const app = require("../app");
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
