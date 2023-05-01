import mongoose, { Document } from "mongoose";
import { IFirebaseFile } from "../common/common.interface";

interface IPulseStreamData {
  attraction: {
    _id: mongoose.Types.ObjectId;
  };
  user: {
    _id: mongoose.Types.ObjectId;
    name: string;
  };
  tag: string;
  description: string;
  image: IFirebaseFile;
}

interface IPulseStreamDataModel extends IPulseStreamData, Document {}

interface IPulseRecordStrigifiedData {
  tag: string;
  description: string;
}

export { IPulseStreamData, IPulseStreamDataModel, IPulseRecordStrigifiedData };
