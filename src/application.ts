import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { applicationRouter } from './routes';

const server: Express = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors());
server.use(applicationRouter);

export function startServer(): void {
  console.log('startServer');
  const host: string = process.env.HOST || 'localhost';
  const port: number = Number(process.env.PORT) || 3333;

  server.listen(port, host, () => {
    console.log(`Server started at http://${host}:${port}`);
  });
}
