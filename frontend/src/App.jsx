import React from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate  } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import { ToastContainer, Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfilePage from "./pages/Profile/ProfilePage";
import AddTravelDetails from "./pages/AddDetails/AddTravelDetails";
import AddProfile from "./pages/Profile/AddProfile";
import { useUser } from "./GlobalUserContext";
import NavBar from "./pages/NavBar/nav";
import Chat from "./pages/Chats/Chatting";
import socket from "./socket";
import { useEffect } from "react";
import { useState } from "react";
import Swipe from "./pages/Swipe/Swipe";
import TripsView from "./pages/trips/TripsView";
import BlogFeed from "./pages/blog/BlogFeed";
import ChatPage from "./pages/Chats/ChatPage";

function App() {
  const { state } = useUser();
  const [activeChatId, setActiveChatId] = useState(null);
  const userLoggedIn = state.user != null && typeof state.user.username != "undefined";

  const LayoutWithNavbar = () => (
    <NavBar components={<Outlet />} />
  );

  useEffect(() => {
    if (state.user != null && typeof state.user.username != "undefined") {
      socket.emit("register", state.user.id);
      socket.on("newNotification", (data) => {
        const currentUserId = state.user.id // or context
        const notifChatId = [data.from, currentUserId].sort().join("_");
  
        // only show toast if not already in that chat
        if (notifChatId !== activeChatId) {
          toast.info(`New message from ${data.from}: ${data.text}`);
        }
      });
    }
    
    return () => {
      socket.off("newNotification");
    };
  }, [activeChatId]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/CreateProfile" element={<AddProfile />} />
      {userLoggedIn && (
        <Route element={<LayoutWithNavbar />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/AddTrip" element={<AddTravelDetails />} />
          <Route path="/AddTrip/:id" element={<AddTravelDetails />} />
          <Route path="/trips" element={<TripsView />} />
          <Route path="/chats" element={<ChatPage setActiveChatId={setActiveChatId} />} />
          <Route path="/swipe" element={<Swipe />} />
          <Route path="/blog" element={<BlogFeed />} />
        </Route>
      )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
