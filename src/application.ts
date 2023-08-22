import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { applicationRouter } from './routes';
import { startScoket } from './sockets';

export function startServer(): void {
  const PORT: number = Number(process.env.PORT) || 8080;
  const SOCKET_PORT: number = Number(process.env.SOCKET_PORT) || 8081;

  const app: Express = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: '*',
    }),
  );
  app.use(applicationRouter);

  const server = http.createServer(app);

  const io = new Server(server);

  startScoket(io);

  server.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);

    io.listen(SOCKET_PORT, {
      cors: {
        origin: '*',
      },
    });
  });
}
