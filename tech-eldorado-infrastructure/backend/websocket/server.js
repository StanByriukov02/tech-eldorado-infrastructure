import { WebSocketServer } from 'ws';
import { agentManager } from '../agents/agent-manager.js';

/**
 * WebSocket Server for Real-time Coordination
 * NCCL-like communication between agents
 */
export function setupWebSocket(wss) {
  const clients = new Map(); // agentId -> WebSocket

  wss.on('connection', (ws, req) => {
    console.log('🔌 New WebSocket connection');

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        switch (message.type) {
          case 'register':
            // Agent registers itself
            clients.set(message.agentId, ws);
            ws.agentId = message.agentId;
            console.log(`✅ Agent ${message.agentId} connected`);
            break;

          case 'broadcast':
            // Broadcast to all agents
            broadcast(message.payload, ws.agentId);
            break;

          case 'send':
            // Send to specific agent
            const targetWs = clients.get(message.toAgentId);
            if (targetWs) {
              targetWs.send(JSON.stringify({
                type: 'message',
                from: ws.agentId,
                content: message.content,
              }));
            }
            break;

          case 'status_update':
            // Agent status update
            broadcast({
              type: 'agent_status',
              agentId: ws.agentId,
              status: message.status,
              task: message.task,
            });
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (ws.agentId) {
        clients.delete(ws.agentId);
        console.log(`❌ Agent ${ws.agentId} disconnected`);
      }
    });
  });

  function broadcast(payload, excludeAgentId = null) {
    clients.forEach((client, agentId) => {
      if (agentId !== excludeAgentId && client.readyState === 1) {
        client.send(JSON.stringify(payload));
      }
    });
  }

  console.log('✅ WebSocket server ready');
}

