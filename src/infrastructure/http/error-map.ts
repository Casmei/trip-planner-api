import { StatusCodes } from "http-status-codes";
import { InvalidTripEndDateError } from "../../core/use-cases/errors/invalid-trip-end-date-error";
import { InvalidTripStartDateError } from "../../core/use-cases/errors/invalid-trip-start-date-error";
import { ParticipantAlreadyInTripError } from "../../core/use-cases/errors/participant-already-in-trip-error";
import { ResourceNotFoundError } from "../../core/use-cases/errors/resource-not-found-error";

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
  [
    ParticipantAlreadyInTripError,
    {
      status: StatusCodes.CONFLICT,
      message: new ParticipantAlreadyInTripError().message,
    },
  ],
]);
