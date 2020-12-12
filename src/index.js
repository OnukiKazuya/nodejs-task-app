const express = require("express");
require("./db/mongoose");
const app = express();
const port = process.env.PORT;  // 環境変数 PORT 
const User_Router = require("./routers/user");
const Task_Router = require("./routers/task");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");

const upload = multer({
  dest: "images",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(doc|docx)$/)) {  // / {この中に、正規表現をいれる}/
      return cb(new Error("Please upload a Word Docment"));
    } else {
      cb(undefined, true);
    }
  },
});
app.post("/upload", upload.single("upload"), (req, res) => {
  res.send();
});

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
  console.log("process.env.PORT : ", process.env.PORT)
  console.log("process.env.JWT_TOKEN : ", process.env.JWT_TOKEN)
  console.log("process.env.MONGODB_URL : ", process.env.MONGODB_URL)
});

// // object.toJSONの挙動を確認
// const pet = {
//   name: "onuki",
// };
// pet.toJSON = function () {
//   return {};
// };
// console.log(JSON.stringify(pet));
// // JSON化したときに、最初にobject.toJSON関数が呼ばれる
// // なお、Expressでは、自動的に、JSON.stringifyが呼ばれるらしい

const Task = require("./models/task");
const User = require("./models/user");
// const main = async () => {

//owner: {
//   ref : "User",  // 参照するモデル名
//   type: mongoose.Schema.Types.ObjectId,
//   required: true,
// },
// const task = await Task.findById("5fc47685d996cc091194ca1c");
// await task.populate("owner").execPopulate();
// console.log("AAAAAAAAAAAAAAAA");
// console.log(task);  // "User"モデルを "owner"　プロパティから、ACCESSすることができる.

//////*********************************************************** */

//userSchema.virtual("tasks", {
// ref: "Task",  // 参照するモデル名
// localField: "_id",
// foreignField: "owner",
// });
// const user = await User.findById("5fc47603d996cc091194ca19");
// await user.populate("tasks").execPopulate();
// console.log(user.tasks);  // "Task"モデルにACCESSすることができる.
// };
// main();
