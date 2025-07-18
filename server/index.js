import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './src/config/db.js';
import menuRoutes from './src/routes/menu.routes.js';
import orderRoutes from './src/routes/order.routes.js';
import tableRoutes from './src/routes/table.routes.js'


dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET","POST","PUT","DELETE"]
  }
});

// Middleware
app.use(cors());
// app.use(express.json());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


// Socket.io middleware to use in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api/tables", tableRoutes);

// Socket.io connections
io.on('connection', (socket) => {
  console.log('🔌 Client connected: ', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected: ', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
