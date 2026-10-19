const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {User} = require("../models/User");

let getdata = async (req,res) =>{

  const userId = req.userId;

  const user = await User.findById(userId)
  return res.status(200).json(user)
}

let register = async (req, res) => {
  
  const { name, email, password } = req.body;

  const userExist = await User.findOne({ email });
  if (userExist) return res.status(400).json({ message: "User exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({ name, email, password: hashedPassword });

  res.status(201).json({ message: "Registered Successfully" });
}

let login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid Email" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1y" });

  res.json({ token });
}

let home = (req, res) => {
  
  User.findById(req.userId)
  res.json({ message: "Welcome to Home Page " });
}


const updatedata = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          name,
          email,
          phone,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

const getallusers = async (req,res) =>{

  const alluser = await User.find()

  return res.status(200).json(alluser)
}

module.exports = {
  register,
  login,
  home,
  getdata,
  updatedata,
  getallusers
};