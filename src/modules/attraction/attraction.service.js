import Attraction from "./attraction.model.js";

const save = async (attraction, session) => {
  return attraction.save({ session });
};

const findById = async (id, session) => {
  if (session) return Attraction.findById(id).session(session);
  return Attraction.findById(id);
};

const findPaginatedAttractions = async (
  keyword = "",
  pageableObj
) => {
  const pipeline = [];

  if (!keyword) keyword = "";
  const queryObj = {
    name: { $regex: keyword, $options: "i" },
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

  const result = await Attraction.aggregate(pipeline);

  const content = result[0].data;
  const totalElements = result[0]?.metadata[0]?.totalElements || 0;

  return {
    content,
    totalElements,
    totalPages: Math.ceil(totalElements / pageableObj.limit),
  };
};

export default { save, findById, findPaginatedAttractions };
