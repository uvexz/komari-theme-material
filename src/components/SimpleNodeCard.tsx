import { Card, CardContent, Typography, Box, Chip, Stack, Avatar } from '@mui/material';
import type { NodeInfo, NodeStatus } from '../types';
import { formatBytes, formatPercentage, emojiToCountryCode } from '../utils/format';
import GroupIcon from '@mui/icons-material/Group';
import LabelIcon from '@mui/icons-material/Label';

interface SimpleNodeCardProps {
  node: NodeInfo;
  status?: NodeStatus;
  online: boolean;
  onClick?: () => void;
  onGroupFilter?: (group: string) => void;
  onTagFilter?: (tag: string) => void;
}

export function SimpleNodeCard({ node, status, online, onClick, onGroupFilter, onTagFilter }: SimpleNodeCardProps) {
  const cpuUsage = status?.cpu.usage || 0;
  const ramUsage = status ? (status.ram.used / status.ram.total) * 100 : 0;
  const countryCode = emojiToCountryCode(node.region || '');
  const flagUrl = countryCode ? `https://cdn.sevencdn.com/gh/lipis/flag-icons/flags/1x1/${countryCode}.svg` : '';

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
          transform: 'translateY(-2px)',
          boxShadow: 3
        }
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center" gap={1} flex={1} minWidth={0}>
            {flagUrl && (
              <Avatar
                src={flagUrl}
                alt={node.region}
                sx={{ width: 20, height: 20 }}
              />
            )}
            <Typography variant="subtitle1" component="div" noWrap>
              {node.name}
            </Typography>
          </Box>
          <Chip
            label={online ? '在线' : '离线'}
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
          <Stack direction="row" spacing={2} mt={1}>
            <Typography variant="body2" color="text.secondary">
              CPU: {formatPercentage(cpuUsage)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              内存: {formatPercentage(ramUsage)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ↑{formatBytes(status.network.up)}/s
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
