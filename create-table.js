import sql from "./src/config/db.js";
(async () => {
  try {
    // Criar a tabela users com melhorias
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY, 
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Criar a tabela clients com melhorias
    await sql`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT TIMESTAMP,
        CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
      );
      
      CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
    `;

    console.log("Tabelas criadas/atualizadas com sucesso!");
  } catch (error) {
    console.error("Erro na criação das tabelas:", error);
  } finally {
    await sql.end();
  }
})();