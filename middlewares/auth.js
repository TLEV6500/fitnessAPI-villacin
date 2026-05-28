const { expressjwt } = require("express-jwt");
require("dotenv").config();

module.exports.authenticate = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
});
