import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { applicationRouter } from './routes';

const server: Express = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors());
server.use(applicationRouter);

const io = new Server(http.createServer(server));

export function startServer(): void {
  const host: string = process.env.HOST || 'localhost';
  const port: number = Number(process.env.PORT) || 8080;

  // Lista de clientes na sala de espera
  const room: any = {};

  io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    let userRoom: any;

    // Entrar na sala de espera
    socket.on('joinWaitingRoom', (roomId) => {
      // Caso não exista a sala ainda, é criada
      if (!room[roomId]) room[roomId] = [];
      userRoom = roomId;

      room[roomId].push(socket.id);
      socket.emit('waitingMessage', 'Você está na sala de espera.');

      // Notificar todos os clientes na sala de espera sobre o novo cliente
      io.emit('waitingClientsUpdated', room[roomId].length);
    });

    // Deixar a sala de espera
    socket.on('leaveWaitingRoom', () => {
      if (!userRoom) return;

      const index = room[userRoom].indexOf(socket.id);
      if (index !== -1) {
        room[userRoom].splice(index, 1);
        socket.emit('waitingMessage', 'Você saiu da sala de espera.');

        // Notificar todos os clientes na sala de espera sobre a saída do cliente
        io.emit('waitingClientsUpdated', room[userRoom].length);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id}`);

      if (!userRoom) return;

      // Remover o cliente da sala de espera, se estiver lá
      const index = room[userRoom].indexOf(socket.id);
      if (index !== -1) {
        room[userRoom].splice(index, 1);

        // Notificar todos os clientes na sala de espera sobre a saída do cliente
        io.emit('waitingClientsUpdated', room[userRoom].length);
      }
    });
  });

  server.listen(port, () => {
    console.log(`Server started at PORT: ${port}`);
  });
}
