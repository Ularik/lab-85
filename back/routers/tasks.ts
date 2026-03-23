import express from "express";
import TasksOrm from "../models/Tasks";
import auth, { RequestWithUser } from "../middlewares/auth";


const tasksRouter = express.Router();

tasksRouter.post("/", auth, async (req, res) => {
    const user = (req as RequestWithUser).user;

  const data = {
    user: user.id,
    title: req.body.title,
    description: req.body.description,
  };
  try {
    const task = new TasksOrm(data);
    await task.save()
    return res.send(task);
  } catch (err) {
    return res.sendStatus(400);
  }
});


tasksRouter.get("/", auth, async (req, res) => {
  const user = (req as RequestWithUser).user;

  try {
    const tasks = await TasksOrm.find({user: user.id});
    return res.send(tasks);
  } catch (err) {
    return res.sendStatus(400);
  }
});

export default tasksRouter;