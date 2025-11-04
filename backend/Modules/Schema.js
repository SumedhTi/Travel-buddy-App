import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date },
  profileRating: { type: Number, default: 0 },
  email: { type: String, required: true, unique: true },
  gender: { type: String },
  drinking: { type: Boolean },
  smoking: { type: Boolean },
  native: { type: String },
  phoneNo: { type: String },
  driving: { type: Boolean },
  pronouns: { type: String },
  religion: { type: String },
  bio: { type: String },
  language: { type: Array },
  locationPref: { type: Array },
  natureType: { type: Array },
  interestType: { type: Array },
  password: { type: String },
  googleId: { type: String },
  photo: { data: Buffer, contentType: String },
  createdAt: { type: Date, default: Date.now },
});

const messageSchema = new mongoose.Schema({
  chatId: String, // unique room id (e.g. user1_user2)
  sender: String, // userId or email
  receiver: String, // userId or email
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const notificationSchema = new mongoose.Schema({
  userId: String, // who should receive it
  from: String, // sender
  text: String,
  createdAt: { type: Date, default: Date.now },
  delivered: { type: Boolean, default: false },
});

const tripSchema = new mongoose.Schema({
  createdBy: mongoose.Schema.Types.ObjectId,
  tripType: Array,
  destination: String,
  groupSize: Number,
  activities: Array,
  totalCost: Number,
  travelDate: Date,
  budget: Number,
  notes: String,
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});
const blogSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    image: { type: String },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: String }],
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog

export const Message = mongoose.model("Message", messageSchema);
export const Notifications = mongoose.model("Notification", notificationSchema);
export const User = mongoose.model("User", userSchema);
export const Trips = mongoose.model("Trips", tripSchema);
