const PassResetModel = require("../Models/PasswordReset");
const UserModel = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendTo } = require("../Utils/mailer");
const bcrypt = require("bcryptjs");


const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "email field is blank" });
  }
  try {
    const rawEmail = email.trim().toLowerCase();
    const User = await UserModel.findOne({ email: rawEmail });
    if (!User) {
      return res.status(200).json({
        success: true,
        message: "If the email exists, an OTP has been sent",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const otpLookup = crypto
      .createHmac("sha256", process.env.OTP_LOOKUP_SECRET)
      .update(otp)
      .digest("hex");
    await PassResetModel.deleteMany({ email: rawEmail });
    const newPassDoc = await PassResetModel.create({
      email: rawEmail,
      otpHash,
      expiresAt,
      otpLookup,
    });
    console.log(
      `Dev otp for email testing is ${otp} expires in ${expiresAt.toISOString()}`
    );
    try {
      await sendTo(rawEmail, otp);
    } catch (error) {
      console.error(error.message);
    }
    res
      .status(200)
      .json({ success: true, message: "if the email exists,then otp is sent" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const VerifyOtp = async (req, res) => {
  const { otp } = req.body;
  if (!otp.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "OTP Field cannot be empty" });
  }
  try {
    const normalized_otp = otp.trim();
    const otpLookup = crypto
      .createHmac("sha256", process.env.OTP_LOOKUP_SECRET)
      .update(normalized_otp)
      .digest("hex");
    const rec = await PassResetModel.findOne({ otpLookup });
    if (!rec) {
      return res.status(400).json({
        success: false,
        message: "otp invalid or expired",
      });
    }

    if (rec.expiresAt < new Date()) {
      await PassResetModel.deleteOne({ _id: rec._id });
      return res
        .status(400)
        .json({ success: false, message: "otp expired, request a new otp" });
    }
    let { attempts } = rec;
    const decode = await bcrypt.compare(normalized_otp, rec.otpHash);
    if (!decode) {
      attempts += 1;
      await PassResetModel.updateOne({ otpLookup }, { $set: { attempts } });

      if (attempts >= 5) {
        await PassResetModel.deleteOne({ _id: rec._id });
        return res
          .status(429)
          .json({
            success: false,
            message: "Too many incorrect attempts, request a new otp",
          });
      }
      return res.status(400).json({ success: false, message: "Invalid otp" });
    }

    const resettoken = jwt.sign(
      { email: rec.email, purpose: "reset token" },
      process.env.SECRET_KEY,
      { expiresIn: "15m" }
    );

    await PassResetModel.deleteOne({ _id: rec._id });
    res
      .status(200)
      .json({
        success: true,
        message: "otp validates successfully",
        resettoken,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { forgotPassword, VerifyOtp };
