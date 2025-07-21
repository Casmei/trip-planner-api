export class InvalidTripEndDateError extends Error {
  constructor() {
    super("Trip start date cannot be in the past.");
  }
}
