import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as db from "./database-postgres.js";
import { authenticateToken } from "./src/middlewares/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Algo deu errado!" });
});

// Middleware de autenticação para proteger as rotas
app.use(authenticateToken);

//! Rotas de Usuários
// Obter todos os usuários (com seus clientes)

app.get("/users", async (req, res) => {
  try {
    const usersWithClients = await db.getUsersWithClients();
    res.json(usersWithClients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obter o usuário autenticado (com seus clientes)
app.get("/users/me", async (req, res) => {
  try {
    const userId = req.user.id; // ID do usuário autenticado
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

// Atualizar o usuário autenticado
app.put("/users/me", async (req, res) => {
  try {
    const userId = req.user.id; // ID do usuário autenticado
    const { name, email } = req.body;
    const updatedUser = await db.updateUser(userId, name, email);
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Deletar o usuário autenticado
app.delete("/users/me", async (req, res) => {
  try {
    const userId = req.user.id; // ID do usuário autenticado
    const result = await db.deleteUser(userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//! Rotas de Clientes (relacionados ao usuário autenticado)

// Criar cliente para o usuário autenticado
app.post("/clients", async (req, res) => {
  try {
    const userId = req.user.id; // ID do usuário autenticado
    const { name, email, data } = req.body;

    const client = await db.createClient(userId, name, email, data);
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Obter todos os clientes do usuário autenticado
app.get("/clients", async (req, res) => {
  try {
    const userId = req.user.id; // ID do usuário autenticado
    const clients = await db.getClientsByUser(userId);
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Atualizar um cliente do usuário autenticado
app.put("/clients/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const { name, email, data } = req.body;
    const updatedClient = await db.updateClient(clientId, name, email, data);
    res.json(updatedClient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Deletar um cliente do usuário autenticado
app.delete("/clients/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const result = await db.deleteClient(clientId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.get('/protected-route', authenticateToken, (req, res) => {
  res.json({ message: 'Acesso autorizado', user: req.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
