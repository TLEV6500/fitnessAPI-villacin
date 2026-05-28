const { Workout } = require("../models/Workout");

module.exports.getMyWorkouts = async (req, res) => {
    const workouts = await Workout.find({ userId: req.user.id }).lean();
    if (!workouts || workouts.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No workouts found",
        });
    }
    res.status(200).json({
        success: true,
        workouts,
    });
};

module.exports.getWorkoutById = async (req, res) => {
    const { workoutId } = req.params;
    const workout = await Workout.findOne({
        userId: req.user.id,
        _id: workoutId,
    }).lean();

    if (!workout) {
        return res.status(404).json({
            success: false,
            message: "Workout not found",
        });
    }

    res.status(200).json({
        success: true,
        workout,
    });
};

module.exports.addWorkout = async (req, res) => {
    const { name, duration, status } = req.body;
    // console.log("addWorkout", req.user);
    const workout = await Workout.create({
        userId: req.user.id,
        name,
        duration,
        dateAdded: new Date(),
        status: status ?? "pending",
    });
    res.status(200).json({
        success: true,
        workout,
    });
};

module.exports.updateWorkout = async (req, res) => {
    const workout = await Workout.findOneAndUpdate(
        {
            userId: req.user.id,
            _id: req.params.workoutId,
        },
        req.body,
        { new: true },
    ).lean();
    if (!workout) {
        return res.status(404).json({
            success: false,
            message: "Workout not found",
        });
    }
    res.status(200).json({
        success: true,
        workout,
    });
};
