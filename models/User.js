const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: { type: String, required: [true, "Password is required"] },
    birthDate: {
        type: Date,
        required: [true, "Birth date is required"],
    },
});

module.exports.User = mongoose.model("User", UserSchema);
