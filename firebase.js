import admin from "firebase-admin";
import serviceAccount from "./src/config/serviceAccount.js";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Adicione outras configurações se necessário
  });
}
export default admin;
