import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import productsRouter from "./products";
import rfqsRouter from "./rfqs";
import messagesRouter from "./messages";
import favoritesRouter from "./favorites";
import usersRouter from "./users";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(productsRouter);
router.use(rfqsRouter);
router.use(messagesRouter);
router.use(favoritesRouter);
router.use(usersRouter);
router.use(statsRouter);

export default router;
