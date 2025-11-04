import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import { Server } from "socket.io";
import http from "http";
import oauthRoutes from "./GoogleOauth/oauthRoutes.js";
import { login, register, verifyToken } from "./Controllers/loginController.js";
import { updateProfile, getUserProfile, fetchAllUsers } from "./Controllers/profile.js";
import { uploadFile, deleteFile } from "./Controllers/upload.js";
import { chatHandler, handlePreviousChats } from "./Controllers/chatHandler.js";
import { getRecommendations } from "./Controllers/Recommendation.js";
import { createTrip, getTripById, tripLike } from "./Controllers/tripHandeler.js";
import dotenv from "dotenv";
import { createBlog, deleteBlog, getBlogs, likeBlog } from "./Controllers/blogController.js";
dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

mongoose
  .connect(process.env.MONGODB)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use("/auth", oauthRoutes);
app.post("/register", register);
app.post("/login", login);

app.get("/profile", verifyToken, getUserProfile);
app.get("/getAllProfile", verifyToken, fetchAllUsers);
app.put("/updateProfile", verifyToken, updateProfile);
app.post("/upload", verifyToken, upload.single("profilePhoto"), uploadFile);
app.delete("/deletephoto", verifyToken, deleteFile);
app.get("/recommendations", verifyToken,getRecommendations);
app.post("/addTrip", verifyToken, createTrip);
app.get("/trip", verifyToken, getTripById);
app.post("/likeTrip", verifyToken, tripLike);
app.get("/blogs", getBlogs);
app.post("/blogs", createBlog);
app.post("/blogs/:id/like", likeBlog);
app.delete("/blogs/:id", deleteBlog);
app.get("/messages/:chatId", verifyToken, handlePreviousChats);
chatHandler(io);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
app.get("/recommendations", getRecommendations);
server.listen(PORT + 1, () => console.log("Server running on 3001"));
