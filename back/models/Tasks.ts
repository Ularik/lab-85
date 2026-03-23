import mongoose from "mongoose";
import UsersOrm from "./Users";


const TasksSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: UsersOrm,
        required: true
    },

    title: {
        type: String,
        required: true,
    },
    description: String,

});

const TasksOrm = mongoose.model("Tasks", TasksSchema);
export default TasksOrm;