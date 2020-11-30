const mongoose = require("mongoose");
const validator = require("validator");
const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      // await task.populate("owner").execPopulate();によって、
      // モデルUserを"owner"プロパティから参照できるように設定している
    },
  },
  {
    timestamps: true,
  }
);
// ミドルウェアを定義
taskSchema.pre("save", async function (next) {
  const task = this;
  console.log("before updating");
});
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
