import { User } from "../Modules/Schema.js";
import sharp from "sharp";

export const uploadFile = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const compressedImage = await sharp(req.file.buffer)
      .resize(400, 400, { fit: "cover" })
      .jpeg({ quality: 80 })
      .toBuffer();

    const profilePhoto = await User.findByIdAndUpdate(userId, {
      photo: `data:image/jpeg;base64,${compressedImage.toString("base64")}`,
    });

    return res.status(200).json({message: "Profile photo uploaded successfully", userData: profilePhoto});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profilePhoto = await User.findByIdAndUpdate(userId, {
      photo: "",
    });

    return res.status(200).json({message: "Profile photo deleted successfully", userData: profilePhoto});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
