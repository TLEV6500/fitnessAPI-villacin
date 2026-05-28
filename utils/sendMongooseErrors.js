module.exports.sendMongooseErrors = (err, res) => {
    if (!res) throw new Error("res object must be passed as second argument");
    if (!err.errors) {
        console.error(
            "Called sendMongooseErrors with non-Mongoose error:",
            err,
        );
        res.status(err.status ?? 500).json({ messages: [err.message] });
    }
    res.status(400).json({
        messages: Object.values(err.errors).map((e) => e.message),
    });
};
