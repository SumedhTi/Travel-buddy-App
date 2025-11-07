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
import { addChat, chatHandler, getChats, handlePreviousChats } from "./Controllers/chatHandler.js";
import { getRecommendations } from "./Controllers/Recommendation.js";
import { deleteTrip, getTripById, getTripLikes, tripLike, updateTrip } from "./Controllers/tripHandeler.js";
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

app.get("/trip", verifyToken, getTripById);
app.post("/addTrip", verifyToken, updateTrip);
app.delete("/trip/:id", verifyToken, deleteTrip);
app.post("/likeTrip", verifyToken, tripLike);
app.get("/tripLikes", verifyToken, getTripLikes);

app.get("/blogs", verifyToken, getBlogs);
app.post("/blogs", verifyToken, createBlog);
app.post("/blogs/:id/like", verifyToken, likeBlog);
app.delete("/blogs/:id", verifyToken, deleteBlog);

app.get("/messages/:chatId", verifyToken, handlePreviousChats);
app.get('/chats', verifyToken, getChats);
app.post("/addChat", verifyToken, addChat);

chatHandler(io);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
server.listen(PORT + 1, () => console.log("Server running on 3001"));
