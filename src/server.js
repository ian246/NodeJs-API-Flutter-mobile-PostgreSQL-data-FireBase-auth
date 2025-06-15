import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createUser, createClint, getClient } from "./database-postgres.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//! users

app.post("/user", async (request, response) => {
  const { name, email } = request.body;
  const user = await createUser(name, email);
  response.status(201).send(user);
});
app.get("/user", async (request, response) => {});
app.delete("/user", async (request, response) => {});
app.put("/user", async (request, response) => {});

//! client

app.post("/user/:id/client", async (request, response) => {});
app.get("/user/:id/client", async (request, response) => {});
app.delete("/user/:id/client", async (request, response) => {});
app.put("/user/:id/client", async (request, response) => {});
