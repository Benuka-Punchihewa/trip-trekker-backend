import { ClientSession } from "mongoose";
import { IAttractionModel } from "./attraction.interface";

const save = async (attraction: IAttractionModel, session?: ClientSession) => {
  return attraction.save({ session });
};

export default { save };
