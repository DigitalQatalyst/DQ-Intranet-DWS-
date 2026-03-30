/**
 * Format duration from minutes to a human-readable string
 * If duration is >= 60 minutes, show as hours and minutes
 * Otherwise, show as minutes only
 * Format: "60 mins" -> "1hr", "70 mins" -> "1hr 10mins"
 */
export function formatDurationFromMinutes(minutes: number | undefined | null): string {
  if (!minutes || minutes === 0) return '0 min';
  
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'min' : 'mins'}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}${hours === 1 ? 'hr' : 'hrs'}`;
  }
  
  return `${hours}${hours === 1 ? 'hr' : 'hrs'} ${remainingMinutes}${remainingMinutes === 1 ? 'min' : 'mins'}`;
}

