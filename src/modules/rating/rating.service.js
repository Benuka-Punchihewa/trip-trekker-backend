import Rating from "./rating.model.js";

const save = async (rating, session) => {
  return rating.save({ session });
};

const findById = async (_id, session) => {
  if (session) return Rating.findById(_id).session(session);
  return Rating.findById(_id);
};

const findByIdAndDelete = async (_id, session) => {
  if (session) return Rating.findByIdAndDelete({ _id }).session(session);
  return Rating.findByIdAndDelete({ _id });
};

export default { save, findById, findByIdAndDelete };
