export class ParticipantAlreadyInTripError extends Error {
  constructor() {
    super("Participant already joined the trip.");
  }
}
