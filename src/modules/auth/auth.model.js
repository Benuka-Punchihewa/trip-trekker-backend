import mongoose, { Schema } from "mongoose";
import constants from "../../constants.js";

const AuthSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      validate: {
        validator: (value) => {
          return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value
          );
        },
        message: (props) => `Email address is required!`,
      },
      maxlength: [100, "Email should not exeed 100 characters!"],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model(constants.SCHEMAS.AUTH, AuthSchema);
