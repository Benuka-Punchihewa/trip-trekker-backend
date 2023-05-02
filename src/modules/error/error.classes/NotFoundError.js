import CustomAPIError from "./CustomAPIError.js";
import { StatusCodes } from "http-status-codes";

class NotFoundError extends CustomAPIError {
  statusCode
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export default NotFoundError;
