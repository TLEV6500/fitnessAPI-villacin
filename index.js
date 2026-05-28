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

app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        return res.status(401).json({
            success: false,
            message: "Invalid or missing authentication token.",
        });
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
});

if (require.main === module) {
    app.listen(process.env.PORT || 4000, () => {
        console.log(`API is now online on port ${process.env.PORT || 4000}`);
    });
}

module.exports = { app, mongoose };
