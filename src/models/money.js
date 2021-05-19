const { MongoNetworkError } = require("mongodb")
const mongoose = require("mongoose")

/*  MONGOOSE Money SCHEMA    */
const moneySchema = new mongoose.Schema({
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
    type: {
        type:       Number,
        default:    0,
    },
    amount: {
        type:       Number,
        default:    0,
    },
    owner:  {
        type:       mongoose.Schema.Types.ObjectId,
        required:   true,
        /*  "ref" property enables you to link two different 
        **  mongoose models.  Thus we can fetch the entire public
        **  profile of a user whenever we have a Money ID.
        **
        **  You access the "User" instance associated with owner ID
        **  by using the syntax:
        **      Money.populate("owner").execPopulate()
        */
        ref:        "User"                
    },
}, {
    timestamps:     true,
})

const Money = mongoose.model('Money', moneySchema)

module.exports = Money