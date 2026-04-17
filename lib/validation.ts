/**
 * Validation utilities for API requests with comprehensive error handling.
 * Prioritizes clarity, type safety, and detailed error messages.
 */

import type {
  ReframeRequest,
  ReframeOutput,
  ReframeTone,
} from "@/lib/ai/reframe-prompt";

/**
 * Result type for validation operations.
 * Either succeeds with typed data or fails with a descriptive error message.
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Runtime configuration constants.
 */
export const VALIDATION_CONFIG = {
  MIN_TEXT_LENGTH: 12,
  MAX_TEXT_LENGTH: 2000,
  ALLOWED_TONES: ["Gentle", "Direct", "Analytical"] as const,
} as const;

/**
 * Validate that a value is a non-empty string with length constraints.
 */
export function validateTextField(
  value: unknown,
  fieldName: string,
  options: {
    minLength?: number;
    maxLength?: number;
  } = {}
): ValidationResult<string> {
  const { minLength = VALIDATION_CONFIG.MIN_TEXT_LENGTH, maxLength = VALIDATION_CONFIG.MAX_TEXT_LENGTH } =
    options;

  if (typeof value !== "string") {
    return {
      success: false,
      error: `${fieldName} must be a string.`,
    };
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return {
      success: false,
      error: `${fieldName} cannot be empty.`,
    };
  }

  if (trimmed.length < minLength) {
    return {
      success: false,
      error: `${fieldName} must be at least ${minLength} characters long.`,
    };
  }

  if (trimmed.length > maxLength) {
    return {
      success: false,
      error: `${fieldName} must be ${maxLength} characters or fewer.`,
    };
  }

  return {
    success: true,
    data: trimmed,
  };
}

/**
 * Validate that a value is one of the allowed tones.
 */
export function validateTone(value: unknown): ValidationResult<ReframeTone> {
  if (typeof value !== "string") {
    return {
      success: false,
      error: "Tone must be a string.",
    };
  }

  if (!VALIDATION_CONFIG.ALLOWED_TONES.includes(value as ReframeTone)) {
    return {
      success: false,
      error: `Tone must be one of: ${VALIDATION_CONFIG.ALLOWED_TONES.join(", ")}.`,
    };
  }

  return {
    success: true,
    data: value as ReframeTone,
  };
}

/**
 * Validate optional selected perspective data.
 */
export function validateSelectedPerspective(
  value: unknown
): ValidationResult<ReframeRequest["selectedPerspective"] | undefined> {
  if (value === null || value === undefined) {
    return {
      success: true,
      data: undefined,
    };
  }

  if (typeof value !== "object") {
    return {
      success: false,
      error: "selectedPerspective must be an object or null.",
    };
  }

  const candidate = value as Partial<
    Record<"title" | "shortDescription" | "aspirationTheme" | "tags", unknown>
  >;

  const titleValidation = validateTextField(
    candidate.title,
    "selectedPerspective.title",
    { minLength: 1, maxLength: 200 }
  );
  if (!titleValidation.success) {
    return titleValidation;
  }

  const descriptionValidation = validateTextField(
    candidate.shortDescription,
    "selectedPerspective.shortDescription",
    { minLength: 10, maxLength: 500 }
  );
  if (!descriptionValidation.success) {
    return descriptionValidation;
  }

  const themeValidation = validateTextField(
    candidate.aspirationTheme,
    "selectedPerspective.aspirationTheme",
    { minLength: 1, maxLength: 100 }
  );
  if (!themeValidation.success) {
    return themeValidation;
  }

  if (!Array.isArray(candidate.tags)) {
    return {
      success: false,
      error: "selectedPerspective.tags must be an array.",
    };
  }

  const tags = candidate.tags.filter(
    (tag): tag is string =>
      typeof tag === "string" && tag.trim().length > 0
  );

  if (tags.length > 50) {
    return {
      success: false,
      error: "selectedPerspective.tags cannot exceed 50 items.",
    };
  }

  return {
    success: true,
    data: {
      title: titleValidation.data,
      shortDescription: descriptionValidation.data,
      aspirationTheme: themeValidation.data,
      tags,
    },
  };
}

/**
 * Validate a complete reframe request.
 * Returns strongly typed data on success or detailed error on failure.
 */
export function validateReframeRequest(
  body: unknown
): ValidationResult<ReframeRequest> {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {
      success: false,
      error: "Request body must be a JSON object.",
    };
  }

  const candidate = body as Record<string, unknown>;

  // Validate whatDidYouSee
  const whatDidYouSeeValidation = validateTextField(
    candidate.whatDidYouSee,
    "whatDidYouSee"
  );
  if (!whatDidYouSeeValidation.success) {
    return whatDidYouSeeValidation;
  }

  // Validate brainStory
  const brainStoryValidation = validateTextField(
    candidate.brainStory,
    "brainStory"
  );
  if (!brainStoryValidation.success) {
    return brainStoryValidation;
  }

  // Validate tone
  const toneValidation = validateTone(candidate.tone);
  if (!toneValidation.success) {
    return toneValidation;
  }

  // Validate selectedPerspective (optional)
  const perspectiveValidation = validateSelectedPerspective(
    candidate.selectedPerspective
  );
  if (!perspectiveValidation.success) {
    return perspectiveValidation;
  }

  return {
    success: true,
    data: {
      whatDidYouSee: whatDidYouSeeValidation.data,
      brainStory: brainStoryValidation.data,
      tone: toneValidation.data,
      selectedPerspective: perspectiveValidation.data ?? undefined,
    },
  };
}

/**
 * Parse and validate reframe output from the model.
 * Ensures output conforms to expected structure and constraints.
 */
export function validateReframeOutput(
  data: unknown
): ValidationResult<ReframeOutput> {
  if (!data || typeof data !== "object") {
    return {
      success: false,
      error: "Output must be a JSON object.",
    };
  }

  const candidate = data as Record<string, unknown>;

  // Require all fields
  const requiredFields = [
    "whatHappened",
    "whatsMissing",
    "realPerspective",
    "reAnchor",
  ] as const;

  for (const field of requiredFields) {
    if (!(field in candidate)) {
      return {
        success: false,
        error: `Output is missing required field: ${field}.`,
      };
    }
  }

  // Validate each field is a non-empty string
  const whatHappenedValidation = validateTextField(
    candidate.whatHappened,
    "whatHappened",
    { minLength: 40, maxLength: 500 }
  );
  if (!whatHappenedValidation.success) {
    return whatHappenedValidation;
  }

  const whatsMissingValidation = validateTextField(
    candidate.whatsMissing,
    "whatsMissing",
    { minLength: 40, maxLength: 700 }
  );
  if (!whatsMissingValidation.success) {
    return whatsMissingValidation;
  }

  const realPerspectiveValidation = validateTextField(
    candidate.realPerspective,
    "realPerspective",
    { minLength: 40, maxLength: 700 }
  );
  if (!realPerspectiveValidation.success) {
    return realPerspectiveValidation;
  }

  const reAnchorValidation = validateTextField(
    candidate.reAnchor,
    "reAnchor",
    { minLength: 30, maxLength: 500 }
  );
  if (!reAnchorValidation.success) {
    return reAnchorValidation;
  }

  return {
    success: true,
    data: {
      whatHappened: whatHappenedValidation.data,
      whatsMissing: whatsMissingValidation.data,
      realPerspective: realPerspectiveValidation.data,
      reAnchor: reAnchorValidation.data,
    },
  };
}
