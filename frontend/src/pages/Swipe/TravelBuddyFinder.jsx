import React, { useState, useEffect } from 'react';
import { MessageCircle, Users, Calendar, MapPin, Heart, X, Send, User, Settings, Bell } from 'lucide-react';
import './TravelBuddyFinder.css';

const TravelBuddyFinder = () => {
  const [liked, setLiked] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Emily', message: 'Hey! Excited for our trip?', timestamp: '10:30 AM' },
    { id: 2, sender: 'You', message: 'Absolutely! Can\'t wait.', timestamp: '10:32 AM' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [currentProfile, setCurrentProfile] = useState(0);

  const profiles = [
    {
      id: 1,
      name: 'Alex Mason',
      destination: 'Bali, Indonesia',
      date: 'Dec 15, 2023',
      groupSize: 2,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      interests: ['Adventure', 'Photography', 'Culture'],
      bio: 'Love exploring new places and meeting fellow travelers!'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      destination: 'Tokyo, Japan',
      date: 'Jan 20, 2024',
      groupSize: 3,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b332c133?w=150&h=150&fit=crop&crop=face',
      interests: ['Food', 'Culture', 'Shopping'],
      bio: 'Foodie looking for travel companions to explore Tokyo!'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      destination: 'Paris, France',
      date: 'Mar 10, 2024',
      groupSize: 4,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      interests: ['Art', 'History', 'Romance'],
      bio: 'Art enthusiast planning a cultural trip to Paris!'
    }
  ];

  const groups = [
    { name: 'Paris Trip', members: 5, active: true },
    { name: 'Tokyo Adventure', members: 3, active: false }
  ];

  const handleLike = () => {
    setLiked(!liked);
    // Simulate match animation
    if (!liked) {
      setTimeout(() => {
        alert('It\'s a match! 🎉');
      }, 500);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, {
        id: Date.now(),
        sender: 'You',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
      setNewMessage('');
    }
  };

  const nextProfile = () => {
    setCurrentProfile((prev) => (prev + 1) % profiles.length);
    setLiked(false);
  };

  const prevProfile = () => {
    setCurrentProfile((prev) => (prev - 1 + profiles.length) % profiles.length);
    setLiked(false);
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon">✈️</div>
          <h1 className="logo-text">Tripglo</h1>
        </div>
        <nav className="nav">
          <button className="nav-button">Profile</button>
          <button className="nav-button">Matches</button>
          <button className="nav-button">Groups</button>
        </nav>
      </header>

      <div className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">
              <Users size={20} />
              Groups & Itineraries
            </h3>
            {groups.map((group, index) => (
              <div key={index} className={`group-card ${group.active ? 'active-group' : ''}`}>
                <h4 className="group-name">{group.name}</h4>
                <p className="group-members">{group.members} Members</p>
                <div className="group-indicator"></div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Profile Area */}
        <main className="profile-section">
          <h2 className="main-title">Find Your Travel Buddy</h2>
          
          <div className="profile-card">
            <div className="profile-image-container">
              <img 
                src={profiles[currentProfile].image} 
                alt={profiles[currentProfile].name}
                className="profile-image"
              />
              <div className="profile-badge">
                <Calendar size={16} />
              </div>
            </div>

            <div className="profile-info">
              <h3 className="profile-name">{profiles[currentProfile].name}</h3>
              <p className="profile-destination">
                <MapPin size={16} />
                Destination: {profiles[currentProfile].destination}
              </p>
              <p className="profile-date">
                Travel Date: {profiles[currentProfile].date}
              </p>
              <p className="profile-group">
                Group Size: {profiles[currentProfile].groupSize}
              </p>
              
              <div className="interests">
                {profiles[currentProfile].interests.map((interest, index) => (
                  <span key={index} className="interest-tag">{interest}</span>
                ))}
              </div>
              
              <p className="bio">{profiles[currentProfile].bio}</p>
            </div>

            <div className="action-buttons">
              <button 
                className="dislike-button"
                onClick={nextProfile}
              >
                <X size={24} />
              </button>
              <button 
                className={`like-button ${liked ? 'like-button-active' : ''}`}
                onClick={handleLike}
              >
                <Heart size={24} fill={liked ? '#fff' : 'none'} />
              </button>
            </div>

            <div className="navigation-dots">
              {profiles.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentProfile ? 'active-dot' : ''}`}
                  onClick={() => setCurrentProfile(index)}
                />
              ))}
            </div>
          </div>
        </main>

        {/* Chat Section */}
        <aside className="chat-section">
          <div className="chat-header">
            <h3 className="chat-title">
              <MessageCircle size={20} />
              Chat
            </h3>
            <button 
              className="chat-toggle"
              onClick={() => setShowChat(!showChat)}
            >
              {showChat ? '−' : '+'}
            </button>
          </div>

          {showChat && (
            <div className="chat-container">
              <div className="chat-messages">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`chat-message ${msg.sender === 'You' ? 'sent-message' : 'received-message'}`}>
                    <div className="message-bubble">
                      <p className="message-text">{msg.message}</p>
                      <span className="message-time">{msg.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="chat-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="message-input"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                  className="send-button"
                  onClick={handleSendMessage}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2023 Tripglo. All rights reserved.</p>
        <div className="social-links">
          <span>📘</span>
          <span>🐦</span>
          <span>📷</span>
        </div>
      </footer>
    </div>
  );
};

export default TravelBuddyFinder;