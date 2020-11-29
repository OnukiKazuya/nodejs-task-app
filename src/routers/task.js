const express = require("express");
const router = new express.Router();
const Task = require("../models/task");

router.post("/tasks", async (req, res) => {
  const task = Task(req.body);
  try {
    const task_created = await task.save();
    res.status(201).send(task_created);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    if (!tasks) {
      res.status(404).send();
    }
    res.status(200).send(tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/tasks/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findById(_id);
    if (!task) {
      res.status(404).send();
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch("/tasks/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["completed", "description"];
  const isValidOperation = updates.every((updateKey) =>
    allowedUpdates.includes(updateKey)
  );
  if (!isValidOperation) {
    res.status(400).send({ error: "Invalid Update Key" });
  }
  try {
    const _id = req.params.id;
    const task = await Task.findById(_id);
    updates.forEach((updateKey) => {
      task[updateKey] = req.body[updateKey];
    });
    const taskUpdated = await task.save();
    if (!taskUpdated) {
      res.status(404).send();
    }
    res.status(200).send(taskUpdated);
  } catch (e) {
    res.status(500).send(e);
  }
});
router.delete("/tasks/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findByIdAndDelete(_id);
    if (!task) {
      res.status(404).send();
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
