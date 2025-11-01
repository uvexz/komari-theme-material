import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  Chip,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  Stack,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Avatar
} from '@mui/material';
import type { NodeInfo, NodeStatus } from '../types';
import { formatBytes, formatPercentage, getColorByUsage, emojiToCountryCode } from '../utils/format';
import { LazyChart } from './LazyChart';
import CloseIcon from '@mui/icons-material/Close';
import ComputerIcon from '@mui/icons-material/Computer';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import InfoIcon from '@mui/icons-material/Info';
import TimelineIcon from '@mui/icons-material/Timeline';

interface NodeDetailsDialogProps {
  open: boolean;
  node: NodeInfo | null;
  status?: NodeStatus;
  online: boolean;
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`node-tabpanel-${index}`}
      aria-labelledby={`node-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

type TimeRange = '1h' | '24h' | '3d';

export function NodeDetailsDialog({ open, node, status, online, onClose }: NodeDetailsDialogProps) {
  const [tabValue, setTabValue] = useState(0);
  const [recentData, setRecentData] = useState<any[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('1h');

  useEffect(() => {
    if (open && node && tabValue === 1) {
      fetchRecentData();
    }
  }, [open, node, tabValue, timeRange]);

  const getHoursFromRange = (range: TimeRange): number => {
    switch (range) {
      case '1h':
        return 1;
      case '24h':
        return 24;
      case '3d':
        return 72; // 3天 = 3 * 24小时
      default:
        return 1;
    }
  };

  const fetchRecentData = async () => {
    if (!node) return;

    try {
      setLoadingRecent(true);
      const hours = getHoursFromRange(timeRange);
      const response = await fetch(`/api/records/load?uuid=${node.uuid}&hours=${hours}`);
      const result = await response.json();

      if (result.status === 'success' && result.data) {
        const records = result.data.records || [];

        // Transform data for charts
        const transformedData = records.map((item: any) => {
          // 网络速度转换为 KB/s
          const netInKB = (item.net_in || 0) / 1024;
          const netOutKB = (item.net_out || 0) / 1024;

          // 检查 ram 和 disk 是否是字节数（如果值很大，说明是字节数而不是百分比）
          // 如果 ram > 100，说明是字节数，需要计算百分比
          let ramPercent = item.ram || 0;
          if (ramPercent > 100 && item.ram_total) {
            ramPercent = (item.ram / item.ram_total) * 100;
          }

          let diskPercent = item.disk || 0;
          if (diskPercent > 100 && item.disk_total) {
            diskPercent = (item.disk / item.disk_total) * 100;
          }

          return {
            time: item.time,
            cpu: item.cpu || 0,
            ram: ramPercent,
            disk: diskPercent,
            load: item.load || 0,
            network_in: netInKB,
            network_out: netOutKB,
          };
        });

        setRecentData(transformedData);
      }
    } catch (error) {
      console.error('Failed to fetch recent data:', error);
    } finally {
      setLoadingRecent(false);
    }
  };

  if (!node) return null;

  const cpuUsage = status?.cpu.usage || 0;
  const ramUsage = status ? (status.ram.used / status.ram.total) * 100 : 0;
  const diskUsage = status ? (status.disk.used / status.disk.total) * 100 : 0;
  const swapUsage = status && status.swap.total > 0
    ? (status.swap.used / status.swap.total) * 100
    : 0;
  const countryCode = emojiToCountryCode(node.region || '');
  const flagUrl = countryCode ? `https://cdn.sevencdn.com/gh/lipis/flag-icons/flags/1x1/${countryCode}.svg` : '';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <ComputerIcon color="primary" />
            <Box>
              <Typography variant="h6">{node.name}</Typography>
              <Box display="flex" alignItems="center" gap={1}>
                {flagUrl && (
                  <Avatar 
                    src={flagUrl} 
                    alt={node.region}
                    sx={{ width: 16, height: 16 }}
                  />
                )}
                <Typography variant="caption" color="text.secondary">
                  {node.os}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={online ? '在线' : '离线'}
              color={online ? 'success' : 'default'}
              size="small"
            />
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab
            icon={<InfoIcon />}
            label="概览"
            iconPosition="start"
          />
          <Tab
            icon={<TimelineIcon />}
            label="历史数据"
            iconPosition="start"
          />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Stack spacing={3}>
            {/* 系统信息 */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  系统信息
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      CPU
                    </Typography>
                    <Typography variant="body1">{node.cpu_name}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      核心数
                    </Typography>
                    <Typography variant="body1">{node.cpu_cores}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      内存
                    </Typography>
                    <Typography variant="body1">{formatBytes(node.mem_total)}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      磁盘
                    </Typography>
                    <Typography variant="body1">{formatBytes(node.disk_total)}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      GPU
                    </Typography>
                    <Typography variant="body1">{node.gpu_name || 'None'}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      架构
                    </Typography>
                    <Typography variant="body1">{node.arch}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      虚拟化
                    </Typography>
                    <Typography variant="body1">{node.virtualization}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      内核版本
                    </Typography>
                    <Typography variant="body1">{node.kernel_version}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* 当前状态 */}
            {online && status && (
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    当前状态
                  </Typography>
                  <Stack spacing={2}>
                    {/* CPU */}
                    <Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <ComputerIcon fontSize="small" color="primary" />
                          <Typography variant="body2">CPU</Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="medium">
                          {formatPercentage(cpuUsage)}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={cpuUsage}
                        color={getColorByUsage(cpuUsage)}
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                    </Box>

                    {/* 内存 */}
                    <Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <MemoryIcon fontSize="small" color="primary" />
                          <Typography variant="body2">内存</Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="medium">
                          {formatBytes(status.ram.used)} / {formatBytes(status.ram.total)} ({formatPercentage(ramUsage)})
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={ramUsage}
                        color={getColorByUsage(ramUsage)}
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                    </Box>

                    {/* 磁盘 */}
                    <Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <StorageIcon fontSize="small" color="primary" />
                          <Typography variant="body2">磁盘</Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="medium">
                          {formatBytes(status.disk.used)} / {formatBytes(status.disk.total)} ({formatPercentage(diskUsage)})
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={diskUsage}
                        color={getColorByUsage(diskUsage)}
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                    </Box>

                    {/* Swap */}
                    {status.swap.total > 0 && (
                      <Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">Swap</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatBytes(status.swap.used)} / {formatBytes(status.swap.total)} ({formatPercentage(swapUsage)})
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={swapUsage}
                          color={getColorByUsage(swapUsage)}
                          sx={{ height: 8, borderRadius: 1 }}
                        />
                      </Box>
                    )}

                    <Divider />

                    {/* 网络 */}
                    <Box>
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <NetworkCheckIcon fontSize="small" color="primary" />
                        <Typography variant="body2" fontWeight="bold">网络</Typography>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">
                            ↑ 上传
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {formatBytes(status.network.up)}/s
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            总计: {formatBytes(status.network.totalUp)}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">
                            ↓ 下载
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {formatBytes(status.network.down)}/s
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            总计: {formatBytes(status.network.totalDown)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Stack>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box mb={3}>
            <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
              <Typography variant="body2" color="text.secondary">
                时间范围:
              </Typography>
              <ToggleButtonGroup
                value={timeRange}
                exclusive
                onChange={(_, newRange) => newRange && setTimeRange(newRange)}
                size="small"
              >
                <ToggleButton value="1h">
                  1小时
                </ToggleButton>
                <ToggleButton value="24h">
                  24小时
                </ToggleButton>
                <ToggleButton value="3d">
                  3天
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          {loadingRecent ? (
            <Box textAlign="center" py={4}>
              <CircularProgress />
              <Typography mt={2}>加载中...</Typography>
            </Box>
          ) : recentData.length > 0 ? (
            <Stack spacing={4}>
              <LazyChart
                data={recentData}
                type="area"
                title="CPU 使用率"
                dataKey="cpu"
                color="#1976d2"
                unit="%"
                height={250}
              />
              <LazyChart
                data={recentData}
                type="area"
                title="内存使用率"
                dataKey="ram"
                color="#2e7d32"
                unit="%"
                height={250}
              />
              <LazyChart
                data={recentData}
                type="area"
                title="磁盘使用率"
                dataKey="disk"
                color="#ed6c02"
                unit="%"
                height={250}
              />
              <LazyChart
                data={recentData}
                type="line"
                title="系统负载"
                dataKey="load"
                color="#9c27b0"
                unit=""
                height={250}
              />
              <LazyChart
                data={recentData}
                type="bar"
                title="网络下载速度"
                dataKey="network_in"
                color="#0288d1"
                unit=" KB/s"
                height={250}
              />
              <LazyChart
                data={recentData}
                type="bar"
                title="网络上传速度"
                dataKey="network_out"
                color="#f57c00"
                unit=" KB/s"
                height={250}
              />
            </Stack>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">暂无历史数据</Typography>
            </Box>
          )}
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  );
}
