import FirebaseAdmin from "firebase-admin";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const gCloudServiceAccountCredentials = require("./gcloud-service-account.json");

// init firebase admin
FirebaseAdmin.initializeApp({
  credential: FirebaseAdmin.credential.cert(gCloudServiceAccountCredentials),
});

export default {
  FirebaseAdmin,
};
