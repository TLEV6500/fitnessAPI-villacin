const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;

const WorkoutSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    duration: {
        type: String,
        required: [true, "Duration is required"],
    },
    userId: {
        type: SchemaTypes.ObjectId,
        required: [true, "User ID is required"],
    },
    dateAdded: {
        type: Date,
        required: [true, "Date added is required"],
    },
    status: {
        type: String,
        required: [true, "Status is required"],
    },
});

module.exports.Workout = mongoose.model("Workout", WorkoutSchema);
