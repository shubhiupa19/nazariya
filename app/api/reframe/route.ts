import Groq from "groq-sdk";
import { NextResponse } from "next/server";

import {
  type ReframeRequest,
  type ReframeOutput,
  buildReframeSystemPrompt,
  buildReframeUserMessage,
  reframeResponseSchema,
} from "@/lib/ai/reframe-prompt";
import {
  validateReframeRequest,
  validateReframeOutput,
} from "@/lib/validation";
import { APIErrorHandler, verifyAPIResponse } from "@/lib/error-handling";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const hopelessnessPatterns = [
  /\bi feel hopeless\b/i,
  /\bi am hopeless\b/i,
  /\bnothing matters\b/i,
  /\bnever going to get better\b/i,
  /\bi can't go on\b/i,
  /\bi cannot go on\b/i,
  /\bgive up on everything\b/i,
  /\bno point in being here\b/i,
];
const selfHatePatterns = [
  /\bi hate myself\b/i,
  /\bi disgust myself\b/i,
  /\bi am worthless\b/i,
  /\bi'm worthless\b/i,
  /\bi can't stand myself\b/i,
  /\bi cannot stand myself\b/i,
  /\bi deserve nothing\b/i,
];

// Tool definition for structured output — Groq supports OpenAI-compatible
// function calling which enforces the response shape reliably.
const reframeTool: Groq.Chat.Completions.ChatCompletionTool = {
  type: "function",
  function: {
    name: "submit_reframe",
    description: "Submit the structured perspective reframe response.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: [...reframeResponseSchema.required],
      properties: reframeResponseSchema.properties,
    },
  },
};

export async function POST(request: Request) {
  const errorHandler = new APIErrorHandler();

  if (!process.env.GROQ_API_KEY) {
    errorHandler.addError(500, "GROQ_API_KEY is not configured on the server.");
    return NextResponse.json(
      { error: errorHandler.getLastError()?.message },
      { status: 500 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    errorHandler.addError(400, "Request body must be valid JSON.");
    return NextResponse.json(
      { error: errorHandler.getLastError()?.message },
      { status: 400 },
    );
  }

  const validated = validateReframeRequest(body);

  if (!validated.success) {
    errorHandler.addError(400, validated.error);
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  if (indicatesSevereDistress(validated.data)) {
    return NextResponse.json(buildSafetyResponse(validated.data.tone));
  }

  try {
    const response = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: buildReframeSystemPrompt(validated.data),
        },
        {
          role: "user",
          content: buildReframeUserMessage(validated.data),
        },
      ],
      tools: [reframeTool],
      tool_choice: { type: "function", function: { name: "submit_reframe" } },
    });

    const toolCall = response.choices[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      errorHandler.addError(502, "Model did not return a tool call response.");
      return NextResponse.json(
        { error: "Failed to generate response." },
        { status: 502 },
      );
    }

    let rawOutput: unknown;
    try {
      rawOutput = JSON.parse(toolCall.function.arguments);
    } catch {
      errorHandler.addError(502, "Model returned malformed JSON.");
      return NextResponse.json(
        { error: "Failed to parse model response." },
        { status: 502 },
      );
    }

    const parsed = validateReframeOutput(rawOutput);

    if (!parsed.success) {
      errorHandler.addError(502, parsed.error);
      return NextResponse.json(
        { error: "The model returned an invalid response shape." },
        { status: 502 },
      );
    }

    if (!verifyAPIResponse({ ...parsed.data, safetyMode: false }, true)) {
      errorHandler.addError(502, "Response verification failed.");
      return NextResponse.json(
        { error: "Response validation failed." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ...parsed.data,
      safetyMode: false,
    });
  } catch (error) {
    if (error instanceof Groq.APIError) {
      const friendlyMessage =
        error.status === 401
          ? "Groq authentication failed. Check the server API key."
          : "Groq could not generate a response right now.";

      errorHandler.addError(error.status || 502, friendlyMessage);
      return NextResponse.json(
        { error: friendlyMessage },
        { status: error.status || 502 },
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "Unexpected server error while generating perspective.";
    errorHandler.addError(500, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function indicatesSevereDistress(input: ReframeRequest) {
  const text = input.brainStory;

  return (
    hopelessnessPatterns.some((pattern) => pattern.test(text)) ||
    selfHatePatterns.some((pattern) => pattern.test(text))
  );
}

function buildSafetyResponse(tone: ReframeRequest["tone"]): ReframeOutput {
  const realPerspectiveByTone = {
    Gentle:
      "This sounds heavier than a normal comparison spiral. You do not need to solve it or force clarity right this second; the steadier move is to reduce stimulation, step away from the input that intensified this, and let the moment come down a notch first.",
    Direct:
      "This reads as more than a standard perspective correction moment. A clean reframe is not the right tool first; step away from the trigger, interrupt the spiral, and lower the intensity before asking your mind to interpret anything.",
    Analytical:
      "The emotional intensity here suggests the problem is no longer just distorted comparison. When the language turns this absolute or self-attacking, interpretation becomes less reliable, so the next useful step is to reduce input and stabilize rather than continue analyzing.",
  };

  return {
    whatHappened:
      "What you wrote suggests a level of hopelessness or self-directed hostility that calls for a steadier response than a normal reframe. This does not look like a moment to keep pushing for perspective as if it were a routine comparison trigger.",
    whatsMissing:
      "What is missing right now is distance from the spiral itself. When the inner language becomes this severe, your mind is unlikely to give you a fair reading of your life in this moment.",
    realPerspective: realPerspectiveByTone[tone],
    reAnchor:
      "For now, step away from the scroll or comparison trigger, and reach out to someone grounded if you can. A trusted friend, family member, therapist, or local crisis support can help hold perspective with you; if you feel at risk of acting on these thoughts, contact emergency or crisis support now.",
    safetyMode: true,
  };
}
