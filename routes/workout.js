const express = require("express");
const { sendHandlerErrors } = require("../utils/sendHandlerErrors");
const { Workout } = require("../models/Workout");
const router = express.Router();

const getMyWorkouts = async (req, res) => {
    try {
        if (!req.auth) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const workouts = await Workout.find({ userId: req.auth.id }).exec();

        res.status(200).json({ workouts });
    } catch (err) {
        sendHandlerErrors(err, res);
    }
};

const getWorkoutById = async (req, res) => {
    try {
        const { workoutId } = req.params;
        if (!workoutId) {
            return res
                .status(400)
                .json({ message: "Missing params: workoutId" });
        }
        if (!req.auth) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const workout = await Workout.findOne({
            userId: req.auth.id,
            _id: workoutId,
        }).exec();

        if (!workout) {
            return res.status(404).json({ message: "Workout not found" });
        }

        res.status(200).json({ workouts: [workout] });
    } catch (err) {
        sendHandlerErrors(err, res);
    }
};

router.get("/getMyWorkouts", getMyWorkouts);
router.get("/:workoutId", getWorkoutById);

router.post("/addWorkout", async (req, res) => {
    try {
        if (!req.auth)
            throw new (class extends Error {
                status = 401;
            })("Unauthorized");
        if (!req.body) {
            throw new (class extends Error {
                status = 400;
            })("Missing request body");
        }
        const { name, duration, status } = req.body;
        if (!name || !duration)
            throw new (class extends Error {
                status = 400;
            })("Missing required params: name, duration");
        const workout = await Workout.create({
            userId: req.auth.id,
            name,
            duration,
            dateAdded: new Date(),
            status: status ?? "pending",
        });
        res.status(200).json(workout);
    } catch (err) {
        sendHandlerErrors(err, res);
    }
});

router.patch("/updateWorkout/:workoutId", async (req, res) => {
    try {
        if (!req.auth)
            throw new (class extends Error {
                status = 401;
            })("Unauthorized");
        if (!req.params.workoutId)
            throw new (class extends Error {
                status = 400;
            })("Missing workoutId path param");
        const { name, duration, status } = req.body;
        if (!name && !duration && !status) {
            throw new (class extends Error {
                status = 400;
            })(
                `Request body must contain at least one of: name, duration, status`,
            );
        }
        const workout = await Workout.findOneAndUpdate(
            {
                userId: req.auth.id,
                _id: req.params.workoutId,
            },
            req.body,
            { new: true },
        ).exec();
        if (!workout)
            throw new (class extends Error {
                status = 404;
            })("Workout not found");
        res.status(200).json({ data: workout });
    } catch (err) {
        sendHandlerErrors(err, res);
    }
});

module.exports = router;
