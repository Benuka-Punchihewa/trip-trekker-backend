import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import InternalServerError from "./error.classes/InternalServerError";

interface stringDictionary {
  [index: string]: string | number;
}

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customError: {
    statusCode: number;
    message: string;
    data: any;
  } = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong",
    data: {},
  };

  console.log(err);

  // if status 500 display set err msg to "Something went wrong"
  if (customError.statusCode == StatusCodes.INTERNAL_SERVER_ERROR)
    customError.message = "Something went wrong";

  // handle custom internal server errors
  if (err instanceof InternalServerError) {
    customError.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    customError.message = err.message;
  }

  // to handle mongo db validation errors
  if (err.name === "ValidationError") {
    let validatorKeyValuePairs: stringDictionary = {};
    Object.keys(err.errors).forEach((key) => {
      validatorKeyValuePairs[key] = err.errors[key].message;
    });
    customError.message = "Data validation error";
    customError.data = validatorKeyValuePairs;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // to handle mongo db duplicate value errors
  if (err.code && err.code === 11000) {
    customError.message = `${Object.keys(
      err.keyValue
    )} already exists. Please choose another value`;

    customError.statusCode = StatusCodes.CONFLICT;
  }

  // to handle mongo db cast errors
  if (err.name === "CastError") {
    customError.message = `No item found with ID ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  console.log(err);

  return res
    .status(customError.statusCode)
    .json({ message: customError.message, data: customError.data });
};

export default { errorHandler };
