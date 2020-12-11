const express = require("express");
const router = new express.Router();
const multer = require("multer");
const User = require("../models/user");
const auth = require("../middleware/auth");
const {sendWelcomeMail, sendGoodbyeMail} = require("../emails/account")

router.post("/users", async (req, res) => {
  const me = User(req.body);
  try {
    await me.save();
    sendWelcomeMail(me.email, me.name)
    const token = await me.generateAuthToken();
    res.status(201).send({ me, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((val) => val.token !== req.token);
    await req.user.save(); // userが自動的に置き換わる設定
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).sen(e);
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/users/me", auth, async (req, res) => {
  // /users -> auth(middleware) -> route handler
  res.status(200).send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((updateKey) =>
    allowedUpdates.includes(updateKey)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates" });
  }
  try {
    updates.forEach((updateKey) => {
      req.user[updateKey] = req.body[updateKey];
    });
    await req.user.save();
    res.status(200).send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove(); // ここで、ミドルウェアが発生する(pre hook event);
    console.log(req.user.email, req.user.name)
    sendGoodbyeMail(req.user.email, req.user.name)
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});


const upload = multer({
  // dest: "avatars",  // ローカルに保存したいとき
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      // / {この中に、正規表現をいれる}/
      return cb(new Error("Please upload a Image(jpg, jpeg, png)"));
    } else {
      cb(undefined, true);
    }
  },
});

// limit 1MB, jpg,jpeg,png ,
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    //　前の処理が成功したときに呼ばれるもの
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.status(200).send(req.user);
  },
  (err, req, res, next) => {
    // 前でエラーが起こったときに呼ばれるもの(4つしっかりと引数を指定するのがポイントらしい)
    return res.status(400).send({ error: err.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    if (req.user.avatar) {
      req.user.avatar = undefined;
    }
    await req.user.save();
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/users/:id/avatar", async (req, res)=>{
  try{
    const user = await User.findById(req.params.id);
    if(!user || !user.avatar){
      throw new Error("avatar is not found");
    }
    res.set("Content-Type", "image/jpg");
    res.status(200).send(user.avatar);
  }catch(e){
    res.status(404).send({error : e.message});
  }
})

module.exports = router;
