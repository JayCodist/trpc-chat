import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { WebSocketServer } from 'ws';
import { appRouter } from './routers/_app';

export function createWSServer(port: number) {
  const wss = new WebSocketServer({ port });
  const handler = applyWSSHandler({ wss, router: appRouter });

  wss.on('connection', (ws) => {
    console.log(`➕➕ Connection opened, remaining (${wss.clients.size}) clients`);
    ws.once('close', () => {
      console.log(`➖➖ Connection closed, remaining (${wss.clients.size}) clients`);
    });
  });

  process.on('SIGTERM', () => {
    handler.broadcastReconnectNotification();
    wss.close();
  });

  return wss;
}