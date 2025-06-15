import sql from "./db.js";
import { randomUUID } from "crypto";

//! Usuarios

export async function createUser(name, email) {
  const userId = randomUUID();
  await sql`INSERT INTO users (id, name, email) VALUES (${userId}, ${name}, ${email})`;
  return { id: userId, name, email };
}

export async function updateUser(userId, name, email) {
  await sql`UPDATE users SET name = ${name}, email = ${email} WHERE id = ${userId}`;
}

export async function deleteUser(userId) {
  await sql`DELETE FROM users WHERE id = ${userId}`;
  console.log("Usuario deletado com sucesso");
}

export async function getUser(userId) {
  return await sql`SELECT * FROM users WHERE id = ${userId}`;
}

//! Clientes

export async function createClient(name, email, clientId, data) {
  await sql`INSERT INTO clients (name, email, user_id, data) VALUES (${name}, ${email}, ${clientId}, ${data})`;
  return { success: true };
}

export async function updateClient(clientId, name, email, data) {
  await sql`UPDATE clients SET name = ${name}, email = ${email}, data = ${data} WHERE id = ${clientId}`;
}

export async function deleteClient(clientId) {
  await sql`DELETE FROM clients WHERE id = ${clientId}`;
  console.log("Cliente deletado com sucesso");
}

export async function getClient(clientId) {
  return await sql`SELECT * FROM clients WHERE id = ${clientId}`;
}
