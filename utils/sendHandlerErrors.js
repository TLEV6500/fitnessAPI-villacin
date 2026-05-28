module.exports.sendHandlerErrors = (err, res) => {
    if (!res) throw new Error("res object must be passed as second argument");
    if (!err.errors) {
        console.error(
            "Called sendMongooseErrors with non-Mongoose error:",
            err,
        );
        res.status(err.status ?? 500).json({
            success: false,
            messages: [err.message],
        });
    }
    res.status(400).json({
        success: false,
        messages: Object.values(err.errors).map((e) => e.message),
    });
};
