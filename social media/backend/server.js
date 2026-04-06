const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const socketIo = require('socket.io');
const io = socketIo(server, {
  cors: { origin: "*" }
});

const cors = require('cors');
app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const cloudinary = require('cloudinary').v2;

const Message = require('./models/Message');
const User = require('./models/User');

// 🔥 Cloudinary config
cloudinary.config({
  cloud_name: "dkdzodtis",
  api_key: "976841627787745",
  api_secret: "Ob_YYFPrBt60QaQaI5kFBoNZ9E",
});

// MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/chat-app')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send("Server is running");
});

// 🔐 SIGNUP
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  try {
    await User.create({
      username: username.toLowerCase(),
      password: hashed,
    });

    res.json({ message: "User created" });
  } catch {
    res.status(400).json({ message: "User exists" });
  }
});

// 🔑 LOGIN
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    username: username.toLowerCase(),
  });

  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign(
    { username: user.username },
    "secretkey",
    { expiresIn: "1d" }
  );

  res.json({ token, username: user.username });
});

// 📸 IMAGE UPLOAD
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    res.json({ url: result.secure_url });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// 🧠 SOCKET LOGIC
let users = {};

io.on('connection', (socket) => {
  console.log("User connected:", socket.id);

  socket.on('join', (username) => {
    const clean = username.toLowerCase();
    users[clean] = socket.id;
    io.emit('users-list', Object.keys(users));
  });

  socket.on('send-private-message', async ({ to, message, from }) => {
    const target = users[to.toLowerCase()];

    await Message.create({ from, to, message });

    if (target) {
      io.to(target).emit('receive-private-message', { from, message });
    }
  });

  socket.on('get-messages', async ({ user1, user2 }) => {
    const messages = await Message.find({
      $or: [
        { from: user1, to: user2 },
        { from: user2, to: user1 },
      ],
    }).sort({ time: 1 });

    socket.emit('chat-history', messages);
  });

  socket.on('disconnect', () => {
    for (let user in users) {
      if (users[user] === socket.id) delete users[user];
    }
    io.emit('users-list', Object.keys(users));
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});