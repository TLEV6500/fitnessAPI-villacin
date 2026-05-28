const express = require("express");
const { User } = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendMongooseErrors } = require("../utils/sendMongooseErrors");
const { hashPassword, comparePassword } = require("../utils/password");
const { authenticate } = require("../middlewares/auth");
require("dotenv").config();
const router = express.Router();

router.get("/:userId", authenticate, async (req, res) => {
    try {
        if (!req.auth)
            throw new Error(
                "Something happened that's not supposed to happen!",
            );
        if (!req.params.userId)
            throw new (class extends Error {
                status = 400;
            })("Missing params: userId");
        const { email, firstName, lastName, birthDate, id } = req.auth;
        if (id != req.params.userId)
            throw new (class extends Error {
                status = 403;
            })(`Access denied`);
        return res.status(200).json({ user: req.auth });
    } catch (err) {
        sendMongooseErrors(err, res);
    }
});

router.post("/register", async (req, res) => {
    try {
        if (!req.body)
            return res.status(400).json({ message: "No inputs found" });
        const { email, password, firstName, lastName, birthDate } = req.body;
        if (!password)
            throw new (class extends Error {
                status = 400;
            })("Missing inputs");
        if (typeof password !== "string")
            throw new Error("Password is invalid");
        const hashedPassword = await hashPassword(password);
        const user = await User.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            birthDate,
        });
        const token = jwt.sign(
            { email, firstName, lastName, birthDate, id: user.id },
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
        const { email, password } = req.body;
        const user = await User.findOne({ email }).exec();
        const isPasswordCorrect = await comparePassword(
            password,
            user.password,
        );
        if (isPasswordCorrect) {
            const token = jwt.sign(
                {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    birthDate: user.birthDate,
                    id: user.id,
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
