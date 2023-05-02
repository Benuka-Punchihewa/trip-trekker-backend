import CustomAPIError from "./CustomAPIError.js";
import { StatusCodes } from "http-status-codes";

class ConflictError extends CustomAPIError {
  statusCode
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
  }
}

export default ConflictError;
