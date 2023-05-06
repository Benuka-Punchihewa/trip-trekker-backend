import mongoose, { Schema } from "mongoose";
import constants from "../../constants.js";
import { FirebaseSchema } from "../common/common.model.js";

const GuidePortfolioDataSchema = new mongoose.Schema(
  {
    user: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: constants.SCHEMAS.USER,
        required: true,
      },
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

export default mongoose.model(
  constants.SCHEMAS.GUIDE_PORTFOLIO,
  GuidePortfolioDataSchema
);
