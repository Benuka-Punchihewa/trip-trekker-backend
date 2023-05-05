import constants from "../../constants.js";
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

const findPaginatedTourGuides = async (keyword = "", pageableObj) => {
  const pipeline = [];

  if (!keyword) keyword = "";
  const queryObj = {
    name: { $regex: keyword, $options: "i" },
    type: constants.USER_TYPES.TOUR_GUIDE,
  };

  pipeline.push({
    $match: queryObj,
  });

  pipeline.push({
    $sort: {
      _id: pageableObj.orderBy === "asc" ? 1 : -1,
    },
  });

  pipeline.push({
    $facet: {
      metadata: [{ $count: "totalElements" }],
      data: [
        { $skip: (pageableObj.page - 1) * pageableObj.limit },
        { $limit: pageableObj.limit },
      ],
    },
  });

  const result = await User.aggregate(pipeline);

  const content = result[0].data;
  const totalElements = result[0]?.metadata[0]?.totalElements || 0;

  return {
    content,
    totalElements,
    totalPages: Math.ceil(totalElements / pageableObj.limit),
  };
};

export default {
  save,
  removeById,
  findByAuthId,
  findById,
  findPaginatedTourGuides,
};
