import { Message, Notifications } from "../Modules/Schema.js";

const users = {}; // userId -> socketId

export const handlePreviousChats = async (req, res) => {
  const { chatId } = req.params;
  const messages = await Message.find({ chatId }).sort("createdAt");
  res.json(messages);
};

export const chatHandler = (io) => {
  io.on("connection", (socket) => {

    // --- REGISTER USER ---
    socket.on("register", async (userId) => {
      users[userId] = socket.id;
      // Send undelivered notifications
      const pending = await Notifications.find({ userId, delivered: false });
      pending.forEach((note) => {
        io.to(socket.id).emit("newNotification", note);
      });

      // Mark as delivered
      await Notifications.updateMany(
        { userId, delivered: false },
        { $set: { delivered: true } }
      );
    });

    // --- JOIN CHAT ROOM ---
    socket.on("joinRoom", (chatId) => {
      socket.join(chatId);
    });

    // --- SEND MESSAGE ---
    socket.on("sendMessage", async ({ sender, receiver, text }) => {
      const chatId = [sender, receiver].sort().join("_");

      // Save message in DB
      const message = new Message({ chatId, sender, receiver, text });
      await message.save();

      // Deliver to chat room (if open)
      io.to(chatId).emit("receiveMessage", message);

      // Notify receiver
      if (users[receiver]) {
        // Online: send instantly
        io.to(users[receiver]).emit("newNotification", {
          from: sender,
          text,
        });
      } else {
        // Offline: store notification
        const notification = new Notifications({
          userId: receiver,
          from: sender,
          text,
        });
        await notification.save();
      }
    });

    // --- CLEANUP ---
    socket.on("disconnect", () => {
      for (const [userId, socketId] of Object.entries(users)) {
        if (socketId === socket.id) {
          delete users[userId];
          break;
        }
      }
    });
  });
};
