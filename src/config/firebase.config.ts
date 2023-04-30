import FirebaseAdmin from "firebase-admin";
import gCloudServiceAccountCredentials from "./gcloud-service-account.json";

const serviceAccount = gCloudServiceAccountCredentials as any;

// init firebase admin
FirebaseAdmin.initializeApp({
  credential: FirebaseAdmin.credential.cert(serviceAccount),
});

export default {
  FirebaseAdmin,
};
