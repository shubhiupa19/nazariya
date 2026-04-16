export type ReframeTone = "Gentle" | "Direct" | "Analytical";

export type ReframeRequest = {
  whatDidYouSee: string;
  brainStory: string;
  currentTruth: string;
  tone: ReframeTone;
  selectedPerspective?: {
    title: string;
    shortDescription: string;
    aspirationTheme: string;
    tags: string[];
  };
};

export type ReframeOutput = {
  whatHappened: string;
  whatsMissing: string;
  realPerspective: string;
  reAnchor: string;
  safetyMode?: boolean;
};

export type ReframeFixture = {
  name: string;
  input: ReframeRequest;
  output: ReframeOutput;
};

export const reframeResponseSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "whatHappened",
    "whatsMissing",
    "realPerspective",
    "reAnchor"
  ],
  properties: {
    whatHappened: {
      type: "string",
      minLength: 40,
      maxLength: 500
    },
    whatsMissing: {
      type: "string",
      minLength: 40,
      maxLength: 700
    },
    realPerspective: {
      type: "string",
      minLength: 40,
      maxLength: 700
    },
    reAnchor: {
      type: "string",
      minLength: 30,
      maxLength: 500
    }
  }
} as const;

const toneGuidance: Record<ReframeTone, string> = {
  Gentle:
    "Use soft, steady language. Acknowledge the sting of the moment without amplifying it.",
  Direct:
    "Use plainspoken language. Name the distortion clearly without sounding harsh, smug, or corrective.",
  Analytical:
    "Use precise, composed language. Distinguish observation, inference, and omitted context."
};

export function buildReframeSystemPrompt(input: ReframeRequest) {
  return [
    "You are Nazariya. You help people correct distorted comparison-based conclusions.",
    "The user has seen another person's visible milestone and their mind has turned it into a painful story about their own life.",
    "Write like a thoughtful friend with good judgment, not like a chatbot, therapist, coach, or motivational speaker.",
    "Your tone must be calm, observant, grounded, emotionally intelligent, and concise.",
    "Never use toxic positivity.",
    "Never tell the user that others have it worse.",
    "Never attack, belittle, or undermine the comparison target.",
    "Never invent named people, backstories, or fabricated individuals.",
    "Never sound like Instagram-style inspiration or life advice content.",
    "Never use therapy cliches, healing language, affirmations, or self-help slogans.",
    "Do not shame the user for reacting strongly.",
    "Do not minimize the feeling, but do not romanticize it either.",
    "Stay specific to the user's input. Do not drift into generic reflections.",
    "If optional perspective context is provided, use it lightly as an extra reminder of human complexity and aspiration. Do not force it into every section if it does not fit naturally.",
    "The output must contain exactly four sections with these purposes:",
    "What happened: briefly describe the visible event and the conclusion the user's mind attached to it.",
    "What's missing: identify the absent context, unknowns, and asymmetries in the comparison.",
    "A real perspective: offer a cleaner interpretation that is believable, sober, and non-performative.",
    "Re-anchor: return the user to the concrete truth of their present life, constraints, responsibilities, and progress.",
    "Each section should be 2 to 4 sentences, concise, and free of filler.",
    toneGuidance[input.tone]
  ].join(" ");
}

export function buildReframeUserMessage(input: ReframeRequest) {
  return [
    `What the user saw: ${input.whatDidYouSee}`,
    `The story their brain told: ${input.brainStory}`,
    `What is actually true about their life right now: ${input.currentTruth}`,
    input.selectedPerspective
      ? `Optional selected perspective context: ${input.selectedPerspective.title} - ${input.selectedPerspective.shortDescription} Theme: ${input.selectedPerspective.aspirationTheme}. Tags: ${input.selectedPerspective.tags.join(", ")}.`
      : "Optional selected perspective context: none.",
    `Requested tone: ${input.tone}`,
    "Return only the structured response."
  ].join("\n");
}

export const reframeTestFixtures: ReframeFixture[] = [
  {
    name: "promotion and apartment post",
    input: {
      whatDidYouSee:
        "I saw someone my age post about getting promoted and moving into a beautiful apartment in the same week.",
      brainStory:
        "My brain told me I am behind in every category and that I have mismanaged my twenties.",
      currentTruth:
        "I am recovering from burnout, paying off debt, and rebuilding stability more slowly than I expected.",
      tone: "Gentle"
    },
    output: {
      whatHappened:
        "You saw a polished update that bundled career momentum and visible stability into one sharp comparison point. Your mind took that moment and treated it like a verdict on the state of your own life.",
      whatsMissing:
        "You are seeing the outcome, not the structure underneath it. You do not know the support, timing, private strain, compromises, or earlier instability behind that post, and the comparison also skips over the fact that you are rebuilding after real exhaustion and debt.",
      realPerspective:
        "This may be a real milestone for them, but it is not reliable proof that you have failed. It is one visible moment placed beside the most vulnerable reading of your own timeline, which is why it lands as harder truth than it actually is.",
      reAnchor:
        "What is true is that you are recovering, paying things down, and creating stability again. That is slower than you wanted, but it is still movement, and it is a more honest frame for your life than someone else's highlight."
    }
  },
  {
    name: "engagement announcement while single",
    input: {
      whatDidYouSee:
        "I saw a close friend get engaged after posting a ring photo and a long caption about finding the right person.",
      brainStory:
        "My brain said I am unchosen and that everyone else is moving into adult life while I am still stuck.",
      currentTruth:
        "I am single, I want partnership, and I have also been carrying a lot of grief and family responsibility this year.",
      tone: "Gentle"
    },
    output: {
      whatHappened:
        "You saw a visible symbol of commitment and your mind turned it into a judgment about your own place in life. The post did not just register as news; it registered as evidence against you.",
      whatsMissing:
        "You do not know the full history, difficulty, or complexity inside their relationship just from the announcement. The comparison also leaves out the fact that your year has included grief and family weight, which changes what energy and openness have realistically been available to you.",
      realPerspective:
        "Their engagement can be meaningful without meaning you are unwanted or left behind. Your pain here is real, but the conclusion that you are fundamentally unchosen is larger and harsher than the evidence supports.",
      reAnchor:
        "What is true is that you want partnership and you are also moving through a demanding season. That does not erase the ache, but it does return you to a more accurate picture of your life than the ring photo alone."
    }
  },
  {
    name: "startup fundraise headline",
    input: {
      whatDidYouSee:
        "I saw a founder on LinkedIn announce a big fundraise with press coverage and hundreds of congratulatory comments.",
      brainStory:
        "My brain said I missed my shot and that my work is invisible because I am not exceptional enough.",
      currentTruth:
        "I have been building carefully, I am early, and I am still supporting myself with contract work while figuring out what is viable.",
      tone: "Direct"
    },
    output: {
      whatHappened:
        "You saw public validation tied to money, attention, and momentum. Your mind jumped from that visible success to the conclusion that your quieter path must mean you are not good enough.",
      whatsMissing:
        "You are missing the years before the announcement, the network effects, the timing, the failed versions, and the unseen help behind that moment. You are also leaving out that you are still in an early building phase and carrying the practical burden of supporting yourself at the same time.",
      realPerspective:
        "A headline is not a clean measurement tool. It tells you that one company had a visible win; it does not tell you that your work is invalid or that your window is closed.",
      reAnchor:
        "What is true is that you are still building and testing while keeping yourself afloat. That is not glamorous, but it is real work, and it deserves to be evaluated on its actual stage rather than against someone else's announcement."
    }
  },
  {
    name: "peer bought a house",
    input: {
      whatDidYouSee:
        "I saw an old classmate post photos of a house they just bought in the suburbs with a caption about feeling settled.",
      brainStory:
        "My brain told me I am financially irresponsible and that I have nothing solid to show for my life.",
      currentTruth:
        "I live in a rented apartment in an expensive city, I chose flexibility for work, and I am still building savings after a career change.",
      tone: "Analytical"
    },
    output: {
      whatHappened:
        "You observed a home purchase and interpreted it as a broader indicator of adulthood and solidity. The comparison then converted a different financial and geographic situation into a character judgment about your own life.",
      whatsMissing:
        "The missing information includes their housing market, family assistance, household income structure, debt profile, risk tolerance, and long-term tradeoffs. The comparison also omits your own chosen context: an expensive city, a recent career shift, and a preference for flexibility while rebuilding savings.",
      realPerspective:
        "Buying a house is a real milestone, but it is not a universal benchmark that cleanly translates across different locations, priorities, and timelines. The conclusion that you are irresponsible is not derived from the post itself; it is an extra inference your mind added.",
      reAnchor:
        "What is true is that you made a tradeoff in favor of flexibility during a career transition and are still rebuilding financially. That may or may not match someone else's version of settled, but it is a coherent reality, not evidence of personal failure."
    }
  },
  {
    name: "friend ran a marathon after illness",
    input: {
      whatDidYouSee:
        "I saw a friend finish a marathon and write about discipline and consistency after training for months.",
      brainStory:
        "My brain said I am weak and that I can never follow through on anything important.",
      currentTruth:
        "I have been dealing with a chronic health issue and my energy has been unpredictable for most of this year.",
      tone: "Gentle"
    },
    output: {
      whatHappened:
        "You saw an achievement built around endurance and consistency, and it hit a painful place in you. Your mind turned their finish line into a broad claim about your own strength and character.",
      whatsMissing:
        "The post does not account for the difference between training with a workable baseline and living inside an unpredictable body. It also skips the fact that your year has been shaped by a chronic health issue, which changes what consistency can realistically look like.",
      realPerspective:
        "Their marathon may reflect real effort, but it does not prove that you are weak. It mostly highlights that you are judging yourself by a standard that ignores the physical reality you are currently carrying.",
      reAnchor:
        "What is true is that your energy has been unstable and you have had to live with real limits. Strength in this season may look less visible, but it still counts, and it should be measured against the life you are actually in."
    }
  },
  {
    name: "younger sibling earns more",
    input: {
      whatDidYouSee:
        "I found out my younger sibling is making significantly more money than I am already.",
      brainStory:
        "My brain said I am the disappointing one and that I should be further ahead by now.",
      currentTruth:
        "I chose a lower-paying field that I care about, and I have also been helping my parents financially for years.",
      tone: "Direct"
    },
    output: {
      whatHappened:
        "You got a concrete comparison point around income and age. Your mind immediately converted that difference into a ranking of worth and competence inside your own family story.",
      whatsMissing:
        "Income alone does not show field differences, personal tradeoffs, emotional cost, or the money and energy you have already been directing toward your parents. The comparison is flattening two very different sets of obligations into one blunt score.",
      realPerspective:
        "Your sibling earning more does not automatically make you the disappointing one. It means their current market value is higher in one domain; it does not settle the question of whether your life choices have been careless or empty.",
      reAnchor:
        "What is true is that you chose work you care about and have been carrying family responsibility alongside it. That may limit your earning curve, but it is part of the actual picture and cannot be edited out when you assess your life."
    }
  },
  {
    name: "friend had a baby",
    input: {
      whatDidYouSee:
        "I saw a friend announce the birth of their second child with photos that made their family life look full and settled.",
      brainStory:
        "My brain told me I waited too long to build a life and now I am going to miss my chance.",
      currentTruth:
        "I am still unsure whether I want children, and I have only recently reached a more stable point in work and mental clarity.",
      tone: "Analytical"
    },
    output: {
      whatHappened:
        "You saw a family milestone presented as warmth, continuity, and arrival. Your mind interpreted that image as a countdown on your own life and turned uncertainty into perceived lateness.",
      whatsMissing:
        "The missing context includes the private cost, strain, timing, fertility realities, and personal complexity behind parenthood. The comparison also excludes a key fact about your side of the equation: you are only recently arriving at greater stability and you are still genuinely undecided.",
      realPerspective:
        "Their second child is evidence of their path, not a ruling on yours. The post does not prove you have waited too long; it only activates the fear that uncertainty might become regret.",
      reAnchor:
        "What is true is that you are at a more stable point only recently and are still clarifying what you want. That uncertainty deserves honest attention, but it should not be rushed into a false emergency by someone else's family photo."
    }
  },
  {
    name: "coworker gives TEDx talk",
    input: {
      whatDidYouSee:
        "I saw a coworker post clips from a TEDx talk and everyone at work was praising how articulate and accomplished they are.",
      brainStory:
        "My brain said I am forgettable and that I will never be the person people naturally notice or respect.",
      currentTruth:
        "I do good work, but I am quieter, less self-promoting, and still learning how to speak with confidence in public.",
      tone: "Direct"
    },
    output: {
      whatHappened:
        "You saw a highly visible display of confidence and recognition. Your mind took that public moment and turned it into a deeper claim that you are fundamentally forgettable.",
      whatsMissing:
        "A talk reflects one skill in one setting, not the whole measure of a person. You are also ignoring the difference between being quieter by temperament, still learning public confidence, and actually being unworthy of respect.",
      realPerspective:
        "Your coworker may be strong at visible performance, but that does not mean you are negligible. The conclusion that you will never be respected is a leap from one moment of public praise to a total story about your value.",
      reAnchor:
        "What is true is that you do solid work and are still developing a public voice. That is a narrower and more accurate reality than the story that you are invisible by nature."
    }
  },
  {
    name: "artist friend's sold-out show",
    input: {
      whatDidYouSee:
        "I saw an artist friend post that their show sold out and there were photos of a full room and people celebrating them.",
      brainStory:
        "My brain said I am talentless and that I have been wasting years on work nobody wants.",
      currentTruth:
        "I am still early in my craft, I have had inconsistent time because of my day job, and I have not yet made enough work to be seen clearly.",
      tone: "Gentle"
    },
    output: {
      whatHappened:
        "You saw visible demand and recognition around someone else's creative work, and it landed right on your own doubts. Your mind turned their full room into a harsh summary of your talent and your time.",
      whatsMissing:
        "You are not seeing their years of making, their network, the work that did not land, or the invisible repetitions behind that turnout. You are also comparing that event to a phase where your own practice has been fragmented by a day job and limited time.",
      realPerspective:
        "A sold-out show does not prove you are talentless. It mostly shows that you placed someone else's public result beside your own most insecure reading of unfinished work.",
      reAnchor:
        "What is true is that you are still early, your time has been uneven, and your body of work is still forming. That may be frustrating, but it is a much more accurate frame than calling the whole effort wasted."
    }
  },
  {
    name: "former partner moved on quickly",
    input: {
      whatDidYouSee:
        "I saw my former partner posting with someone new looking happy only a few months after our breakup.",
      brainStory:
        "My brain said I was easy to replace and that I am the one who is still broken and stuck.",
      currentTruth:
        "I am still grieving the relationship, trying to stabilize myself, and I have been more withdrawn since the breakup.",
      tone: "Analytical"
    },
    output: {
      whatHappened:
        "You saw your former partner in a new visible context and interpreted it as evidence about your replaceability and your own emotional condition. The image became more than information; it became a referendum on your worth.",
      whatsMissing:
        "You do not know what that new relationship actually is, how they are coping privately, or what is being omitted from the post. The comparison also ignores the fact that you are still in an active grief process, which makes your slower recovery feel like evidence of defect when it may simply be evidence of impact.",
      realPerspective:
        "Their visible movement does not prove that you were easy to replace. It only shows that they are presenting a new chapter while you are still feeling the weight of the old one, and those are not equivalent measures of health or value.",
      reAnchor:
        "What is true is that you are still grieving and trying to stabilize after a breakup that affected you deeply. That may feel exposed next to their post, but it is not the same as being broken or left behind as a person."
    }
  }
];
