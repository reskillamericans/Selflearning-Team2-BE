//Generates password recovery token.
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 1800,
    }    
});

module.exports = mongoose.model("token", tokenSchema);