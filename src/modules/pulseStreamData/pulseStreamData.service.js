import PulseStreamData from "./pulseStreamData.model.js";

const save = async (pulseStreamData, session) => {
  return pulseStreamData.save({ session });
};

const findById = async (id, session) => {
  if (session) return PulseStreamData.findById(id).session(session);
  return PulseStreamData.findById(id);
};

const findPulseStreamDataPaginated = async (attractionId, pageableObj) => {
  const pipeline = [];

  const queryObj = {
    "attraction._id": attractionId,
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

  const result = await PulseStreamData.aggregate(pipeline);

  const content = result[0].data;
  const totalElements = result[0]?.metadata[0]?.totalElements || 0;

  return {
    content,
    totalElements,
    totalPages: Math.ceil(totalElements / pageableObj.limit),
  };
};

const deleteById = async (_id, session) => {
  if (session) return PulseStreamData.deleteOne({ _id }).session(session);
  return PulseStreamData.deleteOne({ _id });
};

export default { save, findById, findPulseStreamDataPaginated, deleteById };
