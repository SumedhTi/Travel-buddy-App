import { User } from "../Modules/Schema.js";
import bcrypt from "bcrypt";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.query.id).select("-password, -googleId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      dob,
      gender,
      drinking,
      smoking,
      native,
      phoneNo,
      driving,
      religion,
      bio,
      language,
      locationPref,
      natureType,
      interestType,
      password
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        dob,
        gender,
        drinking,
        smoking,
        native,
        phoneNo,
        driving,
        religion: religion || "",
        bio: bio || "",
        language,
        locationPref,
        natureType,
        interestType,
        password:hashedPassword
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
    console.log(error);
    
  }
};

export const fetchAllUsers = async (req, res) => {
  try {
    const user = await User.find().select("-password, -googleId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}