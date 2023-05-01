import { Document } from "mongoose";
import { IFirebaseFile, IGeoJSON } from "../common/common.interface";

interface IAttraction {
  name: string;
  location: IGeoJSON;
  description: string;
  openHours: {
    open: Date;
    close: Date;
  };
  images: Array<IFirebaseFile>;
  accessibilityOptions: Array<string>;
  rating: number;
}

interface IAttractionModel extends IAttraction, Document {}

interface ICreateAttractionStrigifiedBody {
  name: string;
  location: {
    coordinates: Array<number>;
  };
  description: string;
  openHours: {
    open: Date;
    close: Date;
  };
  accessibilityOptions: Array<string>;
}

export { IAttraction, IAttractionModel, ICreateAttractionStrigifiedBody };
