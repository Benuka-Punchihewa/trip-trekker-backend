import CustomAPIError from "./CustomAPIError.js";
import { StatusCodes } from "http-status-codes";

class DataValidationError extends CustomAPIError {
  statusCode;
  keyValuePairs;
  constructor(keyValuePairs) {
    super("");
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.keyValuePairs = keyValuePairs;
  }
}

export default DataValidationError;
