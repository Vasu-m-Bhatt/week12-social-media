import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://127.0.0.1:5000");

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [image, setImage] = useState(null);

  // 🔐 AUTH
  const handleAuth = async () => {
    try {
      const url = isSignup
        ? "http://127.0.0.1:5000/signup"
        : "http://127.0.0.1:5000/login";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.token || data.message === "User created") {
        setLoggedIn(true);
        socket.emit("join", username);
      } else {
        alert(data.message);
      }
    } catch {
      alert("Backend connect nahi ho raha");
    }
  };

  // 🔄 SOCKET LISTENERS
  useEffect(() => {
    socket.on("users-list", setUsers);

    socket.on("receive-private-message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    socket.on("chat-history", setChat);

    return () => {
      socket.off("users-list");
      socket.off("receive-private-message");
      socket.off("chat-history");
    };
  }, []);

  // 📥 LOAD HISTORY
  useEffect(() => {
    if (selectedUser && username) {
      socket.emit("get-messages", {
        user1: username,
        user2: selectedUser,
      });
    }
  }, [selectedUser, username]);

  // 💬 SEND TEXT
  const sendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    socket.emit("send-private-message", {
      to: selectedUser,
      message,
      from: username,
    });

    setChat((prev) => [...prev, { from: username, message }]);
    setMessage("");
  };

  // 📸 SEND IMAGE
  const sendImage = async () => {
    if (!image || !selectedUser) return;

    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    socket.emit("send-private-message", {
      to: selectedUser,
      message: data.url,
      from: username,
    });

    setChat((prev) => [...prev, { from: username, message: data.url }]);
  };

  // 🔐 LOGIN UI
  if (!loggedIn) {
    return (
      <div style={{ padding: 20 }}>
        <h2>{isSignup ? "Signup" : "Login"}</h2>

        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleAuth}>
          {isSignup ? "Signup" : "Login"}
        </button>

        <p
          onClick={() => setIsSignup(!isSignup)}
          style={{ cursor: "pointer" }}
        >
          Switch
        </p>
      </div>
    );
  }

  // 💬 MAIN UI
  return (
    <div className="app">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h3>Online Users</h3>

        {users
          .filter((u) => u !== username)
          .map((u, i) => (
            <div
              key={i}
              className={`user ${selectedUser === u ? "active" : ""}`}
              onClick={() => setSelectedUser(u)}
            >
              {u}
            </div>
          ))}
      </div>

      {/* CHAT */}
      <div className="chat">
        <div className="chat-box">
          {chat.map((msg, i) => (
            <div
              key={i}
              className={`message ${
                msg.from === username ? "sent" : "received"
              }`}
            >
              <b>{msg.from}</b><br />

              {msg.message?.startsWith("http") ? (
                <img src={msg.message} width="150" alt="img" />
              ) : (
                msg.message
              )}
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="input-area">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message..."
          />

          <button onClick={sendMessage}>Send</button>

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button onClick={sendImage}>📸</button>
        </div>
      </div>
    </div>
  );
}

export default App;