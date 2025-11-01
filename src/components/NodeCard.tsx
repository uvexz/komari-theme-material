import { Card, CardContent, Typography, Box, LinearProgress, Chip, Stack, Avatar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { NodeInfo, NodeStatus } from '../types';
import { formatBytes, formatPercentage, getColorByUsage, formatUptime, emojiToCountryCode } from '../utils/format';
import ComputerIcon from '@mui/icons-material/Computer';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import GroupIcon from '@mui/icons-material/Group';
import LabelIcon from '@mui/icons-material/Label';

interface NodeCardProps {
  node: NodeInfo;
  status?: NodeStatus;
  online: boolean;
  onClick?: () => void;
  onGroupFilter?: (group: string) => void;
  onTagFilter?: (tag: string) => void;
}

export function NodeCard({ node, status, online, onClick, onGroupFilter, onTagFilter }: NodeCardProps) {
  const { t } = useTranslation();
  const cpuUsage = status?.cpu.usage || 0;
  const ramUsage = status ? (status.ram.used / status.ram.total) * 100 : 0;
  const diskUsage = status ? (status.disk.used / status.disk.total) * 100 : 0;
  const countryCode = emojiToCountryCode(node.region || '');
  const flagUrl = countryCode ? `https://cdn.sevencdn.com/gh/lipis/flag-icons/flags/1x1/${countryCode}.svg` : '';
  
  // 解析标签（分号分隔）
  const tags = node.tags ? node.tags.split(';').map(tag => tag.trim()).filter(Boolean) : [];
  
  const handleGroupClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onGroupFilter && node.group) {
      onGroupFilter(node.group);
    }
  };
  
  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    if (onTagFilter) {
      onTagFilter(tag);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        opacity: online ? 1 : 0.6,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1} flex={1} minWidth={0}>
            {flagUrl && (
              <Avatar
                src={flagUrl}
                alt={node.region}
                sx={{ width: 24, height: 24 }}
              />
            )}
            <Typography variant="h6" component="div" noWrap>
              {node.name}
            </Typography>
          </Box>
          <Chip
            label={online ? t('node.online') : t('node.offline')}
            color={online ? 'success' : 'default'}
            size="small"
          />
        </Box>

        {(node.group || tags.length > 0) && (
          <Box display="flex" flexWrap="wrap" gap={0.5} mb={1}>
            {node.group && (
              <Chip
                icon={<GroupIcon sx={{ fontSize: 14 }} />}
                label={node.group}
                size="small"
                variant="filled"
                color="primary"
                onClick={handleGroupClick}
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 }
                }}
              />
            )}
            {tags.map((tag, index) => (
              <Chip
                key={index}
                icon={<LabelIcon sx={{ fontSize: 14 }} />}
                label={tag}
                size="small"
                variant="outlined"
                color="primary"
                onClick={(e) => handleTagClick(e, tag)}
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 }
                }}
              />
            ))}
          </Box>
        )}


        {status && (
          <Stack spacing={2} mt={2}>
            <Box>
              <Box display="flex" alignItems="center" mb={0.5}>
                <ComputerIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {t('node.cpu')}: {formatPercentage(cpuUsage)}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={cpuUsage}
                color={getColorByUsage(cpuUsage)}
              />
            </Box>

            <Box>
              <Box display="flex" alignItems="center" mb={0.5}>
                <MemoryIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {t('node.memory')}: {formatBytes(status.ram.used)} / {formatBytes(status.ram.total)}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={ramUsage}
                color={getColorByUsage(ramUsage)}
              />
            </Box>

            <Box>
              <Box display="flex" alignItems="center" mb={0.5}>
                <StorageIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {t('node.disk')}: {formatBytes(status.disk.used)} / {formatBytes(status.disk.total)}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={diskUsage}
                color={getColorByUsage(diskUsage)}
              />
            </Box>

            <Box>
              <Box display="flex" alignItems="center">
                <NetworkCheckIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  ↑ {formatBytes(status.network.up)}/s ↓ {formatBytes(status.network.down)}/s
                </Typography>
              </Box>
            </Box>

            <Typography variant="caption" color="text.secondary">
              {t('node.uptime')}: {formatUptime(status.uptime, t)}
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
