import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupRoutes } from './routes/index.js';
import { setupWebSocket } from './websocket/server.js';
import { initializeDatabase } from './db/connection.js';
import { seedDatabase } from './db/seed.js';
import { agentManager } from './agents/agent-manager.js';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Initialize
async function start() {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Seed initial data
    await seedDatabase();
    
    // Initialize agents
    await agentManager.initialize();
    
    // Setup routes
    setupRoutes(app);
    
    // Setup WebSocket
    setupWebSocket(wss);
    
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`🚀 Tech Eldorado Backend running on port ${PORT}`);
      console.log(`⚡ WebSocket server ready`);
      console.log(`📊 Database connected`);
      console.log(`🤖 ${agentManager.getAllAgents().length} agents initialized`);
    });
  } catch (error) {
    console.error('❌ Startup failed:', error);
    process.exit(1);
  }
}

start();

