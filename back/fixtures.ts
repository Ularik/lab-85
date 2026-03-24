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

  const [adminUser, testUsers] = await UsersOrm.create(
    {
      username: "admin",
      password: "admin",
      token: "123"
    },
    {
      username: "test",
      password: "test",
      token: "321"
    },
  );

  await TasksOrm.create(
    {
      user: adminUser!._id,
      title: "Buy eggs",
      description: "Buy eggs",
      status: "in_progress"
    },
    {
      user: testUsers!._id,
      title: "finish work",
      description: "finish work",
      status: "new"
    },
  );

  await db.close();
};

run().catch(console.error);
