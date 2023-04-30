import { Document } from "mongoose";
import { IFirebaseFile } from "../common/common.interface";

interface IUser {
  auth: {
    _id: string;
  };
  name: string;
  profileImg: IFirebaseFile;
  address: string;
  mobileNumber: string;
  birthday: Date;
  gender: string;
  type: string;
  tourGuide?: {
    certificate: IFirebaseFile;
    isVerified: Boolean;
    rating: number;
  };
}

interface IUserModel extends IUser, Document {}

export { IUser, IUserModel };
