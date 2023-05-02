import Auth from "./auth.model.js";

const save = async (auth, session) => {
  return auth.save({ session });
};

const removeById = async (_id, session) => {
  if (session) return Auth.remove({ _id }).session(session);
  return Auth.remove({ _id });
};

const findById = async (_id, session) => {
  if (session) return Auth.findById(_id).session(session);
  return Auth.findById(_id);
};

export default { save, removeById, findById };
