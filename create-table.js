import sql from "./db.js";

(async () => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        name TEXT,
        email TEXT
      );
    `;
    console.log("Tabela Usuario criada com sucesso");
  } catch (error) {
    console.log("Erro na criação da tabela de Usuário", error);
  }
})();

(async () => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name TEXT,
        user_id UUID REFERENCES users(id),
        data JSON NOT NULL,
        email TEXT
      );
    `;
    console.log("Tabela cliente criada com sucesso");
  } catch (error) {
    console.log("Erro na criação da tabela de cliente", error);
  }
})();
