import userService from "./user.service.js";
import { StatusCodes } from "http-status-codes";

const getPaginatedTourGuide = async (req, res) => {
  const pageable = req.body.pageable;
  const { keyword } = req.query;

  const result = await userService.findPaginatedTourGuides(keyword, pageable);

  return res.status(StatusCodes.OK).json(result);
};

const findById = async (req, res) => {
  const { userId } = req.params;
  const dbUser = await userService.findById(userId);
  return res.status(StatusCodes.OK).json(dbUser);
};

export default { getPaginatedTourGuide, findById };
