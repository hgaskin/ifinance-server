const mongoose = require("mongoose");

// creating the user form with required fields =====
const userSchema = new mongoose.Schema(
    {
        email: {type: String, required: true},
        passwordHash: { type: String, required: true },
    },
    {
        timestamp: true,
    }
);

const User = mongoose.model("user", userSchema);

module.exports = User;