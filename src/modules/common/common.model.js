import mongoose, { Schema } from "mongoose";

const FirebaseSchema = new mongoose.Schema({
  mimeType: {
    type: String,
  },
  firebaseStorageRef: {
    type: String,
  },
});

const GeoJsonSchema = new mongoose.Schema({
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
