import { readFileSync } from "node:fs";
import { lint } from "../core/index.js";
import type { LintIssue } from "../core/index.js";

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk: string) => { data += chunk; });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

function severityBadge(severity: string): string {
  return severity === "error" ? "\x1b[31mERROR\x1b[0m" : "\x1b[33mWARN\x1b[0m ";
}

function formatIssue(issue: LintIssue, lines: string[]): string {
  const badge = severityBadge(issue.severity);
  const location = `${issue.line}:${issue.column}`;
  const parts = [
    `  ${badge}  ${location.padEnd(8)} ${issue.message}`,
  ];
  if (issue.suggestion) {
    parts.push(`                  \u21b3 ${issue.suggestion}`);
  }
  // Show the source line with an underline
  const srcLine = lines[issue.line - 1];
  if (srcLine !== undefined) {
    parts.push(`                  \x1b[2m${srcLine}\x1b[0m`);
    const pointer = " ".repeat(issue.column - 1) + "\x1b[31m" + "~".repeat(issue.length) + "\x1b[0m";
    parts.push(`                  ${pointer}`);
  }
  return parts.join("\n");
}

function printHelp(): void {
  console.log(`
\x1b[1mchime-lint\x1b[0m \u2013 Chime People Development content linter

\x1b[1mUsage:\x1b[0m
  chime-lint <file>          Lint a text file
  cat file.txt | chime-lint  Lint from stdin
  chime-lint --help          Show this help

\x1b[1mOptions:\x1b[0m
  --json    Output results as JSON
  --help    Show help
`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    printHelp();
    process.exit(0);
  }

  const jsonOutput = args.includes("--json");
  const fileArgs = args.filter((a) => !a.startsWith("-"));

  let text: string;
  if (fileArgs.length > 0) {
    try {
      text = readFileSync(fileArgs[0], "utf-8");
    } catch (err: any) {
      console.error(`Error reading file: ${err.message}`);
      process.exit(1);
      return; // unreachable, helps TS narrow
    }
  } else if (!process.stdin.isTTY) {
    text = await readStdin();
  } else {
    printHelp();
    process.exit(1);
    return; // unreachable, helps TS narrow
  }

  const result = lint(text);

  if (jsonOutput) {
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.issues.some((i) => i.severity === "error") ? 1 : 0);
  }

  const lines = text.split("\n");

  if (result.issues.length === 0) {
    console.log("\n  \x1b[32m\u2713\x1b[0m " + result.summary + "\n");
    process.exit(0);
  }

  console.log();
  for (const issue of result.issues) {
    console.log(formatIssue(issue, lines));
    console.log();
  }
  console.log(`  ${result.summary}`);
  console.log();

  process.exit(result.issues.some((i) => i.severity === "error") ? 1 : 0);
}

main();
