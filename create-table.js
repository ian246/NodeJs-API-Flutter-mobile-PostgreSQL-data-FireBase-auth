import sql from "./src/config/db.js";

(async () => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name TEXT,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        data JSON,
        email TEXT
      );
    `;

    console.log("Tabelas criadas com sucesso");
  } catch (error) {
    console.error("Erro na criação das tabelas:", error);
  }
})();
