import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import {
  GridView as GridViewIcon,
  TableRows as TableViewIcon,
  Visibility as ViewIcon,
  Computer as ComputerIcon,
  CheckCircle as OnlineIcon,
  Cancel as OfflineIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Node, NodeStatus, ViewMode } from '../types';
import { NodeCard } from './NodeCard';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { api } from '../services/api';
import { formatPercentage, formatUptime, formatRegion } from '../utils/format';

interface DashboardProps {
  onViewDetails: (nodeId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onViewDetails }) => {
  const { t } = useTranslation();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [nodeStatuses, setNodeStatuses] = useState<Record<string, NodeStatus>>({});
  const [onlineNodes, setOnlineNodes] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useLocalStorage<string>('nodeSelectedGroup', '');
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>('nodeViewMode', 'grid');
  const [loading, setLoading] = useState(true);

  // 获取节点列表
  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const nodesData = await api.getNodes();
        setNodes(nodesData);
      } catch (error) {
        console.error('Failed to fetch nodes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNodes();
  }, []);

  // WebSocket 连接获取实时数据
  useEffect(() => {
    const ws = api.createWebSocket();

    ws.onopen = () => {
      ws.send('get');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.status === 'success' && data.data) {
          setOnlineNodes(data.data.online || []);
          setNodeStatuses(data.data.data || {});
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // 定期发送获取数据请求
    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send('get');
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      ws.close();
    };
  }, []);

  // 获取所有分组
  const groups = Array.from(new Set(nodes.map(node => node.group).filter(Boolean)));

  // 过滤和排序节点
  const filteredNodes = (selectedGroup
    ? nodes.filter(node => node.group === selectedGroup)
    : nodes
  ).sort((a, b) => a.weight - b.weight); // 按 weight 从小到大排序

  // 计算统计数据
  const totalNodes = filteredNodes.length;
  const onlineCount = filteredNodes.filter(node => onlineNodes.includes(node.uuid)).length;
  const offlineCount = totalNodes - onlineCount;
  const totalGroups = groups.length;

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t('dashboard')}
        </Typography>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('dashboard')}
      </Typography>

      {/* 节点统计卡片 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="primary">
                    {totalNodes}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('total_nodes')}
                  </Typography>
                </Box>
                <ComputerIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="success.main">
                    {onlineCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('online_nodes')}
                  </Typography>
                </Box>
                <OnlineIcon color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="error.main">
                    {offlineCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('offline_nodes')}
                  </Typography>
                </Box>
                <OfflineIcon color="error" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="info.main">
                    {totalGroups}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('total_groups')}
                  </Typography>
                </Box>
                <GroupIcon color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 控制栏 */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box /> {/* 占位符 */}
        
        <Box display="flex" gap={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{t('all_groups')}</InputLabel>
            <Select
              value={selectedGroup}
              label={t('all_groups')}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <MenuItem value="">{t('all_groups')}</MenuItem>
              {groups.map(group => (
                <MenuItem key={group} value={group}>
                  {group}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newMode) => newMode && setViewMode(newMode)}
            size="small"
          >
            <ToggleButton value="grid" aria-label={t('grid_view')}>
              <GridViewIcon />
            </ToggleButton>
            <ToggleButton value="table" aria-label={t('table_view')}>
              <TableViewIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredNodes.map(node => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={node.uuid}>
              <NodeCard
                node={node}
                status={nodeStatuses[node.uuid]}
                isOnline={onlineNodes.includes(node.uuid)}
                onViewDetails={onViewDetails}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('nodes')}</TableCell>
                <TableCell>状态</TableCell>
                <TableCell>{t('cpu')}</TableCell>
                <TableCell>{t('memory')}</TableCell>
                <TableCell>{t('disk')}</TableCell>
                <TableCell>{t('uptime')}</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNodes.map(node => {
                const status = nodeStatuses[node.uuid];
                const isOnline = onlineNodes.includes(node.uuid);
                const cpuUsage = status?.cpu.usage || 0;
                const memoryUsage = status ? (status.ram.used / status.ram.total) * 100 : 0;
                const diskUsage = status ? (status.disk.used / status.disk.total) * 100 : 0;

                return (
                  <TableRow key={node.uuid}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {node.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatRegion(node.region)} • {node.os}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={isOnline ? t('online') : t('offline')}
                        color={isOnline ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {status ? formatPercentage(cpuUsage) : '-'}
                    </TableCell>
                    <TableCell>
                      {status ? formatPercentage(memoryUsage) : '-'}
                    </TableCell>
                    <TableCell>
                      {status ? formatPercentage(diskUsage) : '-'}
                    </TableCell>
                    <TableCell>
                      {status ? formatUptime(status.uptime, t) : '-'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => onViewDetails(node.uuid)}
                        disabled={!isOnline}
                      >
                        <ViewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};