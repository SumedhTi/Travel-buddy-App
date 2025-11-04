import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { socketBase } from "../../../api";
import { useUser } from "../../GlobalUserContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useRef } from "react";
import styles from "./Chatting.module.css";
import socket from "../../socket";

function Chat({ setActiveChatId }) {
  const navigate = useNavigate();
  const { state, dispatch } = useUser();
  const userId = state.user.id;
  const { otherUserId } = useParams();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatRef = useRef(null);

  // generate a consistent room id
  const chatId = [userId, otherUserId].sort().join("_");

  const getPreviousChats = async () => {
    try {
      const res = await fetch(socketBase + `/messages/${chatId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: "*",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setChat(data);
      } else if (res.status === 403) {
        toast.error("Token Invalid Login Again");
        setTimeout(() => {
          sessionStorage.removeItem("userToken");
          dispatch({ type: "CLEAR_USER" });
          navigate("/login", { replace: true });
        }, 3000);
      } else {
        toast.error("Someting went wrong");
      }
    } catch (error) {
      toast.error("Unknone Error Occured");
    }
  };

  useEffect(() => {
    setActiveChatId(chatId); // mark this chat active
    return () => setActiveChatId(null); // clear when leaving
  }, [chatId, setActiveChatId]);

  useEffect(() => {
    if (userId) {
      socket.emit("register", userId);
    }
    // join room
    if (chatId) {
      console.log("Joining room");
      socket.emit("joinRoom", chatId);
    }

    getPreviousChats();

    // listen for new messages
    socket.on("receiveMessage", (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [chatId, userId]);

  const sendMessage = () => {
    if (message.trim() === "") return;
    socket.emit("sendMessage", {
      sender: userId,
      receiver: otherUserId,
      text: message,
    });
    setMessage("");
  };

  useEffect(() => {
    // auto-scroll to bottom when new messages come in
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>Chat with {otherUserId}</div>

      <div className={styles.chatMessages} ref={chatRef}>
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`${styles.chatBubble} ${msg.sender === userId ? "me" : "them"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className={styles.chatInput}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
