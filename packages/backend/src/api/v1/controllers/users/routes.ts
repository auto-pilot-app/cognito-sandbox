import express from "express";

import { globalAuth } from "../../middleware";
import { getUser } from "./user.get";

const router = express.Router();

router.use(globalAuth);

router.get("/", getUser); // We only have a simple get method

export default router;
