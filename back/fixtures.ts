import crypto from "crypto";
import mongoose from "mongoose";
import config from "./config";
import TasksOrm from "./models/Tasks";
import UsersOrm from "./models/Users";

const run = async () => {
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection("tasks");
    await db.dropCollection("users");
  } catch (e) {
    console.log("Collections were not present, skipping drop...");
  }

  const [cpuUsers, ssdUsers] = await UsersOrm.create(
    {
      username: "admin",
      password: "admin",
    },
    {
      username: "ular",
      password: "ular",
    },
  );

  await TasksOrm.create(
    {
      title: "Buy eggs",
      description: "Buy eggs",
    },
    {
      title: "finish work",
      description: "finish work",
    },
  );

  await db.close();
};

run().catch(console.error);
