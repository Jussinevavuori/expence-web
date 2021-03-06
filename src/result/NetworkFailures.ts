import { AxiosError } from "axios";
import { Failure } from "./Failure";

export type ServerFailureCode =
  | "server/unavailable"
  | "server/failure-formulating-request"
  | "request/invalid-request-data"
  | "request/too-many-requests"
  | "request/missing-query-parameters"
  | "request/missing-url-parameters"
  | "transaction/already-exists"
  | "transaction/not-found"
  | "auth/missing-token"
  | "auth/invalid-token"
  | "auth/user-has-no-password"
  | "auth/invalid-credentials"
  | "auth/unauthenticated"
  | "auth/unauthorized"
  | "auth/user-not-found"
  | "auth/user-already-exists"
  | "auth/email-not-confirmed"
  | "auth/email-already-confirmed"
  | "mail/error"
  | "database/access-failure"
  | "failure/validation"
  | "failure/unimplemented"
  | "failure/error"
  | "failure/unknown"
  | "failure/cors";

type NetworkFailureDetails<E> = {
  status: number;
  code: ServerFailureCode;
  message: string;
  data?: E;
};

export class NetworkFailure<T, E = undefined> extends Failure<T, "network"> {
  public readonly details: NetworkFailureDetails<E>;
  public readonly status: number;
  public readonly message: string;
  public readonly code: ServerFailureCode;
  public readonly data?: E;

  constructor(details: NetworkFailureDetails<E>) {
    super("network");
    this.details = details;
    this.status = details.status;
    this.message = details.message;
    this.code = details.code;
    this.data = details.data;
  }

  static FromAxiosError<T>(
    error: AxiosError
  ): NetworkFailure<T, { errors?: any }> {
    if (error.response) {
      const data = error.response.data;

      return new NetworkFailure<T, { errors?: object }>({
        status: error.response.status,
        message:
          typeof data?.message === "string"
            ? data.message
            : "Unknown server error. Try again later.",
        code: typeof data?.code === "string" ? data.code : "server/unknown",
        data:
          data.errors && typeof data.errors === "object"
            ? { errors: data.errors }
            : {},
      });
    } else if (error.request) {
      return new NetworkFailure<T, { errors?: object }>({
        status: 0,
        code: "server/unavailable",
        message: "Could not contact server. Try again later.",
        data: {},
      });
    } else {
      return new NetworkFailure<T, { errors?: object }>({
        status: 0,
        code: "server/failure-formulating-request",
        message: "Could not formulate request to server.",
        data: {},
      });
    }
  }
}
