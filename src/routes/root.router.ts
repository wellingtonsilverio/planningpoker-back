import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

router.get('/', async (request: Request, response: Response) => {
  response.json({ version: '1.0.0' });
});

export const rootRouter: Router = router;
