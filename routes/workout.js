const express = require("express");
const {
    sendHandlerErrors: sendHandlerErrors,
} = require("../utils/sendMongooseErrors");
const router = express.Router();

router.get("/:userId/:workoutId", (req, res) => {
    try {
        if (!req.params.userId || !req.params.workoutId)
            throw new (class extends Error {
                status = 400;
            })("Missing params: userId and workoutId");
        const { userId, workoutId } = req.params;
    } catch (err) {
        sendHandlerErrors(err, res);
    }
});

module.exports = router;
