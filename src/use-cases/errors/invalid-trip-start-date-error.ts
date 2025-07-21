export class InvalidTripStartDateError extends Error {
  constructor() {
    super("Trip end date must be after the start date");
  }
}
