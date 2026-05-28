const express = require("express");
const mongoose = require("mongoose");
const { authenticate } = require("./middlewares/auth");
require("dotenv").config();

mongoose.connection.once("connected", () => {
    console.log("MongoDB Connected.");
});
mongoose.connect(process.env.MONGODB_URI);

const app = express();

app.use(express.json());
app.get("/", (req, res) => {
    res.send("Hello world!");
});

//Routes Middleware
const workoutRoutes = require("./routes/workout");
const userRoutes = require("./routes/user");

app.use("/workouts", authenticate, workoutRoutes);
app.use("/users", userRoutes);

if (require.main === module) {
    app.listen(process.env.PORT || 4000, () => {
        console.log(`API is now online on port ${process.env.PORT || 4000}`);
    });
}

module.exports = { app, mongoose };
