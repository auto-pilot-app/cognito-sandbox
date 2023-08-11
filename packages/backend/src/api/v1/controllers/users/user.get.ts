import { formatUser } from "../../formatters";

import type { Request, Response } from "express";

export async function getUser(req: Request, res: Response) {
  try {
    const formattedUser = formatUser(req.user);

    res.status(200).send({ payload: formattedUser });
  } catch (err) {
    res.status(err.statusCode ?? 500).send({ error: err.message });
  }
}
