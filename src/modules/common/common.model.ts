import mongoose, { Schema } from "mongoose";
import { IFirebaseFile } from "./common.interface";

const FirebaseSchema: Schema<IFirebaseFile> = new mongoose.Schema({
  mimeType: {
    type: String,
  },
  firebaseStorageRef: {
    type: String,
  },
});

export { FirebaseSchema };
