const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.generateToken = (user) => {
    if (!user || !user.email) throw new Error("User must have an email");
    if (!process.env.JWT_SECRET) {
        throw new Error("jwt secret is not defined");
    }
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "6h" });
};
