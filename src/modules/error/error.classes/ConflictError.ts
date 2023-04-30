import CustomAPIError from "./CustomAPIError";
import { StatusCodes } from "http-status-codes";

class ConflictError extends CustomAPIError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
  }
}

export default ConflictError;
