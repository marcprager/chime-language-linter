interface UsageStats {
  totalChecks: number;
  totalFixes: number;
  totalCopies: number;
  sessionsCount: number;
  firstUsed: string;
  lastUsed: string;
}

const STORAGE_KEY = 'chime_voice_checker_usage';

function getStats(): UsageStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore parse errors
  }
  return {
    totalChecks: 0,
    totalFixes: 0,
    totalCopies: 0,
    sessionsCount: 0,
    firstUsed: '',
    lastUsed: '',
  };
}

function saveStats(stats: UsageStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // ignore storage errors
  }
}

export function trackEvent(event: 'session' | 'check' | 'fix_single' | 'fix_all' | 'copy'): void {
  const stats = getStats();
  const now = new Date().toISOString();

  if (!stats.firstUsed) stats.firstUsed = now;
  stats.lastUsed = now;

  switch (event) {
    case 'session':
      stats.sessionsCount++;
      break;
    case 'check':
      stats.totalChecks++;
      break;
    case 'fix_single':
    case 'fix_all':
      stats.totalFixes++;
      break;
    case 'copy':
      stats.totalCopies++;
      break;
  }

  saveStats(stats);

  // Forward to GA4 if configured
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as Record<string, unknown>['gtag'] as (...args: unknown[]) => void)(
      'event',
      `chime_voice_${event}`,
    );
  }
}

export function getUsageStats(): UsageStats {
  return getStats();
}
