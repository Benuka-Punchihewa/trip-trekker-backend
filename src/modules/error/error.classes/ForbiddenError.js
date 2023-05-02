import CustomAPIError from "./CustomAPIError.js";
import { StatusCodes } from "http-status-codes";

class ForbiddenError extends CustomAPIError {
  statusCode
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

export default ForbiddenError;
