import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Computer as ComputerIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  NetworkCheck as NetworkIcon,
  Schedule as UptimeIcon,
  Settings as ProcessIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Node, NodeStatus } from '../types';
import { api } from '../services/api';
import { formatBytes, formatPercentage, formatUptime, formatSpeed, formatRegion } from '../utils/format';

interface NodeDetailProps {
  nodeId: string;
  onBack: () => void;
}

export const NodeDetail: React.FC<NodeDetailProps> = ({ nodeId, onBack }) => {
  const { t } = useTranslation();
  const [node, setNode] = useState<Node | null>(null);
  const [status, setStatus] = useState<NodeStatus | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNodeData = async () => {
      try {
        // 获取节点基本信息
        const nodes = await api.getNodes();
        const foundNode = nodes.find(n => n.uuid === nodeId);
        setNode(foundNode || null);

        // 获取节点状态
        const statusData = await api.getNodeStatus(nodeId);
        if (statusData.length > 0) {
          setStatus(statusData[0]);
        }
      } catch (error) {
        console.error('Failed to fetch node data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNodeData();
  }, [nodeId]);

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
          const online = data.data.online || [];
          setIsOnline(online.includes(nodeId));
          
          const nodeData = data.data.data?.[nodeId];
          if (nodeData) {
            setStatus(nodeData);
          }
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send('get');
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      ws.close();
    };
  }, [nodeId]);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  if (!node) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h6">节点未找到</Typography>
      </Container>
    );
  }

  const cpuUsage = status?.cpu.usage || 0;
  const memoryUsage = status ? (status.ram.used / status.ram.total) * 100 : 0;
  const diskUsage = status ? (status.disk.used / status.disk.total) * 100 : 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={4}>
        <IconButton onClick={onBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {node.name}
        </Typography>
        <Chip
          label={isOnline ? t('online') : t('offline')}
          color={isOnline ? 'success' : 'error'}
        />
      </Box>

      <Grid container spacing={3}>
        {/* 基本信息 */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              基本信息
            </Typography>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                地区
              </Typography>
              <Typography variant="body1">{formatRegion(node.region)}</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                操作系统
              </Typography>
              <Typography variant="body1">{node.os}</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                CPU
              </Typography>
              <Typography variant="body1">
                {node.cpu_name} ({node.cpu_cores} 核心)
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                架构
              </Typography>
              <Typography variant="body1">{node.arch}</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                虚拟化
              </Typography>
              <Typography variant="body1">{node.virtualization}</Typography>
            </Box>
            {status && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('last_update')}
                </Typography>
                <Typography variant="body1">
                  {new Date(status.updated_at).toLocaleString()}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* 系统状态 */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={3}>
            {/* CPU */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <ComputerIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">{t('cpu')}</Typography>
                  </Box>
                  <Typography variant="h4" gutterBottom>
                    {formatPercentage(cpuUsage)}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={cpuUsage}
                    color={cpuUsage > 80 ? 'error' : cpuUsage > 60 ? 'warning' : 'primary'}
                  />
                  {status && (
                    <Box mt={2}>
                      <Typography variant="body2" color="text.secondary">
                        {t('load')}: {status.load.load1.toFixed(2)} / {status.load.load5.toFixed(2)} / {status.load.load15.toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* 内存 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <MemoryIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">{t('memory')}</Typography>
                  </Box>
                  <Typography variant="h4" gutterBottom>
                    {formatPercentage(memoryUsage)}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={memoryUsage}
                    color={memoryUsage > 80 ? 'error' : memoryUsage > 60 ? 'warning' : 'primary'}
                  />
                  {status && (
                    <Box mt={2}>
                      <Typography variant="body2" color="text.secondary">
                        {formatBytes(status.ram.used)} / {formatBytes(status.ram.total)}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* 磁盘 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <StorageIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">{t('disk')}</Typography>
                  </Box>
                  <Typography variant="h4" gutterBottom>
                    {formatPercentage(diskUsage)}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={diskUsage}
                    color={diskUsage > 80 ? 'error' : diskUsage > 60 ? 'warning' : 'primary'}
                  />
                  {status && (
                    <Box mt={2}>
                      <Typography variant="body2" color="text.secondary">
                        {formatBytes(status.disk.used)} / {formatBytes(status.disk.total)}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* 网络 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <NetworkIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">{t('network')}</Typography>
                  </Box>
                  {status && (
                    <>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">上行:</Typography>
                        <Typography variant="body2">{formatSpeed(status.network.up)}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="body2">下行:</Typography>
                        <Typography variant="body2">{formatSpeed(status.network.down)}</Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                          {t('total_up')}:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatBytes(status.network.totalUp)}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          {t('total_down')}:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatBytes(status.network.totalDown)}
                        </Typography>
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* 运行时间和进程 */}
            <Grid size={12}>
              <Card>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <UptimeIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">{t('uptime')}</Typography>
                      </Box>
                      {status && (
                        <Typography variant="body1">
                          {formatUptime(status.uptime, t)}
                        </Typography>
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <ProcessIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">{t('processes')}</Typography>
                      </Box>
                      {status && (
                        <Typography variant="body1">{status.process}</Typography>
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <NetworkIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">{t('connections')}</Typography>
                      </Box>
                      {status && (
                        <Box>
                          <Typography variant="body2">
                            TCP: {status.connections.tcp}
                          </Typography>
                          <Typography variant="body2">
                            UDP: {status.connections.udp}
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};