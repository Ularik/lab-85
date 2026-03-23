import mongoose, { Model } from "mongoose";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import type { UsersFields } from "../types";

const SALT_WORK_FACTOR = 10;

interface UsersMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

type UsersModel = Model<UsersFields, {}, UsersMethods>; 

const UsersSchema = new mongoose.Schema<UsersFields, UsersModel, UsersMethods>({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

UsersSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
});

UsersSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    const { password, ...rets } = ret;
    return rets;
  },
});

UsersSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

UsersSchema.methods.generateToken = function () {
  this.token = randomUUID();
};


const UsersOrm = mongoose.model<UsersFields, UsersModel>("Users", UsersSchema);
export default UsersOrm;
