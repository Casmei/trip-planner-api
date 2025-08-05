export class InvalidTripStartDateError extends Error {
  constructor() {
    super("Trip start date must be after the today");
  }
}
