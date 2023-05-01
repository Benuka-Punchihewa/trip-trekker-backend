import mongoose, { ClientSession } from "mongoose";
import { IUserModel } from "./user.interface";
import User from "./user.model";

const save = async (user: IUserModel, session?: ClientSession) => {
  return user.save({ session });
};

const removeById = async (_id: string, session?: ClientSession) => {
  if (session) return User.remove({ _id }).session(session);
  return User.remove({ _id });
};

const findByAuthId = async (authId: string, session?: ClientSession) => {
  if (session) return User.findOne({ "auth._id": authId }).session(session);
  return User.findOne({ "auth._id": authId });
};

const findById = async (
  id: string | mongoose.Types.ObjectId,
  session?: ClientSession
) => {
  if (session) return User.findById(id).session(session);
  return User.findById(id);
};

export default { save, removeById, findByAuthId, findById };
