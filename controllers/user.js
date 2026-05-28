const { comparePassword, hashPassword } = require("../utils/password");
const { User } = require("../models/User");
const { generateToken } = require("../utils/jwt");

module.exports.login = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "No request body" });
    }
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: "Missing email or password" });
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email }).lean();
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
        id: user._id,
    });
    return res.status(200).json({ access: token });
};

module.exports.register = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "No request body",
        });
    }
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            success: false,
            message:
                "Missing user details. Must have at least email and password",
        });
    }
    const hashedPassword = await hashPassword(req.body.password);
    try {
        const user = new User({ ...req.body, password: hashedPassword });
        await user.save();

        return res.status(201).json({
            success: true,
            message: "Registered successfully",
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message:
                    "Email already in use. Please use a different email, or login instead.",
            });
        }
        return res.status(500).json({
            success: false,
            message: "Failed to register",
        });
    }
};

module.exports.getDetails = async (req, res) => {
    const { password, user } = await User.findById(req.user.id).lean();
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
};
