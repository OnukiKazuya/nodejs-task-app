const express = require("express");
require("./db/mongoose")；
const app = express();
const port = process.env.PORT || 3000;
const User_Router = require("./routers/user");
const Task_Router = require("./routers/task");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//
//ミドルウェアなし： new request -> run route handler
//
//ミドルウェアあり： new request -> [do Something] -> run route handler
//
// app.use(auth);  // 全てのルートハンドラの前に実行するとき

app.use(express.json()); // req handlerでjsonを扱えるようにするもの
app.use(User_Router);
app.use(Task_Router);

app.listen(port, () => {
  console.log("Server is up on port : " + port);
});

// const myFunction = async () => {
//   const pass = "12345!";
//   const hashedPass = await bcrypt.hash(pass, 8);
//   console.log(pass);
//   console.log(hashedPass);
//   const isMatch = await bcrypt.compare("12345", hashedPass);
//   console.log(isMatch);
// };
const myFunction = async () => {
  const token = jwt.sign({ _id: "test" }, "thisismycourse", {
    expiresIn: "7 days",
  });
  console.log(token);
  const data = jwt.verify(token, "thisismycourse");
  console.log(data);
};
myFunction();
