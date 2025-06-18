import admin from "../../firebase.js";
import * as db from "../../database-postgres.js";

export async function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1] || req.query.token;

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await db.getUser(decodedToken.uid);
    
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ 
      error: "Token inválido",
      requiresLogin: true // Flag para o frontend redirecionar para login
    });
  }
}