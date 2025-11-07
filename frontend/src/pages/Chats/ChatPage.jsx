import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import styles from "./ChatPage.module.css";
import Chatting from "./Chatting";
import { MessageSquare } from "lucide-react";
import { useUser } from "../../GlobalUserContext";
import fetchData from "../../request";

const ChatPage = ( {setActiveChatId} ) => {
  const navigate = useNavigate();
  const { state, dispatch } = useUser();
  const userId = state.user.id;
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const getChats = async () => {
      const res = await fetchData("/chats", "GET", navigate, dispatch);
      if (res) {
        setChats(res);
      }
      setLoading(false);
    };
    getChats();
  }, [navigate, dispatch]);

  const handleBack = () => {
    setSelectedChat(null);
  };

  if (loading) {
    return <div className={styles.loading}>Loading chats...</div>;
  }

  return (
    <div className={styles.chatPageContainer}>
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarHeader}>Chats</h2>
        {chats.length === 0 ? (
          <div className={styles.noChats}>No chats yet.</div>
        ) : (
          <ul className={styles.chatList}>
            {chats.map((chat) => (
                <li
                key={chat._id}
                className={`${styles.chatItem} ${
                    selectedChat?._id === chat._id ? styles.activeChatItem : ""
                }`}
                onClick={() =>  setSelectedChat(chat)}
                >
                <img
                  src={chat?.photo || "https://via.placeholder.com/40"}
                  alt={chat.name}
                  className={styles.chatAvatar}
                />
                <div className={styles.chatInfo}>
                  <span className={styles.chatName}>{chat.name}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div
        className={`${styles.chatArea} ${selectedChat ? styles.show : ""}`}
      >
        {selectedChat ? (
          <Chatting key={selectedChat._id} setActiveChatId={setActiveChatId} otherUser={selectedChat} onBack={handleBack} />
        ) : (
          <div className={styles.noChatSelected}>
            <MessageSquare size={48} />
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
