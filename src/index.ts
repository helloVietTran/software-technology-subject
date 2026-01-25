import http from 'http';
import app from './app';
import { config } from './config/config';

const PORT = config.port;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${config.envName}`);
});