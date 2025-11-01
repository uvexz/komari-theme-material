import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { useTheme } from '@mui/material/styles';

interface ChartProps {
  data: any[];
  type: 'line' | 'area' | 'bar';
  title: string;
  height?: number;
  dataKey: string;
  color?: string;
  unit?: string;
}

export default function Chart({ 
  data, 
  type, 
  height = 300, 
  dataKey, 
  color,
  unit = '%'
}: ChartProps) {
  const theme = useTheme();
  
  const isDark = theme.palette.mode === 'dark';
  const gridColor = isDark ? '#424242' : '#e0e0e0';
  const textColor = isDark ? '#b0b0b0' : '#666666';
  const chartColor = color || theme.palette.primary.main;

  const formatTooltip = (value: any) => {
    if (typeof value === 'number') {
      // 对于网络速度，如果值很大，自动转换为 MB/s
      if (unit === ' KB/s' && value >= 1024) {
        return `${(value / 1024).toFixed(2)} MB/s`;
      }
      // 对于百分比，保留1位小数
      if (unit === '%') {
        return `${value.toFixed(1)}${unit}`;
      }
      // 对于负载，保留2位小数
      if (unit === '') {
        return value.toFixed(2);
      }
      return `${value.toFixed(2)}${unit}`;
    }
    return value;
  };

  const formatYAxis = (value: number) => {
    if (unit === ' KB/s' && value >= 1024) {
      return `${(value / 1024).toFixed(0)}M`;
    }
    if (unit === '%') {
      return `${value.toFixed(0)}%`;
    }
    return value.toFixed(0);
  };

  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const commonProps = {
    data,
    margin: { top: 5, right: 30, left: 20, bottom: 5 }
  };

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="time" 
              tickFormatter={formatXAxisLabel}
              stroke={textColor}
              fontSize={12}
            />
            <YAxis 
              stroke={textColor} 
              fontSize={12}
              tickFormatter={formatYAxis}
            />
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={(label) => new Date(label).toLocaleString()}
              contentStyle={{
                backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
                border: `1px solid ${gridColor}`,
                borderRadius: '8px',
                color: textColor
              }}
            />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={chartColor} 
              fill={chartColor}
              fillOpacity={0.3}
            />
          </AreaChart>
        );
      
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="time" 
              tickFormatter={formatXAxisLabel}
              stroke={textColor}
              fontSize={12}
            />
            <YAxis 
              stroke={textColor} 
              fontSize={12}
              tickFormatter={formatYAxis}
            />
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={(label) => new Date(label).toLocaleString()}
              contentStyle={{
                backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
                border: `1px solid ${gridColor}`,
                borderRadius: '8px',
                color: textColor
              }}
            />
            <Bar dataKey={dataKey} fill={chartColor} />
          </BarChart>
        );
      
      default: // line
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="time" 
              tickFormatter={formatXAxisLabel}
              stroke={textColor}
              fontSize={12}
            />
            <YAxis 
              stroke={textColor} 
              fontSize={12}
              tickFormatter={formatYAxis}
            />
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={(label) => new Date(label).toLocaleString()}
              contentStyle={{
                backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
                border: `1px solid ${gridColor}`,
                borderRadius: '8px',
                color: textColor
              }}
            />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={chartColor} 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        );
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}
