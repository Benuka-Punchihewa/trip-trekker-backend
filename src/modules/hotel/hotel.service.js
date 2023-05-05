import Hotel from "./hotel.model.js";

const save = async (hotel, session) => {
  return hotel.save({ session });
};

const findById = async (id, session) => {
  if (session) return Hotel.findById(id).session(session);
  return Hotel.findById(id);
};

const findPaginatedHotels = async (
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

  const result = await Hotel.aggregate(pipeline);

  const content = result[0].data;
  const totalElements = result[0]?.metadata[0]?.totalElements || 0;

  return {
    content,
    totalElements,
    totalPages: Math.ceil(totalElements / pageableObj.limit),
  };
};

export default { save, findById, findPaginatedHotels };
