#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { lintText as coreLintText, fixText as coreFixText, mergeResults } from '@chime-linter/core';
import { LintIssue, LintResult, Severity, LintOptions } from '@chime-linter/core';
import { formatPretty, formatJson, formatSummary } from './formatter';

const SUPPORTED_EXTENSIONS = new Set(['.html', '.tsx', '.jsx', '.ts', '.js', '.md']);

const HELP_TEXT = `chime-lint \u2013 Chime People Development content linter

Usage:
  chime-lint <file-or-directory>   Lint a file or directory
  chime-lint -                     Lint from stdin
  cat file.md | chime-lint         Lint piped input

Options:
  --fix              Auto-fix where possible
  --format json      Output as JSON
  --severity <level> Filter by severity (error, warning, info)
  --help             Show this help message

Examples:
  chime-lint content/
  chime-lint guide.md --fix
  echo "text" | chime-lint --format json
`;

interface CliArgs {
  target: string | null;
  fix: boolean;
  format: 'pretty' | 'json';
  severity: Severity | null;
  help: boolean;
  stdin: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    target: null,
    fix: false,
    format: 'pretty',
    severity: null,
    help: false,
    stdin: false,
  };

  let i = 0;
  while (i < argv.length) {
    const arg = argv[i];

    if (arg === '--help') {
      args.help = true;
    } else if (arg === '--fix') {
      args.fix = true;
    } else if (arg === '--format') {
      i++;
      if (argv[i] === 'json') {
        args.format = 'json';
      }
    } else if (arg === '--severity') {
      i++;
      const level = argv[i] as Severity;
      if (level === 'error' || level === 'warning' || level === 'info') {
        args.severity = level;
      }
    } else if (arg === '-') {
      args.stdin = true;
    } else if (!arg.startsWith('--')) {
      args.target = arg;
    }

    i++;
  }

  return args;
}

function collectFiles(targetPath: string): string[] {
  const resolved = path.resolve(targetPath);
  const stat = fs.statSync(resolved);

  if (stat.isFile()) {
    return [resolved];
  }

  if (stat.isDirectory()) {
    return scanDirectory(resolved);
  }

  return [];
}

function scanDirectory(dirPath: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dirPath);

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (entry === 'node_modules' || entry.startsWith('.')) {
        continue;
      }
      files.push(...scanDirectory(fullPath));
    } else if (stat.isFile()) {
      const ext = path.extname(entry);
      if (SUPPORTED_EXTENSIONS.has(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

export function lintText(text: string, filePath: string, options: LintOptions = {}): LintIssue[] {
  const result = coreLintText(text, filePath, options);
  return result.issues;
}

export function applyFixes(text: string, filePath: string = '<input>'): string {
  return coreFixText(text, filePath);
}

export function lintFiles(filePaths: string[], options: LintOptions = {}): LintResult {
  const results: LintResult[] = [];

  for (const filePath of filePaths) {
    const text = fs.readFileSync(filePath, 'utf-8');

    if (options.fix) {
      const fixed = coreFixText(text, filePath);
      if (fixed !== text) {
        fs.writeFileSync(filePath, fixed, 'utf-8');
      }
      results.push(coreLintText(fixed, filePath, { severity: options.severity }));
    } else {
      results.push(coreLintText(text, filePath, options));
    }
  }

  return mergeResults(results);
}

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => {
      resolve(data);
    });
    process.stdin.on('error', reject);
  });
}

function outputResult(result: LintResult, format: 'pretty' | 'json'): void {
  if (format === 'json') {
    process.stdout.write(formatJson(result) + '\n');
  } else {
    const pretty = formatPretty(result);
    if (pretty) {
      process.stdout.write(pretty + '\n');
    }
    process.stdout.write(formatSummary(result) + '\n');
  }
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    process.stdout.write(HELP_TEXT);
    process.exit(0);
  }

  const options: LintOptions = {
    fix: args.fix,
    severity: args.severity ?? undefined,
  };

  const useStdin = args.stdin || (!args.target && !process.stdin.isTTY);

  if (useStdin) {
    const text = await readStdin();

    if (args.fix) {
      const fixedText = applyFixes(text, '<stdin>');
      process.stdout.write(fixedText);
      return;
    }

    const result = coreLintText(text, '<stdin>', options);
    outputResult(result, args.format);
    process.exit(result.summary.errors > 0 ? 1 : 0);
    return;
  }

  if (!args.target) {
    process.stderr.write('Error: No file or directory specified. Use --help for usage.\n');
    process.exit(1);
    return;
  }

  if (!fs.existsSync(args.target)) {
    process.stderr.write(`Error: Path not found: ${args.target}\n`);
    process.exit(1);
    return;
  }

  const files = collectFiles(args.target);

  if (files.length === 0) {
    process.stderr.write('No supported files found.\n');
    process.exit(0);
    return;
  }

  if (args.fix) {
    const fixedFiles: string[] = [];
    for (const filePath of files) {
      const original = fs.readFileSync(filePath, 'utf-8');
      const fixed = coreFixText(original, filePath);
      if (fixed !== original) {
        fs.writeFileSync(filePath, fixed, 'utf-8');
        fixedFiles.push(filePath);
      }
    }

    if (fixedFiles.length > 0) {
      process.stdout.write(`Fixed ${fixedFiles.length} file${fixedFiles.length !== 1 ? 's' : ''}:\n`);
      for (const f of fixedFiles) {
        process.stdout.write(`  ${f}\n`);
      }
      process.stdout.write('\n');
    }

    const result = lintFiles(files, { severity: options.severity });
    outputResult(result, args.format);
    process.exit(result.summary.errors > 0 ? 1 : 0);
    return;
  }

  const result = lintFiles(files, options);
  outputResult(result, args.format);
  process.exit(result.summary.errors > 0 ? 1 : 0);
}

// Only run main when executed directly, not when imported for testing
if (require.main === module) {
  main().catch((err) => {
    process.stderr.write(`Error: ${err.message}\n`);
    process.exit(1);
  });
}
