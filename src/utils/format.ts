export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatUptime(seconds: number, t?: (key: string, options?: any) => string): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (!t) {
    // Fallback to Chinese if no translation function provided
    if (days > 0) return `${days}天 ${hours}小时`;
    if (hours > 0) return `${hours}小时 ${minutes}分钟`;
    return `${minutes}分钟`;
  }
  
  if (days > 0) return `${t('time.days', { count: days })} ${t('time.hours', { count: hours })}`;
  if (hours > 0) return `${t('time.hours', { count: hours })} ${t('time.minutes', { count: minutes })}`;
  return t('time.minutes', { count: minutes });
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function getColorByUsage(usage: number): 'success' | 'warning' | 'error' {
  if (usage < 60) return 'success';
  if (usage < 85) return 'warning';
  return 'error';
}

export function emojiToCountryCode(emoji: string): string {
  if (!emoji) return '';
  
  // Convert emoji flag to country code
  // Flag emojis are composed of two regional indicator symbols
  // Each regional indicator symbol is 0x1F1E6-0x1F1FF (A-Z)
  const codePoints = Array.from(emoji);
  
  if (codePoints.length >= 2) {
    const firstCode = codePoints[0].codePointAt(0);
    const secondCode = codePoints[1].codePointAt(0);
    
    if (firstCode && secondCode && 
        firstCode >= 0x1F1E6 && firstCode <= 0x1F1FF &&
        secondCode >= 0x1F1E6 && secondCode <= 0x1F1FF) {
      const first = String.fromCharCode(firstCode - 0x1F1E6 + 65);
      const second = String.fromCharCode(secondCode - 0x1F1E6 + 65);
      return (first + second).toLowerCase();
    }
  }
  
  return '';
}
