import sql from "./src/config/db.js";

//! Usuários

export async function createUser(uid, email) {
  await sql`INSERT INTO users (id, email) VALUES (${uid}, ${email})`;
  return { id: uid, email };
}

export async function updateUser(userId, name, email) {
  await sql`UPDATE users SET name = ${name}, email = ${email} WHERE id = ${userId}`;
  return { id: userId, name, email };
}

export async function deleteUser(userId) {
  await sql`DELETE FROM users WHERE id = ${userId}`;
  return { success: true, message: "Usuário deletado com sucesso" };
}

export async function getUser(userId) {
  const [user] = await sql`SELECT * FROM users WHERE id = ${userId}`;
  return user;
}

export async function getAllUsers() {
  return await sql`SELECT * FROM users`;
}

//! Clientes

export async function createClient(userId, name, email, data = "") {
  const [client] = await sql`
    INSERT INTO clients (name, email, user_id, data) 
    VALUES (${name}, ${email}, ${userId}, ${data})
    RETURNING *
  `;
  return client;
}
export async function updateClient(clientId, name, email, data) {
  const [client] = await sql`
    UPDATE clients 
    SET name = ${name}, email = ${email}, data = ${data} 
    WHERE id = ${clientId}
    RETURNING *
  `;
  return client;
}

export async function deleteClient(clientId) {
  await sql`DELETE FROM clients WHERE id = ${clientId}`;
  return { success: true, message: "Cliente deletado com sucesso" };
}

export async function getClient(clientId) {
  const [client] = await sql`SELECT * FROM clients WHERE id = ${clientId}`;
  return client;
}

export async function getClientsByUser(userId) {
  return await sql`SELECT * FROM clients WHERE user_id = ${userId}`;
}

//! Função para obter a estrutura Users --- clients

export async function getUsersWithClients() {
  const users = await getAllUsers();
  const usersWithClients = await Promise.all(
    users.map(async (user) => {
      const clients = await getClientsByUser(user.id);
      return {
        ...user,
        clients,
      };
    })
  );

  return usersWithClients;
}
