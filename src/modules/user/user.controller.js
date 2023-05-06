import userService from "./user.service.js";
import { StatusCodes } from "http-status-codes";

const getPaginatedTourGuide = async (req, res) => {
  const pageable = req.body.pageable;
  const { keyword } = req.query;

  const result = await userService.findPaginatedTourGuides(keyword, pageable);

  return res.status(StatusCodes.OK).json(result);
};

export default { getPaginatedTourGuide };
