const { MongoNetworkError } = require("mongodb")
const mongoose = require("mongoose")

/*  MONGOOSE TASK SCHEMA    */
const taskSchema = new mongoose.Schema({
    title:   {
        type:       String,
        required:   true,
        trim:       true,
    },
    description:   {
        type:       String,
        required:   true,
        trim:       true,
    },
    status: {
        type:       Number,
        default:    0,
    },
    owner:  {
        type:       mongoose.Schema.Types.ObjectId,
        required:   true,
        /*  "ref" property enables you to link two different 
        **  mongoose models.  Thus we can fetch the entire public
        **  profile of a user whenever we have a task ID.
        **
        **  You access the "User" instance associated with owner ID
        **  by using the syntax:
        **      task.populate("owner").execPopulate()
        */
        ref:        "User"                
    },
}, {
    timestamps:     true,
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task