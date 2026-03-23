import express from 'express';
import cors from "cors";
import mongoose from "mongoose";
import usersRouter from './routers/users';
import tasksRouter from './routers/tasks';


const app = express();

app.use(express.json());
app.use(cors());
const port = 8001;


app.use("/users", usersRouter);
app.use("/tasks", tasksRouter);

const run = async () => {
  await mongoose.connect("mongodb://localhost/todo_list");

  app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
  });

  process.on("exit", () => {
    mongoose.disconnect();
  });
};

run().catch((err) => console.error(err));
