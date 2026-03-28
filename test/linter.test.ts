import { describe, it, expect } from "vitest";
import { lint } from "../src/core/index.js";

describe("lint", () => {
  it("returns clean result for harmless text", () => {
    const result = lint("Great job on the Q3 retrospective.");
    expect(result.issues).toHaveLength(0);
    expect(result.score).toBe(100);
  });
});

describe("em-dashes", () => {
  it("flags em dashes and suggests en dashes", () => {
    const result = lint("This is important\u2014very important.");
    const issue = result.issues.find((i) => i.rule === "em-dashes");
    expect(issue).toBeDefined();
    expect(issue!.severity).toBe("error");
    expect(issue!.matchedText).toBe("\u2014");
  });

  it("does not flag en dashes", () => {
    const result = lint("Pages 10\u201320 cover this topic.");
    expect(result.issues.find((i) => i.rule === "em-dashes")).toBeUndefined();
  });
});

describe("struggle", () => {
  it("flags 'struggle' and variants", () => {
    for (const word of ["struggle", "struggles", "struggling", "struggled"]) {
      const result = lint(`Many people ${word} with feedback.`);
      const issue = result.issues.find((i) => i.rule === "struggle");
      expect(issue).toBeDefined();
      expect(issue!.severity).toBe("warning");
    }
  });
});

describe("identity-labels", () => {
  it("flags identity labels", () => {
    for (const label of ["drivers", "rockstars", "pro", "ninjas"]) {
      const result = lint(`Our top ${label} lead the way.`);
      expect(result.issues.find((i) => i.rule === "identity-labels")).toBeDefined();
    }
  });
});

describe("loaded-language", () => {
  it("flags hyperbolic terms", () => {
    for (const term of ["addiction", "secret weapon", "game-changer"]) {
      const result = lint(`Feedback is a ${term} for growth.`);
      expect(result.issues.find((i) => i.rule === "loaded-language")).toBeDefined();
    }
  });
});

describe("shame-framing", () => {
  it("flags shame-based phrases", () => {
    for (const phrase of ["lowest score", "worst performing", "underperforming"]) {
      const result = lint(`The team had the ${phrase} this quarter.`);
      const issue = result.issues.find((i) => i.rule === "shame-framing");
      expect(issue).toBeDefined();
      expect(issue!.severity).toBe("error");
    }
  });
});

describe("clinical-terms", () => {
  it("flags clinical terms", () => {
    for (const term of ["amygdala", "neuroplasticity", "dopamine"]) {
      const result = lint(`The ${term} plays a key role.`);
      expect(result.issues.find((i) => i.rule === "clinical-terms")).toBeDefined();
    }
  });
});

describe("debrief-language", () => {
  it("flags diagnostic debrief terms", () => {
    for (const term of ["ego", "catastrophizing", "spiralling", "triggered"]) {
      const result = lint(`Their ${term} was apparent in the debrief.`);
      expect(result.issues.find((i) => i.rule === "debrief-language")).toBeDefined();
    }
  });
});

describe("profanity", () => {
  it("flags profanity and casual language", () => {
    for (const word of ["damn", "dumpster fire", "bruh", "yeet"]) {
      const result = lint(`That was a ${word} moment.`);
      const issue = result.issues.find((i) => i.rule === "profanity");
      expect(issue).toBeDefined();
      expect(issue!.severity).toBe("error");
    }
  });
});

describe("framework-claims", () => {
  it("flags proprietary claims about industry frameworks", () => {
    const result = lint("Our proprietary SBI framework is unique to Chime.");
    const issue = result.issues.find((i) => i.rule === "framework-claims");
    expect(issue).toBeDefined();
    expect(issue!.severity).toBe("error");
  });

  it("does not flag simple mentions of frameworks", () => {
    const result = lint("We use the SBI framework for feedback.");
    expect(result.issues.find((i) => i.rule === "framework-claims")).toBeUndefined();
  });
});

describe("unattributed-stats", () => {
  it("flags unattributed research claims", () => {
    const result = lint("Research shows that 70% of employees want more feedback.");
    const issues = result.issues.filter((i) => i.rule === "unattributed-stats");
    expect(issues.length).toBeGreaterThanOrEqual(1);
    expect(issues[0].severity).toBe("error");
  });

  it("does not flag attributed stats", () => {
    const result = lint("Gallup (2023) found that many employees want more feedback.");
    expect(result.issues.find((i) => i.rule === "unattributed-stats")).toBeUndefined();
  });
});

describe("chime-values", () => {
  it("flags incorrect value names", () => {
    const result = lint("We should be customer-obsessed in everything we do.");
    const issue = result.issues.find((i) => i.rule === "chime-values");
    expect(issue).toBeDefined();
    expect(issue!.suggestion).toContain("Member Obsessed");
  });

  it("flags close-but-wrong value names", () => {
    const result = lint("Let's follow the rules and take ownership.");
    const issues = result.issues.filter((i) => i.rule === "chime-values");
    expect(issues.some((i) => i.suggestion!.includes("Respect the Rules"))).toBe(true);
    expect(issues.some((i) => i.suggestion!.includes("Be an Owner"))).toBe(true);
  });

  it("does not flag the exact official value names", () => {
    const result = lint(
      "Our values: Member Obsessed, Be Bold, Win Together, Respect the Rules, Be an Owner.",
    );
    expect(result.issues.find((i) => i.rule === "chime-values")).toBeUndefined();
  });
});

describe("line/column positions", () => {
  it("reports correct positions for multi-line text", () => {
    const text = "Line one is fine.\nLine two has a struggle here.";
    const result = lint(text);
    const issue = result.issues.find((i) => i.rule === "struggle");
    expect(issue).toBeDefined();
    expect(issue!.line).toBe(2);
    expect(issue!.column).toBe(16);
  });
});

describe("scoring", () => {
  it("deducts 10 per error and 5 per warning", () => {
    // em dash = 1 error (10pts), struggle = 1 warning (5pts) => 85
    const result = lint("We struggle\u2014a lot.");
    const errors = result.issues.filter((i) => i.severity === "error").length;
    const warnings = result.issues.filter((i) => i.severity === "warning").length;
    expect(result.score).toBe(100 - errors * 10 - warnings * 5);
  });

  it("floors at 0", () => {
    const result = lint(
      "The lowest score damn struggle rockstars addiction ego spiralling dopamine Research shows\u2014our proprietary SBI customer-obsessed secret weapon game-changer",
    );
    expect(result.score).toBe(0);
  });
});
