const mongoose = require("mongoose");
const userModel = require("../models/user_model")
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
exports.registerUser = async (req,res) => {
  try {
    const { name, email, password, confirmPassword, phone, address } = req.body;
    if (!name) {
      return res
        .status(400)
        .send({ success: false, message: "Name is required" });
    }
    if (!password || password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "A stronger password must be provided",
      });
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .send({ success: false, message: "Passwords do not match" });
    }
    if (!email) {
      return res
        .status(400)
        .send({ success: false, message: "Email is required" });
    }
    if (!phone) {
      return res.status(400).send({
        success: false,
        message: "Please enter a valid contact number",
      });
    }
    if (!address) {
      return res.status(400).send({
        success: false,
        message: "Address na diley kaar baritey pathabo??",
      });
    }
    const existEmail = await userModel.findOne({ email: email });
    if (existEmail) {
      return res
        .status(400)
        .send({ success: false, message: "Email already exists" });
    }
    const hashedPassword = await await bcrypt.hash(password, 12);
    const userInfo = await userModel.create({
      ...req.body,
      password: hashedPassword,
    });
    return res.setHeader("Content-Type", "application/json").status(200).send({
      success: true,
      message: "Successfully created the account",
      userInfo,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
};


exports.loginUser = async(req,res)=>{
    try{
        const {email, password} = req.body
        if(!email || !password){
            return res.status(401).send({
                success: false,
                message:"Fields cannot be empty",
            })
        }
        const existUser = await userModel.findOne({email: email})
        if(!existUser){
            return res.status(401).send({
                success: false,
                message:"User does not exist. Please register"
            })
        }
        const matchPassword = await bcrypt.compare(password, existUser.password);
        if(!matchPassword){
            return res.status(401).send({
                success: false,
                message:"Please check your password and try once again"
            })
        }
        const token = await JWT.sign(
            { _id: existUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
          );
          const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
          return res
            .setHeader("Content-Type", "application/json")
            .cookie("token", token, {
              expires: expirationDate,
              sameSite:'none',
              secure:true,
              httpOnly:true
            })
            .status(200)
            .send({
              success: true,
              message: "User Logged in successfully",
            });
    }catch(error){
        return res.status(400).send({
            success: false,
            message: "Error loggin user",
            error: error.message,
          });
    }
}

exports.getUserDetailsController = async (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res
          .status(401)
          .send({ success: false, message: "Please login first" });
      }
      const decoded = JWT.verify(token, process.env.JWT_SECRET);
      const existUser = await userModel
        .findById({ _id: decoded._id })
        .select("-password");
      const totalPrice = existUser.cart.reduce((acc,item)=>{
        const productPrice = item.quantity * item.price;
        return acc + productPrice;
      },0)
      return res.status(200).send({
        success: true,
        message: "Your user details",
        data: existUser,
        token: token,
        totalPrice:totalPrice
      });
    } catch (error) {
      return res
        .status(500)
        .send({ success: false, message: "Something went wrong", error:error.message });
    }
  };
  
  
exports.logoutUser = async (req, res) => {
    try {
      return res
        .cookie("token", "", {
          httpOnly: true,
        })
        .status(200)
        .json({ success: true, message: "User logged out" });
    } catch (error) {
      return res
        .status(500)
        .send({ success: false, message: "Something went wrong", error });
    }
  };