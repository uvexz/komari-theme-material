import { lazy, Suspense } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';

// Lazy load chart components to reduce initial bundle size
const Chart = lazy(() => import('./Chart'));

interface LazyChartProps {
  data: any[];
  type: 'line' | 'area' | 'bar';
  title: string;
  height?: number;
  dataKey: string;
  color?: string;
  unit?: string;
}

export function LazyChart(props: LazyChartProps) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom textAlign="center">
        {props.title}
      </Typography>
      <Suspense 
        fallback={
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            height={props.height || 300}
            gap={2}
          >
            <TimelineIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
            <CircularProgress />
          </Box>
        }
      >
        <Chart {...props} />
      </Suspense>
    </Box>
  );
}
