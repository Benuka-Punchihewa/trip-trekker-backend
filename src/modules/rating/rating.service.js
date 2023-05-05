import constants from "../../constants.js";
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

/*
 data interfaces
 
 hotel ratings
 {
    type: string,
    hotelId: ObjectId
 }

 attraction ratings
 {
    type: string,
    attractionId: ObjectId
 }

 tour guide ratings
 {
    type: string,
    tourGuideId: ObjectId
 }
*/
const findPaginatedRatings = async (data, pageableObj) => {
  const pipeline = [];

  const queryObj = {
    type: data.type,
  };

  if (data.type === constants.RATINGS.RATEES.HOTEL)
    queryObj["hotel._id"] = data.hotelId;
  else if (data.type === constants.RATINGS.RATEES.ATTRACTION)
    queryObj["hotel._id"] = data.attractionId;
  else queryObj["user._id"] = data.tourGuideId;

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

  const result = await Rating.aggregate(pipeline);

  const content = result[0].data;
  const totalElements = result[0]?.metadata[0]?.totalElements || 0;

  return {
    content,
    totalElements,
    totalPages: Math.ceil(totalElements / pageableObj.limit),
  };
};

export default { save, findById, findByIdAndDelete, findPaginatedRatings };
