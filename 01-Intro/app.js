import http from 'http';
import { reqHandler } from './routes.js';

const server = http.createServer(reqHandler);
server.listen(3000);
