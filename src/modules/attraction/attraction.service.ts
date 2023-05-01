import mongoose, { ClientSession } from "mongoose";
import { IAttractionModel } from "./attraction.interface";
import Attraction from "./attraction.model";

const save = async (attraction: IAttractionModel, session?: ClientSession) => {
  return attraction.save({ session });
};

const findById = async (
  id: string | mongoose.Types.ObjectId,
  session?: ClientSession
) => {
  if (session) return Attraction.findById(id).session(session);
  return Attraction.findById(id);
};

export default { save, findById };
