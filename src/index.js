const app = require("./app");

const port = process.env.PORT;  // 環境変数 PORT 

app.listen(port, () => {
  console.log("Server is up on port : " + port);
  console.log("process.env.PORT : ", process.env.PORT)
  console.log("process.env.JWT_SECRET : ", process.env.JWT_SECRET)
  console.log("process.env.MONGODB_URL : ", process.env.MONGODB_URL)
});

