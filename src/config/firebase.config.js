import FirebaseAdmin from "firebase-admin";
import gcloudServiceAccount from "./gcloud-service-account.js";

// init firebase admin
FirebaseAdmin.initializeApp({
  credential: FirebaseAdmin.credential.cert(gcloudServiceAccount),
});

export default {
  FirebaseAdmin,
};
