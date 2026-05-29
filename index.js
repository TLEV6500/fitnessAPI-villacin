const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();

mongoose.connection.on("open", () => {
    console.log("Connected to MongoDB");
});

mongoose.connect(process.env.MONGODB_URI);

const UserRouter = require("./routes/user");
const WorkoutRouter = require("./routes/workout");
const { authenticate } = require("./middlewares/auth");
const { errorHandler } = require("./middlewares/error");
const cors = require("cors");

const app = express();
app.use(
    cors({
        origin: "*",
    }),
);
app.use(express.json());
app.use("/users", UserRouter);
app.use("/workouts", authenticate, WorkoutRouter);
app.use(errorHandler);

if (require.main === module) {
    app.listen(process.env.PORT || 4000, () => {
        console.log(`API is now online on port ${process.env.PORT || 4000}`);
    });
}

module.exports = {
    app,
    mongoose,
};
