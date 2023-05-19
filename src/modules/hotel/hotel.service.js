import Hotel from "./hotel.model.js";

const save = async (hotel, session) => {
  return hotel.save({ session });
};

const findById = async (id, session) => {
  if (session) return Hotel.findById(id).session(session);
  return Hotel.findById(id);
};

const findPaginatedHotels = async (keyword = "", pageableObj) => {
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

const deleteById = async (id) => {
  const deletedHotel = await Hotel.findByIdAndDelete(id);
  if (!deletedHotel) throw new NotFoundError("Hotel not found!");
  return deletedHotel;
};

const findNearestHotels = (lat, lng, limit) => {
  const pipeline = [];

  pipeline.push({
    $geoNear: {
      near: { type: "Point", coordinates: [lng, lat] },
      spherical: true,
      distanceField: "distance",
    },
  });

  pipeline.push({
    $limit: limit,
  });

  return Hotel.aggregate(pipeline);
};

export default {
  save,
  findById,
  findPaginatedHotels,
  deleteById,
  findNearestHotels,
};
