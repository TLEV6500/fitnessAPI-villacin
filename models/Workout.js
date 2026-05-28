const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;

const WorkoutSchema = new Schema({
    name: String,
    duration: String,
    userId: SchemaTypes.ObjectId,
    dateAdded: Date,
    status: String,
});

module.exports.Workout = mongoose.model("Workout", WorkoutSchema);
