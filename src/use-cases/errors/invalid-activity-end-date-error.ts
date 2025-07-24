export class InvalidActivityEndDateError extends Error {
  constructor() {
    super("Activity occurs date must be before the trip end date");
  }
}
