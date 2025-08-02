export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatUptime = (seconds: number, t: (key: string) => string): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (days > 0) {
    return `${days} ${t('days')} ${hours} ${t('hours')}`;
  } else if (hours > 0) {
    return `${hours} ${t('hours')} ${minutes} ${t('minutes')}`;
  } else if (minutes > 0) {
    return `${minutes} ${t('minutes')} ${secs} ${t('seconds')}`;
  } else {
    return `${secs} ${t('seconds')}`;
  }
};

export const formatSpeed = (bytesPerSecond: number): string => {
  return `${formatBytes(bytesPerSecond)}/s`;
};

export const formatRegion = (region: string): string => {
  // 处理台湾地区emoji在中国大陆不显示的问题
  // 将台湾相关的emoji和文本替换为通用标识
  const taiwanPatterns = [
    '🇹🇼'
  ];
  
  let formattedRegion = region;
  
  // 检查是否包含台湾相关标识
  for (const pattern of taiwanPatterns) {
    if (formattedRegion.includes(pattern)) {
      // 替换为通用的全球标识
      formattedRegion = '🇺🇳';
      break;
    }
  }
  
  return formattedRegion;
};

export const formatBillingCycle = (days: number, t: (key: string) => string): string => {
  // 处理天数，转换为合适的计费周期显示
  if (days >= 28 && days <= 31) {
    return t('monthly');
  } else if (days >= 88 && days <= 95) {
    return t('quarterly');
  } else if (days >= 178 && days <= 185) {
    return t('semi_annually');
  } else if (days >= 360 && days <= 370) {
    return t('annually');
  } else if (days === 7) {
    return t('weekly');
  } else if (days === 1) {
    return t('daily');
  } else {
    return `${days} ${t('days')}`;
  }
};