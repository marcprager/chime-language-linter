/**
 * Smart filtering functions for extracting lintable text from various file types.
 *
 * These filters extract user-facing text segments from source files so that
 * lint rules only run against prose content, not code syntax.
 *
 * Limitation: colOffset is set to 0 for most segments because exact column
 * mapping through complex transformations (tag stripping, attribute extraction)
 * is fragile. Line offsets are accurate.
 */

export interface TextSegment {
  text: string;
  lineOffset: number;
  colOffset: number;
}

/**
 * Detect the file type from a file path extension.
 */
export function getFileType(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase() || '';
  const typeMap: Record<string, string> = {
    md: 'markdown',
    mdx: 'markdown',
    html: 'html',
    htm: 'html',
    tsx: 'tsx',
    jsx: 'jsx',
    ts: 'ts',
    js: 'js',
    css: 'css',
    scss: 'css',
    less: 'css',
    txt: 'text',
  };
  return typeMap[ext] || 'text';
}

/**
 * Extract lintable text segments from content based on file type.
 * Each segment includes its line offset so issues can be mapped back
 * to original file positions.
 */
export function extractLintableText(content: string, fileType: string): TextSegment[] {
  switch (fileType) {
    case 'markdown':
      return extractFromMarkdown(content);
    case 'html':
      return extractFromHtml(content);
    case 'tsx':
    case 'jsx':
      return extractFromJsx(content);
    case 'ts':
    case 'js':
      return extractFromScript(content);
    case 'css':
      return extractFromCss(content);
    case 'text':
    default:
      return [{ text: content, lineOffset: 0, colOffset: 0 }];
  }
}

/**
 * Markdown: return full text minus code blocks and inline code.
 */
function extractFromMarkdown(content: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const lines = content.split('\n');
  let inCodeBlock = false;
  let currentText = '';
  let currentStartLine = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect fenced code block boundaries
    if (/^```/.test(line.trim())) {
      if (!inCodeBlock) {
        // Flush accumulated text before entering code block
        if (currentText.length > 0) {
          segments.push({ text: currentText, lineOffset: currentStartLine, colOffset: 0 });
          currentText = '';
        }
        inCodeBlock = true;
      } else {
        inCodeBlock = false;
        currentStartLine = i + 1;
      }
      continue;
    }

    if (inCodeBlock) continue;

    // Strip inline code
    const cleanLine = line.replace(/`[^`]*`/g, (match) => ' '.repeat(match.length));

    if (currentText.length === 0) {
      currentStartLine = i;
    }
    currentText += (currentText.length > 0 ? '\n' : '') + cleanLine;
  }

  if (currentText.length > 0) {
    segments.push({ text: currentText, lineOffset: currentStartLine, colOffset: 0 });
  }

  return segments;
}

/**
 * HTML: strip script and style blocks, then extract text content
 * and relevant attribute values (alt, title, aria-label).
 */
function extractFromHtml(content: string): TextSegment[] {
  const segments: TextSegment[] = [];

  // Remove script and style blocks (replace with blank lines to preserve line numbers)
  let cleaned = content;
  cleaned = cleaned.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (match) => {
    return match.replace(/[^\n]/g, ' ');
  });
  cleaned = cleaned.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, (match) => {
    return match.replace(/[^\n]/g, ' ');
  });

  const lines = cleaned.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Extract text between tags
    const textContent = line.replace(/<[^>]+>/g, ' ').trim();
    if (textContent.length > 0) {
      segments.push({ text: textContent, lineOffset: i, colOffset: 0 });
    }

    // Extract alt, title, aria-label attribute values
    const attrRegex = /(?:alt|title|aria-label)\s*=\s*["']([^"']+)["']/gi;
    let attrMatch: RegExpExecArray | null;
    while ((attrMatch = attrRegex.exec(line)) !== null) {
      segments.push({ text: attrMatch[1], lineOffset: i, colOffset: 0 });
    }
  }

  return segments.length > 0 ? segments : [{ text: '', lineOffset: 0, colOffset: 0 }];
}

/**
 * TSX/JSX: extract string content from JSX, template literals,
 * and text nodes. Skip import lines and pure code constructs.
 */
function extractFromJsx(content: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip import/export lines
    if (/^import\s/.test(trimmed) || /^export\s+(?:default\s+)?(?:function|class|const|let|var|interface|type|enum)\s/.test(trimmed)) {
      continue;
    }

    // Extract JSX text content (text between > and <)
    const jsxTextRegex = />([^<>{]+)</g;
    let jsxMatch: RegExpExecArray | null;
    while ((jsxMatch = jsxTextRegex.exec(line)) !== null) {
      const text = jsxMatch[1].trim();
      if (text.length > 0) {
        segments.push({ text, lineOffset: i, colOffset: 0 });
      }
    }

    // Extract string literals in JSX attributes and template literals
    const stringRegex = /["'`]([^"'`]{3,})["'`]/g;
    let strMatch: RegExpExecArray | null;
    while ((strMatch = stringRegex.exec(line)) !== null) {
      const text = strMatch[1];
      // Skip things that look like file paths, URLs, CSS classes, or import paths
      if (/^[.\/]/.test(text) || /^https?:/.test(text) || /^[a-z-]+$/.test(text)) {
        continue;
      }
      // Skip very short strings that are likely code tokens
      if (text.length < 5 && !/\s/.test(text)) {
        continue;
      }
      segments.push({ text, lineOffset: i, colOffset: 0 });
    }
  }

  return segments.length > 0 ? segments : [{ text: '', lineOffset: 0, colOffset: 0 }];
}

/**
 * TS/JS: extract string literals that look user-facing.
 * Conservative approach: only extract strings that contain spaces
 * (likely prose) and skip imports, require statements, and short identifiers.
 */
function extractFromScript(content: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip import/require lines
    if (/^import\s/.test(trimmed) || /require\(/.test(trimmed)) {
      continue;
    }

    // Skip comment lines that contain code-like content
    if (/^\/\//.test(trimmed) || /^\/\*/.test(trimmed) || /^\*/.test(trimmed)) {
      // Still lint comments for prose issues
      const commentText = trimmed.replace(/^\/\/\s*|^\/\*\s*|\*\/\s*$|^\*\s*/g, '');
      if (commentText.length > 5 && /\s/.test(commentText)) {
        segments.push({ text: commentText, lineOffset: i, colOffset: 0 });
      }
      continue;
    }

    // Extract string literals that contain spaces (likely prose, not identifiers)
    const stringRegex = /(?:["'`])([^"'`]{5,})(?:["'`])/g;
    let match: RegExpExecArray | null;
    while ((match = stringRegex.exec(line)) !== null) {
      const text = match[1];
      // Only include strings that look like prose (contain spaces)
      if (/\s/.test(text) && !/^[.\/]/.test(text) && !/^https?:/.test(text)) {
        segments.push({ text, lineOffset: i, colOffset: 0 });
      }
    }
  }

  return segments.length > 0 ? segments : [{ text: '', lineOffset: 0, colOffset: 0 }];
}

/**
 * CSS: extract content property values (for rules like fabricated-green-heart)
 * and comment text.
 */
function extractFromCss(content: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Extract content property values
    const contentRegex = /content\s*:\s*["']([^"']+)["']/g;
    let match: RegExpExecArray | null;
    while ((match = contentRegex.exec(line)) !== null) {
      segments.push({ text: match[0], lineOffset: i, colOffset: 0 });
    }

    // Extract CSS comment text
    const commentRegex = /\/\*\s*([\s\S]*?)\s*\*\//g;
    let commentMatch: RegExpExecArray | null;
    while ((commentMatch = commentRegex.exec(line)) !== null) {
      if (commentMatch[1].length > 3) {
        segments.push({ text: commentMatch[1], lineOffset: i, colOffset: 0 });
      }
    }
  }

  // For CSS files, also pass the full content so rules like fabricated-green-heart
  // that look for specific CSS patterns can work against the raw content
  segments.push({ text: content, lineOffset: 0, colOffset: 0 });

  return segments;
}
