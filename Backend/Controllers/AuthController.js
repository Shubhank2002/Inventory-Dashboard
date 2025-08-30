const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const UserModel = require("../Models/UserModel");

const createToken = (email,userId) => {
  const token = jwt.sign({ email,userd }, process.env.SECRET_KEY, {
    expiresIn: "2h",
  });
  return token;
};

const LoginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please Enter the Email and Password",
      });
    }

    const userFound = await UserModel.findOne({ email });
    if (!userFound) {
      return res
        .status(401)
        .json({ success: false, message: "Email or Password is incorrect or both" });
    }
    const comparepassword = await bcrypt.compare(password, userFound.password);
    if (!comparepassword) {
      return res.status(401).json({
        success: false,
        message: "email or password is incorrect or both",
      });
    }
    const token = createToken(email,userFound._id);
    res
      .status(200)
      .json({ success: true, message: "Login Successfully", token,name:userFound.name });
  } catch (error) {
    console.error("err: ", error.message);
    res.status(500).json({ success: false, message: "something went wrong" });
  }
};

const SignupUser = async (req, res) => {
  const { email, password,name, } = req.body;
  try {
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please Enter the Email or Password or Name",
        });
    }
    const UserFound = await UserModel.findOne({ email });
    if (UserFound) {
      return res
        .status(400)
        .json({ success: false, message: "User already Exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({ email, password: hashPassword,name });
    res
      .status(201)
      .json({ success: true, message: "user created succcessfully", name:newUser.name });
  } catch (error) {
    console.error("signup Error: ",error.message)
    res.status(500).json({success:false,message:'something went wrong'})
  }
};

module.exports = { LoginUser, SignupUser };
