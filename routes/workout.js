const express = require("express");
const {
    getMyWorkouts,
    getWorkoutById,
    addWorkout,
    updateWorkout,
} = require("../controllers/workout");
const router = express.Router();

router.get("/getMyWorkouts", getMyWorkouts);
router.get("/:workoutId", getWorkoutById);

router.post("/addWorkout", addWorkout);

router.patch("/updateWorkout/:workoutId", updateWorkout);

module.exports = router;
