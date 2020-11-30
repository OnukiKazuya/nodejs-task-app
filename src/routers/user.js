const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

router.post("/users", async (req, res) => {
  const me = User(req.body);
  try {
    await me.save();
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
    await req.user.remove();  // ここで、ミドルウェアが発生する(pre hook event);
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
