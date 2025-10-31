export type TimeBucket = 'Quick' | 'Short' | 'Medium' | 'Deep Dive'

export const toTimeBucket = (min?: number | string | null): TimeBucket | null => {
  const n = typeof min === 'string' ? parseInt(min, 10) : (min ?? 0)
  if (!n || isNaN(n)) return null
  if (n < 10) return 'Quick'
  if (n <= 30) return 'Short'
  if (n <= 60) return 'Medium'
  return 'Deep Dive'
}

export const fromBucketToRange = (bucket: TimeBucket): [number, number] | null => {
  switch (bucket) {
    case 'Quick': return [0, 9]
    case 'Short': return [10, 30]
    case 'Medium': return [31, 60]
    case 'Deep Dive': return [61, 100000]
    default: return null
  }
}

export const freshnessBuckets = [
  { id: '30', name: 'Last 30 days', days: 30 },
  { id: '90', name: 'Last 90 days', days: 90 },
  { id: '365', name: 'Last 12 months', days: 365 },
]

export const sortOptions = [
  { id: 'relevance', name: 'Relevance' },
  { id: 'updated', name: 'Last Updated' },
  { id: 'downloads', name: 'Most Downloaded' },
  { id: 'editorsPick', name: "Editor's Pick" },
]

export const parseCsv = (v?: string | null) => (v || '').split(',').map(x => x.trim()).filter(Boolean)
export const toCsv = (arr: string[]) => (arr || []).join(',')

