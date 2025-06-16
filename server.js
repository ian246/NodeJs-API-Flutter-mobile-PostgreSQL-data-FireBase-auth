// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as db from "./database-postgres.js";
import { userSchema } from "./src/validations/user.schema.js";
import { clientSchema } from "./src/validations/client.schema.js";

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
  //!tratamentos, erro e validado
  //! tratamento de erro, e sera passado dentro do
  //! local que vai fazer a validação =>  (req.body)
  const { error, value } = userSchema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ mensagem: "Erro de validação", detalhes: error.details });
  }

  try {
    //! valida => depois cria
    //!se os campos de name e emial estiverem validos
    const { name, email } = value;
    //! aqui ele cria
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
  //! capos de validação, passa o corpo para => validate(req.body)
  const { error, value } = userSchema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ mensagem: "Erro de validação", detalhes: error.details });
  }

  try {
    const { userId } = req.params;
    //! se os campos estiverem validos:
    const { name, email } = value;
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
  const clienteParaValidar = {
    ...req.body,
    user_id: req.params.userId,
  };
  //! aqui eu estou passando uma variavel que no seu escopo aprensenta, o req.body
  //! tratamentos, erros e validos
  const { error, value } = clientSchema.validate(clienteParaValidar);

  if (error) {
    return res
      .status(400)
      .json({ mensagem: "Erro de validação", detalhes: error.details });
  }

  try {
    const { userId } = req.params;
    //! se os campos estiverem validos:
    const { name, email, data } = value;

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
  const clienteParaValidar = {
    ...req.body,
    user_id: req.params.userId,
    id: req.params.clientId,
  };

  const { error, value } = clientSchema.validate(clienteParaValidar);

  if (error) {
    return res
      .status(400)
      .json({ mensagem: "Erro de validação", detalhes: error.details });
  }

  try {
    const { clientId } = req.params;
    const { name, email, data } = value;
    const updatedClient = await db.updateClient(clientId, name, email, data);
    res.json(updatedClient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

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
  host: "0.0.0.0", console.log(`Servidor rodando na porta ${PORT}`);
});
