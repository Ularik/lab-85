import { NextFunction, Request, Response, RequestHandler } from "express";
import { UsersFields } from "../types";
import { HydratedDocument } from "mongoose";
import UsersOrm from "../models/Users";

export interface RequestWithUser extends Request {
  user: HydratedDocument<UsersFields>;
}

const auth: RequestHandler = async (expressReq: Request, res: Response, next: NextFunction) => {
  const req = expressReq as RequestWithUser;
  const token = req.get("Authorization");

  if (!token) {
    return res.status(401).send({error: "NO token present"});
  }
  
  const user = await UsersOrm.findOne({token});

  if (!user) {
    return res.status(401).send({ error: "NO such user" });
  }

  req.user = user;
  next();
};

export default auth;
