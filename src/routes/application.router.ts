import express, { Router } from 'express';
import { rootRouter } from './root.router';

const router: Router = express.Router();
router.use('/', rootRouter);

export const applicationRouter: Router = router;
