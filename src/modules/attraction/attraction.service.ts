import mongoose, { ClientSession } from "mongoose";
import { IAttractionModel } from "./attraction.interface";
import Attraction from "./attraction.model";
import { IPagination } from "../common/common.interface";

const save = async (attraction: IAttractionModel, session?: ClientSession) => {
  return attraction.save({ session });
};

const findById = async (
  id: string | mongoose.Types.ObjectId,
  session?: ClientSession
) => {
  if (session) return Attraction.findById(id).session(session);
  return Attraction.findById(id);
};

const findPaginatedAttractions = async (
  keyword = "",
  pageableObj: IPagination
) => {
  const pipeline: any = [];

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
