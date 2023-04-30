import { Document } from "mongoose";
import { IUserModel } from "../user/user.interface";

interface IAuth {
  password: string;
}

interface IAuthModel extends IAuth, Document {}

interface IAuthToken {
  auth: {
    _id: string;
  };
  user: {
    _id: string;
    type: string;
  };
}

interface IAuthSession {
  auth: {
    _id: string;
  };
  user: IUserModel;
}

interface ISignUpStrigifiedBody {
  name: string;
  birthday: Date;
  email: string;
  mobileNumber: string;
  address: string;
  password: string;
  type: string;
  gender: string;
}

export { IAuth, IAuthModel, IAuthToken, IAuthSession, ISignUpStrigifiedBody };
