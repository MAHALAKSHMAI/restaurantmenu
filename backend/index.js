const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected'));
});

// Pass io to routes
app.set('socketio', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
