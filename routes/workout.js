const express = require("express");
const {
    getMyWorkouts,
    getWorkoutById,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    completeWorkoutStatus,
} = require("../controllers/workout");
const router = express.Router();

router.get("/getMyWorkouts", getMyWorkouts);
router.get("/:workoutId", getWorkoutById);

router.post("/addWorkout", addWorkout);

router.patch("/updateWorkout/:workoutId", updateWorkout);

router.delete("/deleteWorkout/:workoutId", deleteWorkout);
router.patch("/completeWorkoutStatus/:workoutId", completeWorkoutStatus);

module.exports = router;
