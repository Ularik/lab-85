import express from "express";
import UsersOrm from "../models/Users";

const usersRouter = express.Router();


usersRouter.post("/", async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.sendStatus(400).send({"error": "Fileds Username or password is empty"});
    }

    const data = {
        username: req.body.username,
        password: req.body.password
    }
    try {
        const user = new UsersOrm(data);
        user.generateToken();
        await user.save();
        res.send(user);
    } catch(err) {
        return res.sendStatus(400);
    }
});

usersRouter.post('/sessions', async (req, res) => {

    const user = await UsersOrm.findOne({username: req.body.username});
    if (!user) {
        return res.sendStatus(400).send({'error': 'user not found'});
    }

    try {
        const isMatch = user.checkPassword(req.body.password);
        if (!isMatch) {
            return res.sendStatus(400).send({'error': 'password is not correct'});
        }
        user.generateToken;
        return res.send(user);

    } catch(err) {
        return res.sendStatus(400);
    }
});

export default usersRouter;