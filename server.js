import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as db from "./database-postgres.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Algo deu errado!" });
});

//! Rotas de Usuários

// Criar usuário
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await db.createUser(name, email);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obter todos os usuários (com seus clientes)
app.get("/users", async (req, res) => {
  try {
    const usersWithClients = await db.getUsersWithClients();
    res.json(usersWithClients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obter um usuário específico (com seus clientes)
app.get("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await db.getUser(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const clients = await db.getClientsByUser(userId);
    res.json({ ...user, clients });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar usuário
app.put("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email } = req.body;
    const updatedUser = await db.updateUser(userId, name, email);
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Deletar usuário
app.delete("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await db.deleteUser(userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//! Rotas de Clientes (relacionados a um usuário)

// Criar cliente para um usuário
app.post("/users/:userId/clients", async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, data } = req.body;

    // Verifica se o usuário existe
    const user = await db.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const client = await db.createClient(userId, name, email, data);
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obter todos os clientes de um usuário
app.get("/users/:userId/clients", async (req, res) => {
  try {
    const { userId } = req.params;
    const clients = await db.getClientsByUser(userId);
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar um cliente
app.put("/users/:userId/clients/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const { name, email, data } = req.body;
    const updatedClient = await db.updateClient(clientId, name, email, data);
    res.json(updatedClient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Deletar um cliente
app.delete("/users/:userId/clients/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const result = await db.deleteClient(clientId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
