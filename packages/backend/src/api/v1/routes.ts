import express from "express";

import users from "./controllers/users/routes";

const router = express.Router();

router.use("/users", users); // This is the only subroute: /users

export default router;
