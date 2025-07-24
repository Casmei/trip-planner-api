export class InvalidActivityStartDateError extends Error {
  constructor() {
    super("Activity occurs date must be after the trip start date");
  }
}
