import CustomAPIError from "./CustomAPIError.js";
import { StatusCodes } from "http-status-codes";

class UnAuthorizedError extends CustomAPIError {
  statusCode;
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnAuthorizedError;
