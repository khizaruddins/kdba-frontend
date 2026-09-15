export const INSTANCE_OF_PROP = 'kdbaInstanceOf';
export const REUSABLE_ID_PROP = 'kdbaReusableId';
export const STATES_PROP = 'kdbaStates';
export const TEXT_RUNS_PROP = 'runs';

export interface TextRun {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  href?: string;
}

const ALLOWED_HREF = /^(https?:\/\/|mailto:|tel:|\/|#)/i;

export function sanitizeHref(href?: string): string | undefined {
  if (!href || typeof href !== 'string') return undefined;
  const trimmed = href.trim().slice(0, 500);
  if (!trimmed) return undefined;
  if (trimmed.toLowerCase().startsWith('javascript:')) return undefined;
  if (trimmed.toLowerCase().startsWith('data:')) return undefined;
  if (!ALLOWED_HREF.test(trimmed)) return undefined;
  return trimmed;
}

export function sanitizePlainText(value: unknown, max = 8000): string {
  return String(value || '')
    .replace(/<[^>]*>/g, '')
    .slice(0, max);
}

export function runsFromText(text: string, marks?: Omit<TextRun, 'text'>): TextRun[] {
  const clean = sanitizePlainText(text);
  if (!clean) return [];
  return [{ text: clean, ...marks }];
}

export function textFromRuns(runs?: unknown): string {
  if (!Array.isArray(runs)) return '';
  return runs
    .map((run) => (run && typeof run === 'object' ? sanitizePlainText((run as TextRun).text) : ''))
    .join('');
}

export function normalizeRuns(value: unknown): TextRun[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((run) => run && typeof run === 'object')
    .map((run) => {
      const item = run as TextRun;
      return {
        text: sanitizePlainText(item.text, 2000),
        bold: Boolean(item.bold) || undefined,
        italic: Boolean(item.italic) || undefined,
        underline: Boolean(item.underline) || undefined,
        href: sanitizeHref(item.href),
      };
    })
    .filter((run) => run.text.length > 0);
}

export function applyMarksToRuns(runs: TextRun[], marks: Omit<TextRun, 'text'>): TextRun[] {
  const source = runs.length ? runs : runsFromText('');
  return source.map((run) => ({ ...run, ...marks }));
}

export function renderRunKey(run: TextRun, index: number): string {
  return `${index}:${run.text.slice(0, 12)}:${run.bold ? 'b' : ''}${run.italic ? 'i' : ''}${run.underline ? 'u' : ''}`;
}
