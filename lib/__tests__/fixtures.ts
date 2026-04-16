import type { ReframeRequest, ReframeOutput } from "@/lib/openai/reframe-prompt";

export const VALID_REFRAME_REQUESTS: Array<{
  name: string;
  data: ReframeRequest;
}> = [
  {
    name: "Minimal valid request - Gentle",
    data: {
      whatDidYouSee: "A former coworker announced they got promoted to senior engineer.",
      brainStory: "Everyone else is progressing faster. I am not advancing like I should be.",
      currentTruth: "I have been in my current role for 2 years with good feedback. I am still learning the codebase.",
      tone: "Gentle",
    },
  },
  {
    name: "Valid request with story - Direct",
    data: {
      whatDidYouSee:
        "A friend posted photos from their vacation in Europe, looking very happy and relaxed.",
      brainStory:
        "They have freedom and money. My life is financially constrained and boring by comparison.",
      currentTruth:
        "I am working overtime this month to save for a car. My friend has help from parents with travel expenses.",
      tone: "Direct",
      selectedPerspective: {
        title: "Learning to drive at thirty-four",
        shortDescription:
          "A person takes driving lessons to widen their opportunities.",
        aspirationTheme: "Freedom",
        tags: ["mobility", "independence"],
      },
    },
  },
  {
    name: "Valid request - Analytical",
    data: {
      whatDidYouSee:
        "Someone I know published a technical article that got lots of engagement.",
      brainStory:
        "They are producing valuable work. I have nothing worth publishing. My skills are not good enough.",
      currentTruth:
        "I code daily but have not written publicly yet. I have been focused on learning frameworks and mentoring juniors.",
      tone: "Analytical",
    },
  },
];

export const INVALID_REFRAME_REQUESTS: Array<{
  name: string;
  data: unknown;
  expectedError: string;
}> = [
  {
    name: "Missing whatDidYouSee",
    data: {
      brainStory: "I feel behind.",
      currentTruth: "I have a job.",
      tone: "Gentle",
    },
    expectedError: "whatDidYouSee",
  },
  {
    name: "whatDidYouSee too short",
    data: {
      whatDidYouSee: "short",
      brainStory: "I feel behind in my life and career development.",
      currentTruth: "I have a job and friends.",
      tone: "Gentle",
    },
    expectedError: "at least 12 characters",
  },
  {
    name: "whatDidYouSee exceeds max length",
    data: {
      whatDidYouSee: "x".repeat(2001),
      brainStory: "I feel behind in my life and career development.",
      currentTruth: "I have a job and friends.",
      tone: "Gentle",
    },
    expectedError: "2000 characters",
  },
  {
    name: "Invalid tone",
    data: {
      whatDidYouSee:
        "Someone got promoted and announced it on social media.",
      brainStory: "Everyone is ahead of me in their careers.",
      currentTruth: "I am still working in my current position.",
      tone: "Aggressive",
    },
    expectedError: "Gentle, Direct, Analytical",
  },
  {
    name: "Tone is not a string",
    data: {
      whatDidYouSee:
        "Someone got promoted and announced it on social media.",
      brainStory: "Everyone is ahead of me in their careers.",
      currentTruth: "I am still working in my current position.",
      tone: 123,
    },
    expectedError: "must be a string",
  },
  {
    name: "Body is not an object",
    data: "not an object",
    expectedError: "must be a JSON object",
  },
  {
    name: "Body is null",
    data: null,
    expectedError: "must be a JSON object",
  },
  {
    name: "Body is array",
    data: [],
    expectedError: "must be a JSON object",
  },
];

export const VALID_REFRAME_OUTPUTS: Array<{
  name: string;
  data: ReframeOutput;
}> = [
  {
    name: "Standard valid output",
    data: {
      whatHappened:
        "Your coworker received a promotion. Your mind interpreted this as proof that you should also be advancing, and quickly.",
      whatsMissing:
        "You are not seeing her private timeline, the relationships or mentorship that helped her advance, or what circumstances aligned in her favor. You are seeing an outcome, not the path.",
      realPerspective:
        "Her advancement may be real without being a verdict on your pace. You are building under different conditions and should be evaluated against your own progress, not others'.",
      reAnchor:
        "You have been in your role for 2 years with good feedback. You are still competent and learning. The timeline is not broken.",
    },
  },
  {
    name: "Safety mode output",
    data: {
      whatHappened:
        "What you wrote suggests a level of hopelessness that calls for a steadier response than a normal reframe.",
      whatsMissing:
        "What is missing right now is distance from the spiral itself. Your mind is unlikely to give you a fair reading in this moment.",
      realPerspective:
        "This reads as more than a standard perspective correction moment. Step away from the trigger first.",
      reAnchor:
        "Reach out to someone grounded if you can. A trusted friend or therapist can help hold perspective with you.",
    },
  },
];

export const INVALID_REFRAME_OUTPUTS: Array<{
  name: string;
  data: unknown;
  expectedError: string;
}> = [
  {
    name: "Output is not an object",
    data: "not an object",
    expectedError: "must be a JSON object",
  },
  {
    name: "Output is null",
    data: null,
    expectedError: "must be a JSON object",
  },
  {
    name: "Missing whatHappened",
    data: {
      whatsMissing: "Context is missing.",
      realPerspective: "Here is perspective.",
      reAnchor: "Return to reality.",
    },
    expectedError: "whatHappened",
  },
  {
    name: "whatHappened is not a string",
    data: {
      whatHappened: 123,
      whatsMissing: "Context is missing and long enough.",
      realPerspective:
        "Here is perspective and it is long enough for validation.",
      reAnchor: "Return to reality and ground yourself now.",
    },
    expectedError: "must be a string",
  },
  {
    name: "whatHappened too short",
    data: {
      whatHappened: "short",
      whatsMissing: "Context is missing and this is long enough.",
      realPerspective:
        "Here is perspective and it is definitely long enough for passing validation.",
      reAnchor: "Return to the nature of your actual reality.",
    },
    expectedError: "at least 40 characters",
  },
  {
    name: "whatsMissing exceeds max length",
    data: {
      whatHappened:
        "Your friend posted about their new job and you feel behind in your career absolutely.",
      whatsMissing: "x".repeat(701),
      realPerspective:
        "Your friend got a job but you do not know the private timeline behind their success.",
      reAnchor: "You have skills and you are progressing properly right now.",
    },
    expectedError: "700 characters",
  },
];
