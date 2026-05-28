module.exports.sendMongooseErrors = (err, res) => {
    if (!err.errors) {
        console.error(
            "Called sendMongooseErrors with non-Mongoose error:",
            err,
        );
        res.status(err.status ?? 500).json({ message: err.message });
    }
    res.status(400).json(err.errors);
};
