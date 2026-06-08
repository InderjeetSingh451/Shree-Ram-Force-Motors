import bcrypt from "bcrypt";
import AdminModel from "../models/adminModel.js";
import generateToken from "../utils/generateToken.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return res.json({ success: false, message: "Admin not found!" });
    }
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const token = generateToken(admin);
    res.json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { login };
