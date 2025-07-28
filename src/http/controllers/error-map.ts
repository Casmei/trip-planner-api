import { StatusCodes } from "http-status-codes";
import { InvalidTripEndDateError } from "../../use-cases/errors/invalid-trip-end-date-error";
import { InvalidTripStartDateError } from "../../use-cases/errors/invalid-trip-start-date-error";
import { ResourceNotFoundError } from "../../use-cases/errors/resource-not-found-error";

export const errorMap = new Map([
  [
    InvalidTripStartDateError,
    {
      status: StatusCodes.BAD_REQUEST,
      message: new InvalidTripStartDateError().message,
    },
  ],
  [
    InvalidTripEndDateError,
    {
      status: StatusCodes.BAD_REQUEST,
      message: new InvalidTripEndDateError().message,
    },
  ],
  [
    ResourceNotFoundError,
    {
      status: StatusCodes.NOT_FOUND,
      message: new ResourceNotFoundError().message,
    },
  ],
]);
