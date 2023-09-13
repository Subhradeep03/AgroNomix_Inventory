const bcrypt = require("bcrypt")
const supervisor_model = require("../models/store_model");
const JWT = require("jsonwebtoken");

exports.registerStore = async (req, res) => {
    try {
        const { firstname, lastname, email, password, phone, store_name, store_id } = req.body;
        const existEmail = await supervisor_model.findOne({ email: email });
        if (existEmail) {
            return res
                .status(400)
                .send({ success: false, message: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const storeInfo = await supervisor_model.create({
            ...req.body,
            password: hashedPassword,
        });
        return res.setHeader("Content-Type", "application/json").status(200).send({
            success: true,
            message: "Successfully created the account",
            storeInfo,
        });
    } catch (error) {
        return res.status(404).send({
            success: false,
            message: "Error registering user",
            error: error.message,
        });
    }
}

exports.loginStore = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(401)
                .send({ success: false, message: "Invalid email or password" });
        }
        // check if the user is already registered or not
        const existUser = await supervisor_model.findOne({ email: email });
        if (!existUser) {
            return res
                .status(401)
                .send({ success: false, message: "User does not exist" });
        }
        const matchPassword = await bcrypt.compare(password, existUser.password);
        if (!matchPassword) {
            return res
                .status(401)
                .send({ success: false, message: "Please enter a valid password" });
        }
        const payload = {
            _id: existUser._id,
            storeId: existUser.store_id, // Assuming existUser has a storeId field
        };
        // token
        const token = await JWT.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        return res
            .setHeader("Content-Type", "application/json")
            .cookie("token", token, {
                expires: expirationDate,
                sameSite: 'none',
                secure: true,
            })
            .status(200)
            .send({
                success: true,
                message: "User Logged in successfully",
                existUser,
                storeId: payload.storeId,
            });
    } catch (error) {
        return res.status(404).send({
            success: false,
            message: "Error logging in user",
            error: error.message,
        });
    }
};