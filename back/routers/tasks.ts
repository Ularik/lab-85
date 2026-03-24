import express from "express";
import TasksOrm from "../models/Tasks";
import auth, { RequestWithUser } from "../middlewares/auth";


const tasksRouter = express.Router();

tasksRouter.post("/", auth, async (req, res) => {
    const user = (req as RequestWithUser).user;
    if (!req.body.title) {
      return res.status(400).send({errpr: "title must be present"});
    }

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

tasksRouter.put("/:id", auth, async (req, res) => {
  const user = (req as RequestWithUser).user;
  const { id } = req.params;

  if (!req.body.title || req.body.title.trim() === '') {
    return res.status(400).send({ error: "title must be present" });
  }

  try {
    const task = await TasksOrm.findById(id);
    
    if (!task) {
      return res.status(400).send({ error: "no such task" });
    }

    if (task.user.toString() !== user.id) {
      res.status(401).send({ error: "You dont have rights for this task" });
      return
    }

    task.title = req.body.title;
    task.description = req.body.description;
    await task.save();
    return res.send(task);
  } catch (err) {
    res.sendStatus(400);
    return 
  }
});

export default tasksRouter;