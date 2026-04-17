/**
 * Error handling verification utilities.
 * Provides structured error tracking and verification for API responses.
 */

/**
 * Structured error information for verification and logging.
 */
export interface ErrorInfo {
  status: number;
  message: string;
  type: "validation" | "auth" | "api" | "server" | "unknown";
  timestamp: string;
  recoverable: boolean;
}

/**
 * Categorize an error into a known type.
 */
export function categorizeError(
  statusCode: number,
  _message: string,
): ErrorInfo["type"] {
  if (statusCode >= 400 && statusCode < 500) {
    if (statusCode === 401 || statusCode === 403) {
      return "auth";
    }
    return "validation";
  }
  if (statusCode === 502 || statusCode === 503) {
    return "api";
  }
  if (statusCode >= 500) {
    return "server";
  }
  return "unknown";
}

/**
 * Determine if an error is recoverable (can be retried).
 */
export function isRecoverable(statusCode: number): boolean {
  if (statusCode === 429) {
    return true;
  }
  if (statusCode >= 500) {
    return true;
  }
  return false;
}

/**
 * Create a structured error info object.
 */
export function createErrorInfo(
  statusCode: number,
  message: string,
): ErrorInfo {
  return {
    status: statusCode,
    message,
    type: categorizeError(statusCode, message),
    timestamp: new Date().toISOString(),
    recoverable: isRecoverable(statusCode),
  };
}

/**
 * Get user-friendly error message based on status and type.
 */
export function getUserFriendlyMessage(error: ErrorInfo): string {
  switch (error.type) {
    case "validation":
      return error.message;
    case "auth":
      return "Server configuration issue. Please try again later.";
    case "api":
      return error.recoverable
        ? "OpenAI is experiencing issues. Please try again in a moment."
        : "Unable to connect to the AI service. Please check your connection.";
    case "server":
      return error.recoverable
        ? "Server is temporarily unavailable. Please try again shortly."
        : "Server error. Please try again later.";
    case "unknown":
    default:
      return "Something went wrong while generating perspective. Please try again.";
  }
}

/**
 * Verify that an error response has all required fields.
 */
export function verifyErrorResponse(response: unknown): boolean {
  if (typeof response !== "object" || response === null) {
    return false;
  }

  const candidate = response as Record<string, unknown>;

  if (typeof candidate.error !== "string" || candidate.error.length === 0) {
    return false;
  }

  return true;
}

/**
 * Verify that a success response has all required fields.
 */
export function verifySuccessResponse(response: unknown): boolean {
  if (typeof response !== "object" || response === null) {
    return false;
  }

  const candidate = response as Record<string, unknown>;

  const requiredFields = [
    "whatHappened",
    "whatsMissing",
    "realPerspective",
    "reAnchor",
  ];

  for (const field of requiredFields) {
    if (typeof candidate[field] !== "string" || candidate[field] === "") {
      return false;
    }
  }

  return true;
}

/**
 * Verify API response validity (either success or error).
 */
export function verifyAPIResponse(
  response: unknown,
  statusOk: boolean,
): boolean {
  if (statusOk) {
    return verifySuccessResponse(response);
  } else {
    return verifyErrorResponse(response);
  }
}

/**
 * Error handler that provides consistent error responses.
 */
export class APIErrorHandler {
  private errors: ErrorInfo[] = [];

  addError(statusCode: number, message: string): void {
    this.errors.push(createErrorInfo(statusCode, message));
  }

  getLastError(): ErrorInfo | undefined {
    return this.errors[this.errors.length - 1];
  }

  getAllErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  getRecoverableErrors(): ErrorInfo[] {
    return this.errors.filter((e) => e.recoverable);
  }

  clearErrors(): void {
    this.errors = [];
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  reset(): void {
    this.clearErrors();
  }
}
