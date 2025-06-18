import admin from "firebase-admin";
import serviceAccount from "./src/config/serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
export default admin;
