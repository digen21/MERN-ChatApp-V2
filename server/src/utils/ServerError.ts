import httpStatus, { HttpStatus } from "http-status";

class ServerError extends Error {
  public readonly statusCode: HttpStatus | number;

  public constructor({
    message,
    status,
  }: {
    message: string;
    status: HttpStatus | number;
  }) {
    super(message);
    this.statusCode = status || httpStatus.INTERNAL_SERVER_ERROR;
  }
}

export default ServerError;
