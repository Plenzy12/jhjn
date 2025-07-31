import type { Context } from "hono";

class ErrorHandler {
  public createError(
    errorCode: string,
    errorMessage: string,
    messageVars: any[] | undefined,
    numericErrorCode: number,
    error: string | undefined,
    statusCode: number,
    c: Context,
  ) {
    c.header("X-Epic-Error-Name", errorCode);
    c.header("X-Epic-Error-Code", numericErrorCode.toString());

    return c.json(
      {
        errorCode,
        errorMessage,
        messageVars,
        numericErrorCode,
        originatingService: "any",
        intent: "prod",
        error_description: errorMessage,
        error,
      },
      400,
    );
  }
}

const error = new ErrorHandler();
export default error;
