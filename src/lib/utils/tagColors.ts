export type TagStyle = { bg: string; color: string };

const TAG_PALETTE: Record<string, TagStyle> = {
  spanish: { bg: '#F3E8FF', color: '#7C3AED' },
  french: { bg: '#F3E8FF', color: '#7C3AED' },
  health: { bg: '#D1FAE5', color: '#059669' },
  translation: { bg: '#DBEAFE', color: '#2563EB' },
  design: { bg: '#FCE7F3', color: '#DB2777' },
  data: { bg: '#FEF3C7', color: '#D97706' },
  history: { bg: '#DBEAFE', color: '#2563EB' },
  environment: { bg: '#D1FAE5', color: '#059669' },
  excel: { bg: '#D1FAE5', color: '#059669' },
  education: { bg: '#FEF3C7', color: '#D97706' },
  research: { bg: '#FCE7F3', color: '#DB2777' },
};

const DEFAULT_TAG: TagStyle = { bg: '#F1F5F9', color: '#475569' };

export function getTagStyle(tag: string): TagStyle {
  const key = tag.replace(/^#/, '').toLowerCase();
  return TAG_PALETTE[key] ?? DEFAULT_TAG;
}
