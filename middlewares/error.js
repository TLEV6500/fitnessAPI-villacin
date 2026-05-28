module.exports.errorHandler = (err, req, res, next) => {
    if (err.status) {
        return res.status(err.status).json({
            success: false,
            message: err.message,
        });
    }
    handleMongooseError(err, req, res);
    res.status(500).json({ success: false, message: err.message });
};

const handleMongooseError = (err, req, res) => {
    if (err.name === "ValidationError") {
        res.status(400).json({
            success: false,
            messages: Object.values(err.errors).map((e) => e.message),
        });
    }
};

// const handleAuthError = (err, req, res) => {
//     if (!req.headers.authorization) {
//         return res.status(401).json({
//             success: false,
//             message: "Unauthorized",
//         });
//     }
// };
