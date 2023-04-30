import mongoose, { Schema } from "mongoose";
import { IAuthModel } from "./auth.interface";
import constants from "../../constants";

const AuthSchema: Schema<IAuthModel> = new mongoose.Schema(
  {
    _id: {
      type: String,
      validate: {
        validator: (value: any) => {
          return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value
          );
        },
        message: (props: any) => `Email address is required!`,
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

export default mongoose.model<IAuthModel>(constants.SCHEMAS.AUTH, AuthSchema);
