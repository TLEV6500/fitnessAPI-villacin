const express = require("express");
const { User } = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendMongooseErrors } = require("../utils/sendMongooseErrors");
const { hashPassword, comparePassword } = require("../utils/password");
require("dotenv").config();
const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        if (!req.body)
            return res.status(400).json({ message: "No inputs found" });
        const { username, password, firstName, lastName, birthDate } = req.body;
        if (!password)
            throw new (class extends Error {
                status = 400;
            })("Password is undefined");
        if (typeof password !== "string")
            throw new Error("Password is invalid");
        const hashedPassword = hashPassword(password);
        await User.create({
            username,
            password: hashedPassword,
            firstName,
            lastName,
            birthDate,
        });
        const token = jwt.sign(
            { username, firstName, lastName, birthDate },
            process.env.JWT_SECRET,
            { expiresIn: "1d" },
        );
        res.json({ token });
    } catch (err) {
        sendMongooseErrors(err, res);
    }
});

router.post("/login", async (req, res) => {
    try {
        if (!req.body)
            return res.status(400).json({ message: "No inputs found" });
        const { username, password } = req.body;
        const user = await User.findOne({ username }).exec();
        const isPasswordCorrect = await comparePassword(
            password,
            user.password,
        );
        if (isPasswordCorrect) {
            const token = jwt.sign(
                {
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    birthDate: user.birthDate,
                },
                process.env.JWT_SECRET,
                { expiresIn: "1d" },
            );
            res.status(200).json({ token });
        } else
            res.status(422).json({ message: "Incorrect username or password" });
    } catch (err) {
        sendMongooseErrors(err);
    }
});

module.exports = router;
