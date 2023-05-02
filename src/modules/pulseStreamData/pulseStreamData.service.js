import PulseStreamData from "./pulseStreamData.model.js";

const save = async (pulseStreamData, session) => {
  return pulseStreamData.save({ session });
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

export default { save, findPulseStreamDataPaginated };
