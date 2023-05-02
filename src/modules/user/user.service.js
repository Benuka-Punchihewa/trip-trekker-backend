import User from "./user.model.js";

const save = async (user, session) => {
  return user.save({ session });
};

const removeById = async (_id, session) => {
  if (session) return User.remove({ _id }).session(session);
  return User.remove({ _id });
};

const findByAuthId = async (authId, session) => {
  if (session) return User.findOne({ "auth._id": authId }).session(session);
  return User.findOne({ "auth._id": authId });
};

const findById = async (id, session) => {
  if (session) return User.findById(id).session(session);
  return User.findById(id);
};

export default { save, removeById, findByAuthId, findById };
