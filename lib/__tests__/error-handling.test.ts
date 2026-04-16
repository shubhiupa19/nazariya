import { describe, it, expect, beforeEach } from "vitest";

import {
  categorizeError,
  isRecoverable,
  createErrorInfo,
  getUserFriendlyMessage,
  verifyErrorResponse,
  verifySuccessResponse,
  verifyAPIResponse,
  APIErrorHandler,
} from "../error-handling";

describe("categorizeError", () => {
  it("classifies 401 as auth", () => {
    expect(categorizeError(401, "")).toBe("auth");
  });

  it("classifies 403 as auth", () => {
    expect(categorizeError(403, "")).toBe("auth");
  });

  it("classifies 400 as validation", () => {
    expect(categorizeError(400, "")).toBe("validation");
  });

  it("classifies 422 as validation", () => {
    expect(categorizeError(422, "")).toBe("validation");
  });

  it("classifies 502 as api", () => {
    expect(categorizeError(502, "")).toBe("api");
  });

  it("classifies 503 as api", () => {
    expect(categorizeError(503, "")).toBe("api");
  });

  it("classifies 500 as server", () => {
    expect(categorizeError(500, "")).toBe("server");
  });

  it("classifies 200 as unknown", () => {
    expect(categorizeError(200, "")).toBe("unknown");
  });
});

describe("isRecoverable", () => {
  it("marks 429 (rate limit) as recoverable", () => {
    expect(isRecoverable(429)).toBe(true);
  });

  it("marks 500 as recoverable", () => {
    expect(isRecoverable(500)).toBe(true);
  });

  it("marks 503 as recoverable", () => {
    expect(isRecoverable(503)).toBe(true);
  });

  it("marks 400 as not recoverable", () => {
    expect(isRecoverable(400)).toBe(false);
  });

  it("marks 401 as not recoverable", () => {
    expect(isRecoverable(401)).toBe(false);
  });
});

describe("createErrorInfo", () => {
  it("creates a complete ErrorInfo object", () => {
    const info = createErrorInfo(400, "Bad request");
    expect(info.status).toBe(400);
    expect(info.message).toBe("Bad request");
    expect(info.type).toBe("validation");
    expect(info.recoverable).toBe(false);
    expect(info.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("includes a valid ISO timestamp", () => {
    const before = Date.now();
    const info = createErrorInfo(500, "error");
    const after = Date.now();
    const ts = new Date(info.timestamp).getTime();
    expect(ts).toBeGreaterThanOrEqual(before);
    expect(ts).toBeLessThanOrEqual(after);
  });
});

describe("getUserFriendlyMessage", () => {
  it("returns the original message for validation errors", () => {
    const info = createErrorInfo(400, "brainStory must be at least 12 characters long.");
    expect(getUserFriendlyMessage(info)).toBe(
      "brainStory must be at least 12 characters long."
    );
  });

  it("returns a generic message for auth errors", () => {
    const info = createErrorInfo(401, "unauthorized");
    expect(getUserFriendlyMessage(info)).toContain("configuration");
  });

  it("returns a retry message for recoverable api errors", () => {
    const info = createErrorInfo(503, "service unavailable");
    const message = getUserFriendlyMessage(info);
    expect(message.toLowerCase()).toContain("try again");
  });

  it("returns a retry message for recoverable server errors", () => {
    const info = createErrorInfo(503, "unavailable");
    const message = getUserFriendlyMessage(info);
    expect(message.toLowerCase()).toContain("try again");
  });

  it("returns a fallback for unknown errors", () => {
    const info = createErrorInfo(200, "unexpected");
    const message = getUserFriendlyMessage(info);
    expect(message.toLowerCase()).toContain("something went wrong");
  });
});

describe("verifyErrorResponse", () => {
  it("accepts a valid error response object", () => {
    expect(verifyErrorResponse({ error: "Something went wrong." })).toBe(true);
  });

  it("rejects a response with missing error field", () => {
    expect(verifyErrorResponse({ message: "oops" })).toBe(false);
  });

  it("rejects a response with an empty error string", () => {
    expect(verifyErrorResponse({ error: "" })).toBe(false);
  });

  it("rejects null", () => {
    expect(verifyErrorResponse(null)).toBe(false);
  });

  it("rejects a plain string", () => {
    expect(verifyErrorResponse("error text")).toBe(false);
  });
});

describe("verifySuccessResponse", () => {
  const validSuccess = {
    whatHappened: "You saw someone succeed.",
    whatsMissing: "You do not know the full picture.",
    realPerspective: "Their outcome is not a verdict on yours.",
    reAnchor: "You are still working toward your goals.",
  };

  it("accepts a complete success response", () => {
    expect(verifySuccessResponse(validSuccess)).toBe(true);
  });

  it("rejects when any required field is missing", () => {
    const { whatHappened: _, ...rest } = validSuccess;
    expect(verifySuccessResponse(rest)).toBe(false);
  });

  it("rejects when a required field is an empty string", () => {
    expect(verifySuccessResponse({ ...validSuccess, whatHappened: "" })).toBe(
      false
    );
  });

  it("rejects null", () => {
    expect(verifySuccessResponse(null)).toBe(false);
  });

  it("rejects a non-object value", () => {
    expect(verifySuccessResponse("success")).toBe(false);
  });
});

describe("verifyAPIResponse", () => {
  it("delegates to verifySuccessResponse when statusOk is true", () => {
    const valid = {
      whatHappened: "a",
      whatsMissing: "b",
      realPerspective: "c",
      reAnchor: "d",
    };
    expect(verifyAPIResponse(valid, true)).toBe(true);
    expect(verifyAPIResponse({}, true)).toBe(false);
  });

  it("delegates to verifyErrorResponse when statusOk is false", () => {
    expect(verifyAPIResponse({ error: "Something went wrong." }, false)).toBe(
      true
    );
    expect(verifyAPIResponse({}, false)).toBe(false);
  });
});

describe("APIErrorHandler", () => {
  let handler: APIErrorHandler;

  beforeEach(() => {
    handler = new APIErrorHandler();
  });

  it("starts with no errors", () => {
    expect(handler.hasErrors()).toBe(false);
    expect(handler.getAllErrors()).toHaveLength(0);
    expect(handler.getLastError()).toBeUndefined();
  });

  it("tracks added errors", () => {
    handler.addError(400, "Bad request");
    expect(handler.hasErrors()).toBe(true);
    expect(handler.getAllErrors()).toHaveLength(1);
  });

  it("returns the last error correctly", () => {
    handler.addError(400, "first");
    handler.addError(500, "second");
    expect(handler.getLastError()?.message).toBe("second");
    expect(handler.getLastError()?.status).toBe(500);
  });

  it("filters recoverable errors", () => {
    handler.addError(400, "bad request");
    handler.addError(500, "server error");
    handler.addError(429, "rate limit");
    const recoverable = handler.getRecoverableErrors();
    expect(recoverable).toHaveLength(2);
    expect(recoverable.map((e) => e.status)).toEqual(
      expect.arrayContaining([500, 429])
    );
  });

  it("clears errors on reset", () => {
    handler.addError(400, "error");
    handler.reset();
    expect(handler.hasErrors()).toBe(false);
  });

  it("getAllErrors returns a copy, not the internal array", () => {
    handler.addError(400, "error");
    const snapshot = handler.getAllErrors();
    handler.addError(500, "another");
    expect(snapshot).toHaveLength(1);
  });
});
