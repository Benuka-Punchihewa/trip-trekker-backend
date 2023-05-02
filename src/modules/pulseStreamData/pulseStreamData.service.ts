import mongoose, { ClientSession } from "mongoose";
import { IPulseStreamDataModel } from "./pulseStreamData.interface";
import { IPagination } from "../common/common.interface";
import PulseStreamData from "./pulseStreamData.model";

const save = async (
  pulseStreamData: IPulseStreamDataModel,
  session?: ClientSession
) => {
  return pulseStreamData.save({ session });
};

const findPulseStreamDataPaginated = async (
  attractionId: mongoose.Types.ObjectId,
  pageableObj: IPagination
) => {
  const pipeline: any = [];

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
