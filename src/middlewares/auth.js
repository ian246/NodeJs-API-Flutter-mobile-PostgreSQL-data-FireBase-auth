import admin from "../../firebase.js";
import * as db from "../../database-postgres.js";

export async function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    // Verifica o token no Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email } = decodedToken;

    // Busca ou cria o usuário no PostgreSQL
    let user = await db.getUser(uid);
    if (!user) {
      user = await db.createUser(uid, email || ""); // Cria o usuário no PostgreSQL
    }

    req.user = user; // Anexa o usuário ao request
    next();
  } catch (error) {
    res.status(403).json({ error: "Token inválido", details: error.message });
  }
}
