import guidePortfolioModel from "./guidePortfolio.model.js";

const save = async (portfolioData, session) => {
  return portfolioData.save({ session });
};

const findById = async (id, session) => {
  if (session) return guidePortfolioModel.findById(id).session(session);
  return guidePortfolioModel.findById(id);
};

const deleteOne = async (queryObj) => {
  return guidePortfolioModel.findOneAndDelete(queryObj);
};

const findPaginatedPortfolios = async (pageableObj, userId) => {
  const pipeline = [];

  const queryObj = {
    user: {
      _id: userId,
    },
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

  const result = await guidePortfolioModel.aggregate(pipeline);

  const content = result[0].data;
  const totalElements = result[0]?.metadata[0]?.totalElements || 0;

  return {
    content,
    totalElements,
    totalPages: Math.ceil(totalElements / pageableObj.limit),
  };
};

export default { save, findById, deleteOne, findPaginatedPortfolios };
