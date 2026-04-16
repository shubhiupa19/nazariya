import { describe, it, expect } from "vitest";

import {
  validateTextField,
  validateTone,
  validateReframeRequest,
  validateReframeOutput,
  VALIDATION_CONFIG,
} from "../validation";
import {
  VALID_REFRAME_REQUESTS,
  INVALID_REFRAME_REQUESTS,
  VALID_REFRAME_OUTPUTS,
  INVALID_REFRAME_OUTPUTS,
} from "./fixtures";

describe("validateTextField", () => {
  it("accepts a valid string", () => {
    const result = validateTextField(
      "This is a valid text field here today.",
      "testField"
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("This is a valid text field here today.");
    }
  });

  it("trims surrounding whitespace", () => {
    const result = validateTextField("  spaced out text content  ", "testField");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("spaced out text content");
    }
  });

  it("rejects strings below minimum length", () => {
    const result = validateTextField("short", "field");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.toLowerCase()).toContain("12 characters");
    }
  });

  it("rejects strings exceeding maximum length", () => {
    const result = validateTextField(
      "x".repeat(VALIDATION_CONFIG.MAX_TEXT_LENGTH + 1),
      "field"
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("2000 characters");
    }
  });

  it("rejects non-string values", () => {
    const result = validateTextField(123, "field");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.toLowerCase()).toContain("must be a string");
    }
  });

  it("rejects empty strings", () => {
    const result = validateTextField("", "field");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.toLowerCase()).toContain("empty");
    }
  });

  it("rejects strings that are only whitespace", () => {
    const result = validateTextField("   ", "field");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.toLowerCase()).toContain("empty");
    }
  });

  it("respects custom minLength option", () => {
    const result = validateTextField("hi", "field", { minLength: 1 });
    expect(result.success).toBe(true);
  });

  it("respects custom maxLength option", () => {
    const result = validateTextField("hello world", "field", { maxLength: 5 });
    expect(result.success).toBe(false);
  });
});

describe("validateTone", () => {
  it.each(["Gentle", "Direct", "Analytical"] as const)(
    'accepts valid tone "%s"',
    (tone) => {
      const result = validateTone(tone);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(tone);
      }
    }
  );

  it("rejects an invalid tone string", () => {
    const result = validateTone("Aggressive");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Gentle, Direct, Analytical");
    }
  });

  it("rejects a non-string value", () => {
    const result = validateTone(123);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.toLowerCase()).toContain("must be a string");
    }
  });

  it("rejects null", () => {
    const result = validateTone(null);
    expect(result.success).toBe(false);
  });
});

describe("validateReframeRequest", () => {
  for (const { name, data } of VALID_REFRAME_REQUESTS) {
    it(`accepts valid request: ${name}`, () => {
      const result = validateReframeRequest(data);
      expect(result.success).toBe(true);
    });
  }

  for (const { name, data, expectedError } of INVALID_REFRAME_REQUESTS) {
    it(`rejects invalid request: ${name}`, () => {
      const result = validateReframeRequest(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.toLowerCase()).toContain(
          expectedError.toLowerCase()
        );
      }
    });
  }

  it("rejects a non-object body", () => {
    const result = validateReframeRequest("not an object");
    expect(result.success).toBe(false);
  });

  it("accepts requests with special characters", () => {
    const result = validateReframeRequest({
      whatDidYouSee: "They posted: 'I got promoted!' 🎉",
      brainStory: "They're ahead... I'm not enough... #comparison",
      currentTruth: "I've been working on learning (incrementally).",
      tone: "Gentle",
    });
    expect(result.success).toBe(true);
  });

  it("accepts requests with multi-line text", () => {
    const result = validateReframeRequest({
      whatDidYouSee:
        "They posted about getting promoted.\nThen they posted about their raise.",
      brainStory:
        "Everyone is progressing faster than me.\nI should be further along.",
      currentTruth:
        "I have been in my role for two years.\nI have received positive feedback.",
      tone: "Direct",
    });
    expect(result.success).toBe(true);
  });
});

describe("validateReframeOutput", () => {
  for (const { name, data } of VALID_REFRAME_OUTPUTS) {
    it(`accepts valid output: ${name}`, () => {
      const result = validateReframeOutput(data);
      expect(result.success).toBe(true);
    });
  }

  for (const { name, data, expectedError } of INVALID_REFRAME_OUTPUTS) {
    it(`rejects invalid output: ${name}`, () => {
      const result = validateReframeOutput(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.toLowerCase()).toContain(
          expectedError.toLowerCase()
        );
      }
    });
  }

  it("returns trimmed field data on success", () => {
    const result = validateReframeOutput({
      whatHappened:
        "  You saw someone else succeed and your mind turned it into a verdict about your own standing.  ",
      whatsMissing:
        "The context behind their result is missing — you do not know the effort, timeline, or help they had.",
      realPerspective:
        "Their outcome is real, but it is not a reliable measurement of your worth or your pace.",
      reAnchor: "You are still working. That is a real fact about your life right now.",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.whatHappened).not.toMatch(/^\s|\s$/);
    }
  });
});
