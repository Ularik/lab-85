import express from "express";
import TasksOrm from "../models/Tasks";
import auth, { RequestWithUser } from "../middlewares/auth";


const tasksRouter = express.Router();

tasksRouter.post("/", auth, async (req, res) => {
    const user = (req as RequestWithUser).user;

  const data = {
    user: user.id,
    title: req.body.title,
  };
  try {
    return res.send(data)
  } catch (err) {
    return res.sendStatus(400);
  }
});


export default tasksRouter;