import express, { Request, Response, Router } from 'express';
import packageJson from '../../package.json';

const router: Router = express.Router();

router.get('/', async (request: Request, response: Response) => {
  response.json({ version: packageJson.version });
});

export const rootRouter: Router = router;
