import mongoose, { Schema } from "mongoose";
import { IFirebaseFile, IGeoJSON } from "./common.interface";

const FirebaseSchema: Schema<IFirebaseFile> = new mongoose.Schema({
  mimeType: {
    type: String,
  },
  firebaseStorageRef: {
    type: String,
  },
});

const GeoJsonSchema: Schema<IGeoJSON> = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
    default: "Point",
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

export { FirebaseSchema, GeoJsonSchema };
