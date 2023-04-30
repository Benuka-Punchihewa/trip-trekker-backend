import { ClientSession } from "mongoose";
import { IAuthModel } from "./auth.interface";
import Auth from "./auth.model";

const save = async (auth: IAuthModel, session?: ClientSession) => {
  return auth.save({ session });
};

const removeById = async (_id: string, session?: ClientSession) => {
  if (session) return Auth.remove({ _id }).session(session);
  return Auth.remove({ _id });
};

const findById = async (_id: string, session?: ClientSession) => {
  if (session) return Auth.findById(_id).session(session);
  return Auth.findById(_id);
};

export default { save, removeById, findById };
