import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Box,
  Avatar
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { NodeInfo, NodeStatus } from '../types';
import { formatBytes, formatPercentage, getColorByUsage, emojiToCountryCode } from '../utils/format';

interface NodeTableProps {
  nodes: NodeInfo[];
  statusMap: Record<string, NodeStatus>;
  onlineNodes: string[];
  onNodeClick?: (node: NodeInfo) => void;
}

export function NodeTable({ nodes, statusMap, onlineNodes, onNodeClick }: NodeTableProps) {
  const { t } = useTranslation();
  
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('table.nodeName')}</TableCell>
            <TableCell>{t('table.status')}</TableCell>
            <TableCell>{t('table.region')}</TableCell>
            <TableCell>{t('node.cpu')}</TableCell>
            <TableCell>{t('node.memory')}</TableCell>
            <TableCell>{t('node.disk')}</TableCell>
            <TableCell>{t('node.network')}</TableCell>
            <TableCell>{t('dialog.load')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {nodes.map((node) => {
            const status = statusMap[node.uuid];
            const online = onlineNodes.includes(node.uuid);
            const cpuUsage = status?.cpu.usage || 0;
            const ramUsage = status ? (status.ram.used / status.ram.total) * 100 : 0;
            const diskUsage = status ? (status.disk.used / status.disk.total) * 100 : 0;
            const countryCode = emojiToCountryCode(node.region || '');
            const flagUrl = countryCode ? `https://cdn.sevencdn.com/gh/lipis/flag-icons/flags/1x1/${countryCode}.svg` : '';

            return (
              <TableRow
                key={node.uuid}
                onClick={() => onNodeClick?.(node)}
                sx={{
                  opacity: online ? 1 : 0.6,
                  cursor: onNodeClick ? 'pointer' : 'default',
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <TableCell>{node.name}</TableCell>
                <TableCell>
                  <Chip
                    label={online ? t('node.online') : t('node.offline')}
                    color={online ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {flagUrl && (
                      <Avatar
                        src={flagUrl}
                        alt={node.region}
                        sx={{ width: 20, height: 20 }}
                      />
                    )}
                    <span>{node.group}</span>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ minWidth: 120 }}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <span>{formatPercentage(cpuUsage)}</span>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={cpuUsage}
                      color={getColorByUsage(cpuUsage)}
                      sx={{ height: 6, borderRadius: 1 }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ minWidth: 120 }}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <span>{formatPercentage(ramUsage)}</span>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={ramUsage}
                      color={getColorByUsage(ramUsage)}
                      sx={{ height: 6, borderRadius: 1 }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ minWidth: 120 }}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <span>{formatPercentage(diskUsage)}</span>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={diskUsage}
                      color={getColorByUsage(diskUsage)}
                      sx={{ height: 6, borderRadius: 1 }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  {status && (
                    <>
                      ↑ {formatBytes(status.network.up)}/s
                      <br />
                      ↓ {formatBytes(status.network.down)}/s
                    </>
                  )}
                </TableCell>
                <TableCell>
                  {status && `${status.load.load1.toFixed(2)}`}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
