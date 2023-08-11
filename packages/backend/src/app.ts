import express from "express";
import cors from "cors";

import v1Router from "./api/v1/routes";

const app = express();

app.use(cors());
app.options("*", cors());
app.enable("trust proxy");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1", v1Router); // This is the only important entry from this file

app.get("/health", (req, res) => res.sendStatus(200));

app.use("*", (req, res) => res.status(404).json({ message: "Method not found" }));

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.message, { description: err.message ?? "", stack: err.stack });
  if (res.headersSent) return next(err);
  res.status(err.statusCode ?? 500).json({ error: err.message ?? "Unexpected error" });
});

const port = process.env.PORT ?? 3001;
app.listen(port, () => console.log(`REST API service listening on port ${port}...`));
