import admin from "firebase-admin";
import serviceAccount from "./src/config/serviceAccount.js";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
export default admin;
