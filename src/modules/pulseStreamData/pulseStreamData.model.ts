import mongoose, { Schema } from "mongoose";
import constants from "../../constants";
import { FirebaseSchema } from "../common/common.model";
import { IPulseStreamDataModel } from "./pulseStreamData.interface";

const PulseStreamDataSchema: Schema<IPulseStreamDataModel> =
  new mongoose.Schema(
    {
      attraction: {
        _id: {
          type: Schema.Types.ObjectId,
          ref: constants.SCHEMAS.ATTRACTION,
          required: true,
        },
      },
      user: {
        _id: {
          type: Schema.Types.ObjectId,
          ref: constants.SCHEMAS.USER,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
      tag: {
        type: String,
        enum: {
          values: [
            constants.PULSE_STREAM_DATA.TAGS.INFO,
            constants.PULSE_STREAM_DATA.TAGS.WARNING,
            constants.PULSE_STREAM_DATA.TAGS.HAZARD,
          ],
          message: "Invalid tag!",
        },
        required: [true, "Tag is required!"],
      },
      description: {
        type: String,
        minlength: [3, "Description should have more than 3 characters!"],
        maxlength: [
          1000,
          "Description cannot contain more than 1000 characters!",
        ],
        required: [true, "Description is required!"],
      },
      image: FirebaseSchema,
    },
    {
      versionKey: false,
      timestamps: true,
    }
  );

export default mongoose.model<IPulseStreamDataModel>(
  constants.SCHEMAS.PULSE_STREAM_DATA,
  PulseStreamDataSchema
);
