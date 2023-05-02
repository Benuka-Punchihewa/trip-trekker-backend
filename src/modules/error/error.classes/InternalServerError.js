import CustomAPIError from "./CustomAPIError.js";
import { StatusCodes } from "http-status-codes";

class InternalServerError extends CustomAPIError {
  statusCode
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

export default InternalServerError;
