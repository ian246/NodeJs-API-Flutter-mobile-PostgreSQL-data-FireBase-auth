import sql from "./src/config/db.js";
(async () => {
  try {
    // Criar a tabela users
    // Criar a tabela users
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY, -- uid do Firebase
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Criar a tabela clients
    await sql`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("Tabelas criadas com sucesso!");
  } catch (error) {
    console.error("Erro na criação das tabelas:", error);
  } finally {
    sql.end(); // Encerra a conexão com o banco de dados
  }
})();
