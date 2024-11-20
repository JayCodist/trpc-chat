import next from 'next';
import { createWSServer } from './wsServer';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

app.prepare().then(() => {
  createWSServer(3001);

  console.log('✅ WebSocket Server is running on ws://localhost:3001');
}); 